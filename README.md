# MyTodo (mytodo-frontend)

MyTodo wed端

# 更新说明

v1.0.3: 2024年06月14日

# 运行指南

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

# docker部署

修改 `quasar.config.js` 文件中的 `BASE_URL`。

构建生产环境版本，生成 dist 文件夹

```bash
quasar build
```

构建 docker 镜像

```shell
docker build -t mytodo-frontend:latest .
```

本地运行

```bash
docker run -d --name mytodo-frontend -p 8081:80 mytodo-frontend:latest
```

访问：http://localhost:8081

## Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# CI/CD

采用主干开发，主干发布的方式

先设置 GitHub Secrets ，请按照以下步骤操作：

1. 打开 GitHub 仓库。
2. 转到 Settings（设置）。
3. 在左侧菜单中选择 Secrets and variables -> Actions。
4. 点击 New repository secret。
5. 添加以下变量：

- DOCKER_USERNAME: 你的 Docker Hub 用户名。
- DOCKER_PASSWORD: 你的 Docker Hub 密码。
- BASE_URL: 后端的url，例如 http://localhost:8787/api

main分支上，提交时给提交打上vx.x.x的tag，推送到github后，action会被触发，完成镜像构建和镜像推送。

会推送两个镜像，一个带有tag x.x.x，一个带有tag latest。
