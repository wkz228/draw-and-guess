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