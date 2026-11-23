# 趣图生花 · FunMeme

<p align="center">
  <img src="utools/logo.png" width="96" height="96" alt="FunMeme" />
</p>

离线秒开、按需联网的 uTools 表情包与斗图工作室：内置 12 款离线精选斗图卡片与 10 款手绘矢量梗图模板，支持一键加字加贴纸、8 款爆款文字大字报表情、80+ Emoji 与 60+ 颜文字检索（含 512px 大号贴纸 PNG 生成），并可按需接入 Imgflip / GIPHY / Tenor / 自定义 JSON 公开接口在线搜图。

## 功能预览

| 在线斗图（离线精选图包） | 梗图制作（手绘模板 & 加字贴纸） |
| :---: | :---: |
| ![在线斗图](docs/screenshots/home.png) | ![梗图制作](docs/screenshots/maker.png) |

| 文字表情（8 款爆款大字报） | Emoji 贴纸与颜文字库 |
| :---: | :---: |
| ![文字表情](docs/screenshots/textmeme.png) | ![Emoji与颜文字](docs/screenshots/emoji.png) |

| 深色模式 · 梗图制作工作室 |
| :---: |
| ![深色模式](docs/screenshots/dark.png) |

## 核心特性

- **在线斗图**：默认以「内置精选（离线秒开）」展示 12 款矢量渲染梗图卡片，零外网等待；支持按热门标签（`打工人`、`摸鱼`、`震惊`、`OK`、`无语`、`点赞`、`猫猫`、`代码`）即时筛选，一键复制图片、送去加字或加入收藏。
- **按需联网搜图**：可选切换至 **Imgflip 热门梗图（免 Key 公开接口）**、**GIPHY**、**Tenor** 或**自定义 HTTPS JSON 接口**，仅在用户主动点击「联网拉取」或按回车时发起请求。
- **梗图制作**：内置 10 款高辨识度矢量手绘经典模板（熊猫头思考、熊猫头举牌、滑稽斜眼盯、震撼问号、拒绝/真香二格、代码能跑别动、老板画大饼、摸鱼中勿扰、灵魂画手、超级点赞夸夸），同时支持拖入、粘贴（`Ctrl/Cmd+V`）或文件打开本地图片；可调节顶部/底部配文、字号、描边、字色、描边色、对齐方式、直角/圆角/圆形裁切以及快捷贴纸徽章（`笑死`、`破防`、`666`、`摸鱼`、`收到`、`已老实`、`尊重`、`respect`）。
- **文字表情**：8 款一键出图风格（经典黑底大字报、白底粗黑字、熊猫举牌、微信聊天气泡、喜报红金、赛博霓虹、便利贴手写感、代码终端报错风）与 6 条热门文案预设，支持从 uTools 选中文字直接唤起生成。
- **Emoji & 颜文字**：内置 80+ 精选 Emoji 与 60+ 颜文字（各 6 大分类 + 中英文关键词搜索），点击即复制；Emoji 额外支持一键生成带白边或透明底的 **512×512 PNG 大号贴纸图**。
- **uTools AI / MCP 工具**：
  - `search_emoji_kaomoji`：按关键词与分类离线检索内置 Emoji 与颜文字库；
  - `list_meme_templates`：列出 10 款内置梗图模板 ID、中英文名、分类与默认配文；
  - `build_text_meme_config`：校验并生成标准化的文字表情配置对象。

## 联网接口与隐私说明

- **默认完全离线**：插件启动、切换标签、制作梗图、文字表情和检索 Emoji/颜文字均在本地完成，不会向任何外部服务发起自动请求。
- **按需联网**：仅在你在「在线斗图」中手动选择在线来源并点击「联网拉取」时，才通过 HTTPS 向对应公开服务（`api.imgflip.com`、`api.giphy.com`、`tenor.googleapis.com` 或你填写的自定义 HTTPS 接口）发起请求；内网/本地地址与非 HTTPS 链接会被 `preload.js` 拦截。
- **本地存储**：收藏的表情包与可选的 GIPHY / Tenor API Key、自定义接口地址均仅保存在本机 `localStorage`，不上传至其他第三方服务器，也不会通过 AI/MCP 工具暴露任何 API Key。

## 本地开发与构建

```bash
pnpm install
sh build.sh
```

运行单元测试与自动截图校验：

```bash
pnpm test
node scripts/screenshots.mjs
```

打包 `.upxs` 发布说明请参考 [docs/release-upxs.md](docs/release-upxs.md)。

## 开源协议

[MIT](LICENSE)
