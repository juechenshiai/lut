# LUT 自动同步 / Automated LUT Sync

本仓库使用 GitHub Actions 每周检查已镜像来源：

- [slaycamera/luts](https://github.com/slaycamera/luts)
- [abpy/FujifilmCameraProfiles](https://github.com/abpy/FujifilmCameraProfiles)
- [BBC HDR Television Production LUTs](https://github.com/bbc/bbc_hdr_television_production_luts)
- [TrondW/glassmeter-film-looks](https://github.com/TrondW/glassmeter-film-looks)

工作流先读取来源分支最新提交。来源提交没有变化时直接退出，不创建提交；来源提交发生变化但指定 LUT 目录没有实际文件变化时同样不创建提交。只有检测到新增、修改或删除的已许可 LUT 文件时，才会通过 GitHub API 生成一次同步提交。

## 运行方式

- 定时：每周日 04:17 UTC。
- 手动：GitHub Actions 中运行 `Sync LUT sources`，可使用 `workflow_dispatch`。
- 权限：工作流仅请求 `contents: write`，用于写入同步后的 LUT、状态和归属文件。
- 临时数据：LUT 内容只在 GitHub Actions runner 的内存缓冲中传输，runner 任务结束后销毁；本仓库不在本地开发目录保存 LUT。

来源目录、目标目录和扩展名筛选位于 [`luts-sources.json`](luts-sources.json)。最新上游提交基线位于 [`source-commits.json`](source-commits.json)。同步逻辑位于 [`scripts/sync-luts.mjs`](scripts/sync-luts.mjs)。LUT 目录索引位于 [`luts-catalog.json`](luts-catalog.json)。

来源提交未变化时，工作流不会扫描文件树或下载任何 LUT。来源提交变化后，才扫描配置目录，并对比上游 Git blob SHA 与目标仓库现有文件 SHA；只传输有变化的 LUT，且仅在确有 LUT 新增、修改或删除时提交。检测到 LUT 变化时，同一提交会重建 [`luts-catalog.json`](luts-catalog.json)，保留已存在的人工元数据并同步新增/删除条目。README 等与 LUT 无关的上游提交不会导致目标仓库产生提交。

同步只覆盖 `luts-sources.json` 声明的目标前缀，不会删除其他路径。每次产生同步提交时同时更新 `ATTRIBUTION.md` 的来源快照和 `sync-state.json`。许可证和署名要求仍以各来源的上游条款及仓库内许可证副本为准。

---

The repository uses GitHub Actions to check the mirrored sources weekly:

- [slaycamera/luts](https://github.com/slaycamera/luts)
- [abpy/FujifilmCameraProfiles](https://github.com/abpy/FujifilmCameraProfiles)
- [BBC HDR Television Production LUTs](https://github.com/bbc/bbc_hdr_television_production_luts)
- [TrondW/glassmeter-film-looks](https://github.com/TrondW/glassmeter-film-looks)

The workflow first reads the latest commit on each configured source branch. If no source commit changed, it exits without creating a commit. If a source commit changed but no file under its configured LUT directory changed, it also exits without a commit. A single sync commit is created only when an allowed LUT file is added, modified, or deleted.

## Operation

- Schedule: every Sunday at 04:17 UTC.
- Manual run: use `workflow_dispatch` for `Sync LUT sources` in GitHub Actions.
- Permissions: the workflow requests only `contents: write` to update mirrored LUTs, state, and attribution.
- Temporary data: LUT bytes are transferred through in-memory buffers on the ephemeral GitHub Actions runner; this repository does not save LUTs in the local development directory.

Source prefixes, target prefixes, and extension filters are defined in [`luts-sources.json`](luts-sources.json). Latest upstream commit baselines are stored in [`source-commits.json`](source-commits.json). Synchronization logic is in [`scripts/sync-luts.mjs`](scripts/sync-luts.mjs).

When source commits are unchanged, the workflow does not scan source trees or download any LUTs. When a source commit changes, it scans the configured directory and compares upstream Git blob SHAs with the target repository's existing file SHAs. Only changed LUTs are transferred, and a commit is created only when a LUT is added, modified, or deleted. When LUTs change, the same commit rebuilds [`luts-catalog.json`](luts-catalog.json), preserving existing curated metadata while adding and removing entries as needed. Upstream README-only changes do not create a target commit.

The sync only manages the target prefixes declared in `luts-sources.json` and does not delete unrelated paths. When a sync commit is needed, it updates both the source snapshot in `ATTRIBUTION.md` and `sync-state.json`. License and attribution requirements remain governed by upstream terms and the license copies in this repository.
