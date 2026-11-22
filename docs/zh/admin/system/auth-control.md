# 认证控制

>`系统 -> 认证控制` 聚焦“怎么让用户登录和校验身份”, 而不是角色/权限。这里可以集中配置邮箱、短信、社交账号以及设备认证等多种方式, 并内置测试工具确保配置可立即生效。

## 模块概览

- **通信方式**: 邮箱登录与短信登录, 支持验证码流程、白名单策略以及模板维护。
- **社交账号**: Apple、Google、Facebook、GitHub、Telegram 五种主流 OAuth/机器人方案, 均可独立开启/关闭。
- **设备认证**: 针对客户端设备的登录策略, 支持虚拟机拦截及通信密钥。

下面内容与后台页面的分区保持一致, 建议依次配置、测试并保存。

## 通信方式

### 邮箱认证

1. **基础开关**
   - `启用邮箱登录`: 控制是否在用户端展示邮箱登录入口。
   - `邮箱验证`: 要求新用户或敏感操作必须先完成验证码校验。
   - `域名白名单`: 仅允许特定后缀(如 `gmail.com`)注册/登录, 可在下方列表一行一个填入。

2. **邮件发送**
   - 选择 **SMTP**、**Resend** 或 **Cloudflare Email Service**。
   - SMTP 需要服务器地址、端口、加密方式和中继凭据。
   - Resend 需要有发信权限的 API Key。Cloudflare 需要 Account ID 和具有 **Email Sending Write** 权限的 API Token。
   - 填写发件地址和可选的回复地址。使用 API 服务时，先在服务商处验证发信域名。
   - 保存后重新打开邮箱设置，点击**发送测试邮件**验证所选账户。

3. **模板管理** (位于页签 `验证邮件 / 到期提醒 / 维护公告 / 流量超限`)
   - 模板支持 HTML 并带有变量, 常用变量如下:
     - <code v-pre>{{.Type}}</code>: 邮件类型 (1 注册, 2 重置密码), 可结合 <code v-pre>{{if eq .Type 1}}</code> 编写条件。
     - <code v-pre>{{.SiteLogo}}</code> / <code v-pre>{{.SiteName}}</code>: 站点 Logo 与名称。
     - <code v-pre>{{.Expire}}</code>: 验证码过期时间; <code v-pre>{{.ExpireDate}}</code>: 订阅到期日。
     - <code v-pre>{{.Code}}</code>: 验证码内容。
     - <code v-pre>{{.MaintenanceDate}}</code>、<code v-pre>{{.MaintenanceTime}}</code>: 维护公告专用。
   - 所有模板使用统一的所见即所得编辑器, 保存后立即作用于新发邮件。

### 手机(短信)认证

1. **登录策略**
   - `启用短信登录`: 控制手机号验证码入口。
   - `区号白名单`: 打开后仅允许填写白名单区号, 列表通过输入框逐个添加, 例如 `1, 852, 886`。

2. **平台选择与动态字段**
   - 下拉选择 SMS 平台后, 系统会自动展示该平台所需字段并提供"去申请"链接。
   - 常见字段: `Access Key / Secret Key / Endpoint / Template Code / Sign Name / 专用手机号`。
   - 如果平台支持自定义模板, 需要在文本框内填入包含 <code v-pre>{{code}}</code>(或供应商自定义变量)的正文。

3. **测试短信**
   - 右下角可选择区号 + 填写手机号, 点击“测试短信”直接调用短信网关。
   - 发送失败通常与 AccessKey、签名或模板审核状态有关, 建议先在供应商控制台验证。

## 社交认证

每个社交方式都使用统一的抽屉式设置, 包含「启用开关」与所需凭证字段。所有凭证填写完成后点击“保存”即可立即在登录页展示相应按钮。

### Apple Sign-In
- **Team ID / Key ID**: 来自 Apple Developer 账户。
- **Service ID (Client ID)**: 在 Apple Developer -> Identifiers 中创建。
- **Private Key**: `.p8` 文件内容, 需要完整包含 `BEGIN/END`。
- **Redirect URL**: 登录完成后跳转回后台的 API 地址, 不要以 `/` 结尾。

### Google Sign-In
- **Client ID** 与 **Client Secret**: 在 Google Cloud Console 的 OAuth 同意屏幕中创建, 类型选择 Web 应用。
- 需要在 Google 控制台中为 Redirect URI 配置管理员站点的 `/api/auth/google/callback`(示例)。

### Facebook 登录
- **App ID / App Secret**: 来源于 Facebook Developer 平台。确保将站点域名加入“有效 OAuth 重定向 URI”。

### GitHub 登录
- **Client ID / Client Secret**: 在 GitHub Developer Settings -> OAuth Apps 生成。
- 请将回调地址设为 `https://your-domain.com/api/auth/github/callback` 并允许 HTTPS 访问。

### Telegram 登录
- **Bot ID / Bot Token**: 通过 @BotFather 获取, 记得开启“Login Widget”权限。
- Telegram 登录依赖机器人对话, 配置完成后即可在用户端调起官方授权弹窗。

## 设备认证

适用于需要在客户端或 Set-Top-Box 上做一次性配对登录的场景。

- `启用设备登录`: 开关后终端可以通过设备码/二维码方式登录。
- `显示广告`: 控制设备端是否展示广告位(用于商业化)。
- `阻止虚拟机`: 启用后检测到虚拟机或模拟器将拒绝登录。
- `启用通信安全`: 强制客户端每个请求都携带通信密钥。
- `通信密钥`: 管理员可以手动粘贴或使用骰子按钮自动生成 32 位 GUID, 建议每个渠道独立密钥并妥善保管。

## 操作建议

- 切换邮件/SMS 服务商前先复制旧配置, 保存为版本记录。
- 每次修改发信服务或模板后都使用“发送测试邮件”验证, 避免正式用户收不到通知。
- SMS 平台字段因供应商不同而改变, 如果列表中没有需要的字段, 需要在供应商配置里通过自定义模板变量兼容。
- 对于 Apple/Google 等 OAuth, 建议先在沙箱或测试账号演练一遍授权流程, 确认 Redirect URI 正确。
- `通信密钥` 属于敏感凭证, 只对接入客户端公开, 禁止写入前端代码仓库。

## 常见问题

### 邮件可以发送, 用户仍提示“验证码发送失败”？
- 检查是否开启邮箱后缀白名单, 与用户输入的邮箱域一致。
- 如果使用企业 SMTP, 需确认发件地址与 SMTP 账号一致, 否则服务商可能拦截。

### 短信发送失败
- 平台模板是否审核通过; 模板参数名是否与平台 <code v-pre>{{code}}</code>(或其别名)一致。
- 区号白名单是否包含目标国家/地区。
- 若仍失败, 打开浏览器调试台查看 API 返回的错误码, 对照短信服务商文档定位。

### OAuth 登录跳回站点后出现 `redirect_uri_mismatch`
- Facebook/Google/GitHub 都要求将回调 URL 精确填写, 包括协议与尾部路径, 需与后台配置完全一致。

## 相关文档

- [系统配置](/zh/admin/system/config): 设置站点名称、Logo、SMTP 基本参数等。
- [支付配置](/zh/admin/system/payment): 配置业务付费前, 建议先打通认证方式。
- [广告配置](/zh/admin/system/ads): 与设备认证中的“显示广告”配合使用。
