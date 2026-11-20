# LUT Collection / LUT 滤镜采集整理

[简体中文](#简体中文) | [English](#english)

## 简体中文

本项目用于从公开的网络项目中发现、采集和整理 LUT（Look-Up Table，色彩查找表）资源及其来源信息，便于学习、研究与个人非商业用途。项目不以销售 LUT、提供商业授权或从采集内容中获利为目的。

### 来源

当前来源分为已镜像和仅链接两类。以下两个项目仅提供上游链接与分类信息，不在本仓库托管其 LUT 文件；因为尚未确认具体素材的再分发许可，请前往上游仓库查看和遵守其条款。

| 项目 | 分类 / 内容 | 状态与说明 |
|---|---|---|
| [YahiaAngelo/Film-Luts - luts](https://github.com/YahiaAngelo/Film-Luts/tree/main/luts) | 黑白、彩色反转片、Fujifilm X-Trans III、消费级/专业即时成像、彩色/新式/传统负片、打印 | **仅链接，不托管文件。** 仓库虽标注 MIT，但 README 对 LUT 所有权作了免责声明，不能据此确认具体 LUT 可再分发。 |
| [imnz730/LUTs](https://github.com/imnz730/LUTs) | ACES、相机厂商 LUT、DCI、DJI、Film Looks、HDR、VFX 与色彩空间转换 | **仅链接，不托管文件。** 未识别到仓库许可证或明确的 LUT 再分发声明。 |

其他已镜像来源及其分类、署名和许可条件见下表：

- [slaycamera/luts - luts](https://github.com/slaycamera/luts/tree/main/luts)
- [abpy/FujifilmCameraProfiles - cube lut](https://github.com/abpy/FujifilmCameraProfiles/tree/master/cube%20lut)
- [BBC HDR Television Production LUTs - BBC LUT Release v1-8 Grouped](https://github.com/bbc/bbc_hdr_television_production_luts/tree/main/LUT_files/CUBE_LUT_files/BBC_LUT_Release_v1-8_Grouped_2026-09-16)

所有 LUT 及相关内容均归其各自作者或权利人所有。此处列出来源不代表本项目拥有这些内容，也不构成任何形式的授权、担保或对上游项目的背书。使用者应访问对应来源，核对具体文件的许可证、署名要求和其他使用条件，并自行确保其使用方式符合适用条款。

### 已镜像分类与署名

| 目标目录 | 分类 / 内容 | 数量 | 来源与许可 |
|---|---|---:|---|
| [`luts/slaycamera/`](luts/slaycamera/) | Amber、Fade、Neon、Film、Portrait 电影感 LUT | 5 | [slaycamera/luts](https://github.com/slaycamera/luts/tree/main/luts)，作者 slay，CC BY 4.0；须署名，上游说明不得原样出售原始文件。 |
| [`luts/fujifilm-camera-profiles/`](luts/fujifilm-camera-profiles/) | Fujifilm 外观模拟：Provia、Velvia、Astia、Classic Chrome、Pro Neg、Eterna、Reala Ace 等；含 Display P3 与 sRGB 版本 | 22 | [abpy/FujifilmCameraProfiles](https://github.com/abpy/FujifilmCameraProfiles/tree/master/cube%20lut)，CC BY-NC-SA 4.0；须署名、非商业使用并以相同许可共享。 |
| [`luts/bbc-hdr/v1.8-grouped/`](luts/bbc-hdr/v1.8-grouped/) | BBC HDR/SDR 转换 LUT：DaVinci Type III Headroom（12）、Deprecated Conversions（44）、Primary Live Production Type III Headroom（20）、Primary Post-Production Type I Nominal Range（12）、Secondary Conversions（22）、Test LUTs（4） | 114 | [BBC LUT Release v1.8](https://github.com/bbc/bbc_hdr_television_production_luts/tree/main/LUT_files/CUBE_LUT_files/BBC_LUT_Release_v1-8_Grouped_2026-09-16)，Apache-2.0；须随附许可证并保留适用声明。 |
| [`luts/glassmeter/`](luts/glassmeter/) | 30 种胶片模拟：彩色负片、反转片、黑白及 CineStill；sRGB 33³ .cube | 30 | [GlassMeter Film Looks](https://github.com/TrondW/glassmeter-film-looks/tree/main/luts/cube-srgb-33)，CC BY 4.0；署名 **Film simulations from GlassMeter by Glass Works (glass-works.ai)**。 |

以上镜像均为 `.cube` 文件。GlassMeter LUT 为 sRGB 输入/输出的 33³ 查找表。完整归属、许可证文本和适用说明见 [`ATTRIBUTION.md`](ATTRIBUTION.md) 与 [`licenses/`](licenses/)。YahiaAngelo/Film-Luts 和 imnz730/LUTs 目前仅列为来源，因具体 LUT 的再分发许可未确认，未复制其文件。

### 非商业用途与删除说明

- 本项目仅作资源采集、分类和来源记录，不用于商业行为；不得将本项目理解为商业授权或商业用途许可。
- 上游仓库的许可证或权利声明可能因项目、文件或版本而异。若其条款与本项目的非商业用途声明不一致，应以适用于具体内容的上游条款及权利人要求为准；本项目不会扩大或替代上游授权。
- 收录内容可能在任何时候删除或调整，包括但不限于上游作者或权利人提出要求、许可证或来源无法确认、上游资源失效，或项目维护需要。项目不保证资源持续可用。
- 若你是相关内容的权利人并希望移除内容或更正来源信息，请通过 GitHub Issues 联系维护者，并提供相关文件路径和权利说明。

## English

This project discovers, collects, and organizes LUT (Look-Up Table) resources and their source information from publicly available projects for learning, research, and personal non-commercial use. It is not intended to sell LUTs, grant commercial licenses, or generate commercial revenue from collected materials.

### Sources

The source list distinguishes mirrored files from link-only references. The two projects below are listed with upstream links and category metadata only; their LUT files are not hosted here because redistribution permission for the specific assets has not been confirmed. Visit the upstream repositories to review and follow their terms.

| Project | Categories / contents | Status and notes |
|---|---|---|
| [YahiaAngelo/Film-Luts - luts](https://github.com/YahiaAngelo/Film-Luts/tree/main/luts) | Black and white, color slide, Fujifilm X-Trans III, consumer/pro instant, color/new/old negative, and print looks | **Link only; files are not hosted here.** The repository is marked MIT, but its README disclaims ownership of the LUTs, so that label does not confirm redistribution rights for the specific files. |
| [imnz730/LUTs](https://github.com/imnz730/LUTs) | ACES, camera-vendor LUTs, DCI, DJI, film looks, HDR, VFX, and color-space conversions | **Link only; files are not hosted here.** No repository license or explicit LUT redistribution terms were identified. |

Other mirrored sources and their categories, attribution, and license terms are listed below:

- [slaycamera/luts - luts](https://github.com/slaycamera/luts/tree/main/luts)
- [abpy/FujifilmCameraProfiles - cube lut](https://github.com/abpy/FujifilmCameraProfiles/tree/master/cube%20lut)
- [BBC HDR Television Production LUTs - BBC LUT Release v1-8 Grouped](https://github.com/bbc/bbc_hdr_television_production_luts/tree/main/LUT_files/CUBE_LUT_files/BBC_LUT_Release_v1-8_Grouped_2026-09-16)

All LUTs and related materials remain the property of their respective authors or rights holders. Listing a source does not mean this project owns the material, grant any license, make any warranty, or imply endorsement of an upstream project. Users should visit each source and verify the license, attribution requirements, and other terms applicable to each file, and are responsible for ensuring their use complies with those terms.

### Mirrored Categories and Attribution

| Target directory | Category / contents | Count | Source and license |
|---|---|---:|---|
| [`luts/slaycamera/`](luts/slaycamera/) | Amber, Fade, Neon, Film, and Portrait cinematic LUTs | 5 | [slaycamera/luts](https://github.com/slaycamera/luts/tree/main/luts), creator slay, CC BY 4.0; attribution required. The upstream README says not to sell the original files as-is. |
| [`luts/fujifilm-camera-profiles/`](luts/fujifilm-camera-profiles/) | Fujifilm looks including Provia, Velvia, Astia, Classic Chrome, Pro Neg, Eterna, and Reala Ace; Display P3 and sRGB variants | 22 | [abpy/FujifilmCameraProfiles](https://github.com/abpy/FujifilmCameraProfiles/tree/master/cube%20lut), CC BY-NC-SA 4.0; attribution, non-commercial use, and same-license sharing required. |
| [`luts/bbc-hdr/v1.8-grouped/`](luts/bbc-hdr/v1.8-grouped/) | BBC HDR/SDR conversion LUTs: DaVinci Type III Headroom (12), Deprecated Conversions (44), Primary Live Production Type III Headroom (20), Primary Post-Production Type I Nominal Range (12), Secondary Conversions (22), and Test LUTs (4) | 114 | [BBC LUT Release v1.8](https://github.com/bbc/bbc_hdr_television_production_luts/tree/main/LUT_files/CUBE_LUT_files/BBC_LUT_Release_v1-8_Grouped_2026-09-16), Apache-2.0; include the license and retain applicable notices. |
| [`luts/glassmeter/`](luts/glassmeter/) | 30 film simulations: color negative, slide, black and white, and CineStill; sRGB 33³ .cube | 30 | [GlassMeter Film Looks](https://github.com/TrondW/glassmeter-film-looks/tree/main/luts/cube-srgb-33), CC BY 4.0; credit **Film simulations from GlassMeter by Glass Works (glass-works.ai)**. |

All mirrored files are `.cube` LUTs. The GlassMeter LUTs are 33³ sRGB-in/sRGB-out tables. See [`ATTRIBUTION.md`](ATTRIBUTION.md) and [`licenses/`](licenses/) for full attribution, license texts, and applicable terms. YahiaAngelo/Film-Luts and imnz730/LUTs are listed as sources only; their specific LUT redistribution permissions have not been confirmed, so their files are not mirrored.

### Non-commercial Use and Removal

- This project is for resource collection, categorization, and source attribution only. It is not for commercial activity and must not be interpreted as a commercial license or permission for commercial use.
- Licenses and rights notices may differ by project, file, or version. If an upstream term or rights notice differs from this project's non-commercial-use statement, the applicable upstream terms and rights-holder requirements govern the specific material. This project does not expand or replace upstream permissions.
- Materials may be removed or updated at any time, including when requested by an upstream author or rights holder, when a license or source cannot be verified, when an upstream resource becomes unavailable, or for project maintenance. Continued availability is not guaranteed.
- Rights holders may contact the maintainer through GitHub Issues to request removal or correction of source information, providing the relevant file path and rights details.
