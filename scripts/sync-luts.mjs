import fs from 'node:fs/promises';

const api = 'https://api.github.com';
const ownerRepo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const config = JSON.parse(await fs.readFile('luts-sources.json', 'utf8'));
const commitStatePath = 'source-commits.json';
const catalogPath = 'luts-catalog.json';
const commitState = JSON.parse(await fs.readFile(commitStatePath, 'utf8').catch(() => '{}'));
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

/** Fetches an API or raw source resource with retries for transient errors. */
async function request(url, options = {}, retries = 5) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
      if (response.ok) return response;
      const body = await response.text();
      if ((response.status >= 500 || response.status === 429) && attempt < retries) throw new Error(`${response.status} ${body}`);
      throw new Error(`${response.status} ${url}: ${body.slice(0, 500)}`);
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

/** Reads a JSON response from the GitHub API. */
async function getJson(url, options) {
  return (await request(url, options)).json();
}

/** Creates a Git blob from bytes held in the runner memory. */
async function createBlob(bytes) {
  return (await getJson(`${api}/repos/${ownerRepo}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: Buffer.from(bytes).toString('base64'), encoding: 'base64' }),
  })).sha;
}

/** Reads the existing catalog from the target Git tree, if present. */
async function readCatalog(targetEntries) {
  const catalogEntry = targetEntries[catalogPath];
  if (!catalogEntry) return { catalogVersion: '1.0.0', formats: ['Adobe CUBE 3D LUT (.cube)'], sources: [], filters: [] };
  const blob = await getJson(`${api}/repos/${ownerRepo}/git/blobs/${catalogEntry.sha}`);
  return JSON.parse(Buffer.from(blob.content, 'base64').toString('utf8'));
}

/** Creates a basic bilingual catalog item for a newly discovered LUT. */
function catalogItem(source, file, commit) {
  const relativePath = file.path.slice(source.sourcePrefix.length);
  const filename = relativePath.split('/').pop().replace(/\.cube$/i, '');
  const label = filename.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const category = relativePath.includes('/') ? relativePath.split('/')[0].replace(/[_-]+/g, ' ') : 'General';
  const sourcePath = file.path.split('/').map(encodeURIComponent).join('/');
  const sourceLicense = source.license ?? { spdx: 'UNKNOWN', name: 'Upstream terms', url: `https://github.com/${source.repository}` };
  return {
    id: `${source.id}-${relativePath.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/-+$/g, ''),
    name: { zh: label, en: label },
    category: { zh: category, en: category },
    format: 'Adobe CUBE 3D LUT (.cube)',
    source: { id: source.id, repository: source.repository, branch: source.ref, path: file.path, commit },
    githubUrl: `https://github.com/${source.repository}/blob/${source.ref}/${sourcePath}`,
    downloadUrl: `https://raw.githubusercontent.com/${source.repository}/${source.ref}/${sourcePath}`,
    localPath: `${source.targetPrefix}${relativePath}`,
    license: sourceLicense,
    attribution: source.attribution ?? source.repository,
  };
}

/** Rebuilds the catalog while preserving curated metadata for unchanged files. */
function buildCatalog(existing, sources, sourceFilesById, latestCommits) {
  const curated = new Map(existing.filters.map(item => [item.localPath, item]));
  const filters = [];
  const sourceRows = [];
  for (const source of sources) {
    const changedFiles = sourceFilesById.get(source.id);
    const existingSource = existing.sources.find(item => item.id === source.id);
    const files = changedFiles ?? (existing.filters
      .filter(item => item.source?.id === source.id)
      .map(item => ({ path: item.source.path, sha: item.source.commit, size: 0 })));
    const commit = latestCommits[source.id]?.commit ?? existingSource?.latestKnownCommit ?? 'baseline unavailable';
    const sourceLicense = source.license ?? existingSource?.license;
    sourceRows.push({
      id: source.id,
      name: existingSource?.name ?? { zh: source.id, en: source.id },
      repository: source.repository,
      branch: source.ref,
      sourceDirectory: source.sourcePrefix,
      sourceDirectoryUrl: `https://github.com/${source.repository}/tree/${source.ref}/${source.sourcePrefix}`,
      repositoryUrl: `https://github.com/${source.repository}`,
      license: sourceLicense,
      attribution: source.attribution ?? existingSource?.attribution ?? source.repository,
      latestKnownCommit: commit,
      filterCount: files.length,
    });
    for (const file of files) {
      const localPath = `${source.targetPrefix}${file.path.slice(source.sourcePrefix.length)}`;
      const item = curated.get(localPath) ?? catalogItem({ ...source, license: sourceLicense }, file, commit);
      item.source = { ...item.source, commit };
      item.localPath = localPath;
      filters.push(item);
    }
  }
  return {
    catalogVersion: existing.catalogVersion ?? '1.0.0',
    generatedAt: new Date().toISOString().slice(0, 10),
    scope: '当前同步配置中的全部 LUT 文件；仅收录已确认上游许可并由 luts-sources.json 管理的来源。',
    scopeEn: 'All LUT files in the current sync configuration; only sources with confirmed upstream licensing and entries managed by luts-sources.json are included.',
    totalFilters: filters.length,
    formats: existing.formats ?? ['Adobe CUBE 3D LUT (.cube)'],
    sources: sourceRows,
    filters,
  };
}

/** Lists configured LUT files from an upstream Git tree. */
async function sourceFiles(source) {
  const tree = await getJson(`${api}/repos/${source.repository}/git/trees/${source.ref}?recursive=1`);
  if (tree.truncated) throw new Error(`Source tree is truncated: ${source.repository}`);
  return tree.tree
    .filter(item => item.type === 'blob' && item.path.startsWith(source.sourcePrefix))
    .filter(item => source.extensions.some(extension => item.path.toLowerCase().endsWith(extension)))
    .map(item => ({ path: item.path, size: item.size, sha: item.sha }));
}

/** Downloads one changed source file into memory and validates its tree size. */
async function sourceBytes(source, file) {
  const encodedPath = file.path.split('/').map(encodeURIComponent).join('/');
  const rawUrl = `https://raw.githubusercontent.com/${source.repository}/${source.ref}/${encodedPath}`;
  const bytes = Buffer.from(await (await request(rawUrl, { headers: { Accept: '*/*' } })).arrayBuffer());
  if (bytes.length !== file.size) throw new Error(`Size mismatch: ${source.repository}/${file.path}`);
  return bytes;
}

/** Builds the source snapshot appended to the attribution document. */
function attributionSnapshot(rows) {
  return `\n\n## Automated source snapshot / 自动来源快照\n\n| Source | Latest commit | Mirrored files |\n|---|---|---:|\n${rows.map(row => `| [${row.repository}](${row.url}) | \`${row.commit}\` | ${row.count} |`).join('\n')}\n`;
}

if (!token || !ownerRepo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required.');

const headRef = await getJson(`${api}/repos/${ownerRepo}/git/ref/heads/main`);
const headCommit = await getJson(`${api}/repos/${ownerRepo}/git/commits/${headRef.object.sha}`);
const changedSources = [];
const latestCommits = {};

for (const source of config.sources) {
  const latest = await getJson(`${api}/repos/${source.repository}/commits/${source.ref}`);
  latestCommits[source.id] = {
    repository: source.repository,
    ref: source.ref,
    commit: latest.sha,
    url: latest.html_url,
  };
  if (commitState[source.id]?.commit !== latest.sha) changedSources.push({ source, latest });
}

if (changedSources.length === 0) {
  process.stdout.write('No source commits changed; no file tree scan or commit needed.\n');
  process.exit(0);
}

const targetTree = await getJson(`${api}/repos/${ownerRepo}/git/trees/${headCommit.tree.sha}?recursive=1`);
if (targetTree.truncated) throw new Error('Target tree is truncated.');
const targetEntries = Object.fromEntries(targetTree.tree.filter(item => item.type === 'blob').map(item => [item.path, item]));
const changedEntries = [];
const sourceRows = [];
const sourceFilesById = new Map();

for (const { source, latest } of changedSources) {
  const files = await sourceFiles(source);
  sourceFilesById.set(source.id, files);
  const sourceByTargetPath = new Map(files.map(file => [
    `${source.targetPrefix}${file.path.slice(source.sourcePrefix.length)}`,
    file,
  ]));
  const managedTargets = Object.values(targetEntries)
    .filter(item => item.path.startsWith(source.targetPrefix))
    .filter(item => source.extensions.some(extension => item.path.toLowerCase().endsWith(extension)));

  for (const file of files) {
    const targetPath = `${source.targetPrefix}${file.path.slice(source.sourcePrefix.length)}`;
    const current = targetEntries[targetPath];
    if (current?.sha === file.sha) continue;
    const bytes = await sourceBytes(source, file);
    changedEntries.push({ path: targetPath, mode: '100644', type: 'blob', sha: await createBlob(bytes) });
  }
  for (const current of managedTargets) {
    if (!sourceByTargetPath.has(current.path)) changedEntries.push({ path: current.path, mode: '100644', type: 'blob', sha: null });
  }

  sourceRows.push({ repository: source.repository, commit: latest.sha, url: latest.html_url, count: files.length });
}

if (changedEntries.length === 0) {
  process.stdout.write('Source commits changed, but no configured LUT files changed; no commit created.\n');
  process.exit(0);
}

const existingCatalog = await readCatalog(targetEntries);
const nextCatalog = buildCatalog(existingCatalog, config.sources, sourceFilesById, latestCommits);
changedEntries.push({ path: catalogPath, mode: '100644', type: 'blob', sha: await createBlob(Buffer.from(`${JSON.stringify(nextCatalog, null, 2)}\n`)) });

const currentAttribution = await getJson(`${api}/repos/${ownerRepo}/contents/ATTRIBUTION.md?ref=main`);
const attributionText = Buffer.from(currentAttribution.content.replace(/\n/g, ''), 'base64').toString('utf8');
const snapshotStart = attributionText.indexOf('\n## Automated source snapshot / 自动来源快照');
const baseAttribution = snapshotStart >= 0 ? attributionText.slice(0, snapshotStart) : attributionText;
const allRows = config.sources.map(source => {
  const changed = sourceRows.find(row => row.repository === source.repository);
  const previous = commitState[source.id];
  return changed ?? {
    repository: source.repository,
    commit: previous?.commit ?? 'baseline unavailable',
    url: previous?.url ?? `https://github.com/${source.repository}/commits/${source.ref}`,
    count: previous?.count ?? 0,
  };
});
const nextAttribution = baseAttribution.trimEnd() + attributionSnapshot(allRows);
changedEntries.push({ path: 'ATTRIBUTION.md', mode: '100644', type: 'blob', sha: await createBlob(Buffer.from(nextAttribution)) });
changedEntries.push({ path: commitStatePath, mode: '100644', type: 'blob', sha: await createBlob(Buffer.from(JSON.stringify({ ...commitState, ...latestCommits }, null, 2) + '\n')) });

const tree = await getJson(`${api}/repos/${ownerRepo}/git/trees`, {
  method: 'POST',
  body: JSON.stringify({ base_tree: headCommit.tree.sha, tree: changedEntries }),
});
const commit = await getJson(`${api}/repos/${ownerRepo}/git/commits`, {
  method: 'POST',
  body: JSON.stringify({ message: 'chore: 同步上游 LUT 更新', tree: tree.sha, parents: [headCommit.sha] }),
});
await request(`${api}/repos/${ownerRepo}/git/refs/heads/main`, {
  method: 'PATCH',
  body: JSON.stringify({ sha: commit.sha, force: false }),
});
process.stdout.write(`Created sync commit ${commit.sha} for ${changedEntries.length} changed paths.\n`);
