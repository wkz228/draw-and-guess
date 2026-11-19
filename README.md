# 你画我猜 · 手机联机网页版

2–8 人联机，房间邀请链接，实时绘画、猜词聊天、90 秒计时、积分排行、自动轮换画手、中文题库、120 秒内断线重连。

## Render 公网部署（手机即可操作）

1. 登录 https://dashboard.render.com/ 。
2. 选择 **New → Blueprint**，连接 GitHub 账号并选择 `wkz228/draw-and-guess`。
3. Render 将读取根目录的 `render.yaml`，确认创建免费的 Web Service。
4. 等待 Build / Deploy 成功，在 Render 控制台打开分配的 `https://...onrender.com` 链接。
5. 创建房间并分享邀请链接给朋友。

免费服务闲置时可能休眠；实例重启会清空内存中的房间与积分。请只运行一个实例。

## 本地运行

安装 Node.js 20+，执行 `npm install`、`npm start`，打开 `http://localhost:3000`。健康检查：`/health`。

## 当前限制

这是适合朋友聚会的初版。游戏房间只保存在服务器内存，尚无账号、持久化、聊天审核或完整防滥用系统。建议部署后实际使用两部手机验证。

## 管理员题库后台

访问游戏域名下的 `/admin.html`。默认账号 `admin`，密码由 Render 环境变量设置，绝不可写入仓库。

在 Render 服务 → Environment → Add Environment Variable 中配置：

- `ADMIN_USERNAME`：`admin`（可选，默认 admin）
- `ADMIN_PASSWORD`：自选强密码（建议至少 16 位随机字符）
- `GITHUB_TOKEN`：GitHub fine-grained personal access token，仅授予 `wkz228/draw-and-guess` 仓库 **Contents: Read and write** 权限

GitHub token 创建入口：https://github.com/settings/personal-access-tokens/new 。不要把密码或令牌发给任何人，也不要提交到 GitHub。配置后选择 Save and deploy，待 Render 显示 Live 再登录后台。

后台可查看、搜索、编辑、删除、添加、批量导入、去重，并保存到 GitHub。词库文件：`words.json`、`script-words.json`。自定义房间临时词库不在后台管理范围。

**注意：** GitHub 公开仓库意味着任何人都能查看题库文件，但只有管理员凭据可以通过网站修改。保存到 GitHub 会产生提交并可能触发 Render 自动部署，导致正在进行的房间重置。请避开游戏时段维护。管理员会话仅保存在进程内存，重启后需重新登录。
