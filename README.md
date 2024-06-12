# MyTodo (mytodo-frontend)

MyTodo wed端

## 运行指南

```bash
# 安装依赖
yarn install
# or
npm install
# 使用 开发模式 启动项（支持热更新、错误报告等）
quasar dev
```

```bash
# Lint the files with ESLint
yarn lint
# or
npm run lint
```

```bash
# Format the files
yarn format
# or
npm run format
```

## docker部署

修改 `quasar.config.js` 文件中的 `BASE_URL`。

构建生产环境版本，生成 dist 文件夹

```bash
quasar build
```

构建 docker 镜像

```shell
docker build -t mytodo-frontend:1.0.0 .
```

本地运行

```bash
docker run -d --name mytodo-frontend -p 8081:80 mytodo-frontend:1.0.0
```

访问：http://localhost:8081

## Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
