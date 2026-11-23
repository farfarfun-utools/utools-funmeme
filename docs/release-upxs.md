# FunMeme `.upxs` 打包与发布说明

本项目通过 GitHub Actions（[.github/workflows/release.yml](../.github/workflows/release.yml)）在推送形如 `v0.1.0` 的标签时自动完成：

1. 校验 `package.json`、`utools/plugin.json` 与标签版本一致；
2. 执行 `sh build.sh`（ESLint、TypeScript 类型检查、Vitest 单元测试、Vite 生产构建、`preload.js` 语法与清单产物校验）；
3. 校验 `identity.json` 中的官方 `pluginId` 已填写，并使用组织密钥打包签名 `.upxs`；
4. 上传 `.upxs` 与 `SHA256SUMS.txt` 至 GitHub Release。

## 首次发布前准备

1. 在 uTools 开发者平台注册插件 **趣图生花**，获取官方 `pluginId`；
2. 确认 [identity.json](../identity.json) 中的 `pluginId` 准确无误；
3. 确认版本一致后打 tag 推送：

```bash
git tag v0.1.0
git push origin v0.1.0
```
