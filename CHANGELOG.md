# 📋 Changelog / 更新日志

This document records all notable changes to ShadCN Admin.
本文档记录了 ShadCN Admin 的所有重要变更。

## Version Guide / 版本说明
- 🔥 **Breaking Changes / 重大变更**: Contains breaking updates / 包含破坏性更新
- ✨ **Features / 新功能**: New features added / 添加的新特性
- 🐛 **Bug Fixes / 问题修复**: Fixed bugs / 修复的bug
- 📚 **Documentation / 文档**: Documentation updates / 文档相关更新
- 🎨 **Style / 样式**: Code formatting and style changes / 代码格式化、样式调整
- ♻️ **Refactoring / 重构**: Code refactoring / 代码重构
- ⚡️ **Performance / 性能**: Performance improvements / 性能优化
- 🧪 **Tests / 测试**: Test related changes / 测试相关
- 🔨 **Build / 构建**: Build system changes / 构建系统相关
- 👷 **CI/CD**: Continuous integration changes / CI/CD相关
- 🔧 **Chores / 杂项**: Other changes / 其他变更

---


## [1.11.0-dev.4](https://github.com/perfect-panel/frontend/compare/v1.11.0-dev.3...v1.11.0-dev.4) (2026-07-16)

### 🐛 Bug Fixes / 问题修复

* **admin:** copy server node config ([c812c90](https://github.com/perfect-panel/frontend/commit/c812c90a7658e28756ca287d7493064448834de5))

## [1.11.0-dev.3](https://github.com/perfect-panel/frontend/compare/v1.11.0-dev.2...v1.11.0-dev.3) (2026-07-16)

### 🐛 Bug Fixes / 问题修复

* add commission withdrawal entry ([8f47f56](https://github.com/perfect-panel/frontend/commit/8f47f56cadf0c3cecc53ad2f8903fe26b2a7ae57))
* **admin:** add ticket status filter options ([26bd632](https://github.com/perfect-panel/frontend/commit/26bd63204336b97483aaa0c5b4e3030e9c7cc45b))
* **ui:** remove unsupported 200 page size ([936c120](https://github.com/perfect-panel/frontend/commit/936c12000d5ea05be7b42d94b5608a795e6df3e6))

## [1.11.0-dev.2](https://github.com/perfect-panel/frontend/compare/v1.11.0-dev.1...v1.11.0-dev.2) (2026-07-14)

### 🐛 Bug Fixes / 问题修复

* copy subscription URL on app import ([79334ba](https://github.com/perfect-panel/frontend/commit/79334bafb41a581cd413856e16533c0fb18d0380))
* load admin store lookup data by pages ([b5091b3](https://github.com/perfect-panel/frontend/commit/b5091b3dc163d7309410877b0fb4270a483e4876))

### 👷 Continuous Integration / CI/CD

* trigger release workflow on published releases ([700fc05](https://github.com/perfect-panel/frontend/commit/700fc05ebc1fc71cbffd2227ae4a3cc5ba0bb5dc))

## [1.11.0-dev.1](https://github.com/perfect-panel/frontend/compare/v1.10.2...v1.11.0-dev.1) (2026-07-14)

### ✨ Features / 新功能

* support subscription token user search ([1884b36](https://github.com/perfect-panel/frontend/commit/1884b3609dcd746110f09c30889a7c6a5a959e5d))

### 🐛 Bug Fixes / 问题修复

* remove invalid favicon mime type ([313beb2](https://github.com/perfect-panel/frontend/commit/313beb2bfd8c9d1999e3aea799f05d906105b444))
* unblock frontend release workflow ([e9ed6ea](https://github.com/perfect-panel/frontend/commit/e9ed6eac8f780277b291dfcfddab43babf81a8b6))

### 🔧 Chores / 其他变更

* **release:** Release 1.10.1-dev.1 / 发布版本 1.10.1-dev.1 [skip ci] ([8649a93](https://github.com/perfect-panel/frontend/commit/8649a9338cc712f136186b6c4bfc9961875a4a9e))
* **release:** Release 1.10.1-dev.2 / 发布版本 1.10.1-dev.2 [skip ci] ([9fa0781](https://github.com/perfect-panel/frontend/commit/9fa07813faadbb1d5bb35416fe161edd3bc88ab6))

## [1.10.2](https://github.com/perfect-panel/frontend/compare/v1.10.1...v1.10.2) (2026-07-10)

### 🐛 Bug Fixes / 问题修复

* **auth:** align Telegram admin form fields with backend config ([69bc1ad](https://github.com/perfect-panel/frontend/commit/69bc1ade0f18a43e563aa01568ef10d514adbac1))
* trigger frontend release ([b0184f8](https://github.com/perfect-panel/frontend/commit/b0184f85bb4586969fe4a561d285f7271b546f1f))
* unblock frontend release workflow ([2a41d35](https://github.com/perfect-panel/frontend/commit/2a41d355ba323141ea392e2058a49c9dc998a9f6))

## [1.10.1-dev.1](https://github.com/perfect-panel/frontend/compare/v1.10.0...v1.10.1-dev.1) (2026-07-07)

### 🐛 Bug Fixes / 问题修复

* correctly detect iOS devices requesting desktop site ([2d1798d](https://github.com/perfect-panel/frontend/commit/2d1798df66c33005db6cf80ee63b152bbb25970b)), closes [#96](https://github.com/perfect-panel/frontend/issues/96)
* prioritize mobile device detection in getPlatform() ([388630c](https://github.com/perfect-panel/frontend/commit/388630cb5dcc4334c07d29413ce8c8582ae5d3db)), closes [#96](https://github.com/perfect-panel/frontend/issues/96)
* remove invalid favicon mime type ([313beb2](https://github.com/perfect-panel/frontend/commit/313beb2bfd8c9d1999e3aea799f05d906105b444))

### 🔧 Chores / 其他变更

* **release:** Release 1.9.2-dev.1 / 发布版本 1.9.2-dev.1 [skip ci] ([ef4c32e](https://github.com/perfect-panel/frontend/commit/ef4c32e9973cba7a29511ccc47f86065816ce741))
* **release:** Release 1.9.2-dev.2 / 发布版本 1.9.2-dev.2 [skip ci] ([12f7cde](https://github.com/perfect-panel/frontend/commit/12f7cdedebac08331531daa41e68074803e32ef9))

## [1.10.0](https://github.com/perfect-panel/frontend/compare/v1.9.1...v1.10.0) (2026-06-28)

### ✨ Features / 新功能

* add plugin management page ([6a6f9e3](https://github.com/perfect-panel/frontend/commit/6a6f9e3f145909efa6fdd13b4559e978f59f5fab))
* add plugin upload controls ([c91a87b](https://github.com/perfect-panel/frontend/commit/c91a87b0c4eb5b20154d31626a497567caa5fced))

## [1.9.1](https://github.com/perfect-panel/frontend/compare/v1.9.0...v1.9.1) (2026-06-21)

### 🐛 Bug Fixes / 问题修复

* remove duplicate show_original_price field and deduplicate duration options ([9582a9e](https://github.com/perfect-panel/frontend/commit/9582a9e8b3f58037b70be0d8826659d72d2ba0ca)), closes [#93](https://github.com/perfect-panel/frontend/issues/93)

## [1.9.0](https://github.com/perfect-panel/frontend/compare/v1.8.0...v1.9.0) (2026-06-20)

### ✨ Features / 新功能

* **admin:** add UDP over TCP (UoT) config for Shadowsocks ([06df3de](https://github.com/perfect-panel/frontend/commit/06df3dee3d7578ec6d01d72a8d79fa90ff3b847a)), closes [#91](https://github.com/perfect-panel/frontend/issues/91)
* **admin:** add UDP over TCP (UoT) config for Shadowsocks ([6942999](https://github.com/perfect-panel/frontend/commit/6942999c624b7934c45f4f3408fa629f623ad3bd)), closes [#91](https://github.com/perfect-panel/frontend/issues/91)

### 🐛 Bug Fixes / 问题修复

* **servers:** correct uot_version type and remove duplicate uot fields ([36eee9c](https://github.com/perfect-panel/frontend/commit/36eee9c4d2adb36b8be0bccba582d62821eda001))

### 🔧 Chores / 其他变更

* **release:** Release 1.8.0-dev.1 / 发布版本 1.8.0-dev.1 [skip ci] ([c43f7b3](https://github.com/perfect-panel/frontend/commit/c43f7b3e0e09ec57c172819f833d6a35bb87c7bb))

## [1.8.0-dev.1](https://github.com/perfect-panel/frontend/compare/v1.7.4...v1.8.0-dev.1) (2026-06-20)

### ✨ Features / 新功能

* **document:** inject the user's subscription link into document content ([e80e1ad](https://github.com/perfect-panel/frontend/commit/e80e1ade5710f6eda55887b42c948dc6f5ed1e60))
* **document:** show available template variables in the admin document editor ([0d9c792](https://github.com/perfect-panel/frontend/commit/0d9c79258b53b00e7f2796fe2eb138bb0fb6dc54))
* **email:** add Reply-To field to SMTP settings ([3042310](https://github.com/perfect-panel/frontend/commit/3042310fb76001b80aed591e382b753ecdb433ab)), closes [perfect-panel/server#159](https://github.com/perfect-panel/server/issues/159)

### 🐛 Bug Fixes / 问题修复

* **dashboard): correctly detect http(s:** // links and disable deep link trigger ([29440ac](https://github.com/perfect-panel/frontend/commit/29440acbe61e3cfc6d68d469bd8d2bbf81ce751d)), closes [#82](https://github.com/perfect-panel/frontend/issues/82) [#83](https://github.com/perfect-panel/frontend/issues/83)
* **dashboard:** redirect online users stat to servers page ([0818e7f](https://github.com/perfect-panel/frontend/commit/0818e7f557391df42f2249c11a423593a27159bf)), closes [#86](https://github.com/perfect-panel/frontend/issues/86)
* **user:** detect HTTP scheme and prevent redirect for plain web links ([6687706](https://github.com/perfect-panel/frontend/commit/6687706bb535dbc49eece34091be9b67d39fc2ee)), closes [#82](https://github.com/perfect-panel/frontend/issues/82)
* **user:** prevent 404 when avatar is empty in user-nav dropdown trigger ([7e310fd](https://github.com/perfect-panel/frontend/commit/7e310fd159070aa055bb962b6cbb820b42bebb3b)), closes [#76](https://github.com/perfect-panel/frontend/issues/76)

### 📚 Documentation / 文档更新

* **document:** mention subscription conditional blocks in the editor hint ([9734f57](https://github.com/perfect-panel/frontend/commit/9734f576a0db9c4fa0c614eb70a8fbab6f436fc7)), closes [perfect-panel/server#161](https://github.com/perfect-panel/server/issues/161)

### 🔧 Chores / 其他变更

* **release:** Release 1.6.6-dev.1 / 发布版本 1.6.6-dev.1 [skip ci] ([8d9a30f](https://github.com/perfect-panel/frontend/commit/8d9a30fd504b58cfa1c822916081801e3361b2e4))

## [1.7.4](https://github.com/perfect-panel/frontend/compare/v1.7.3...v1.7.4) (2026-06-11)

### 🐛 Bug Fixes / 问题修复

* **user:** prevent redirect when import button generates plain HTTP URLs ([7a7658a](https://github.com/perfect-panel/frontend/commit/7a7658a1fac3016690555a059a19da8c58f1aef9)), closes [#82](https://github.com/perfect-panel/frontend/issues/82)

## [1.7.3](https://github.com/perfect-panel/frontend/compare/v1.7.2...v1.7.3) (2026-06-10)

### 🐛 Bug Fixes / 问题修复

* **user:** disable recharge when no payment methods available ([7961408](https://github.com/perfect-panel/frontend/commit/796140809d01e7b5f4e28cb66cd5d03368f47f85)), closes [#79](https://github.com/perfect-panel/frontend/issues/79)

## [1.7.2](https://github.com/perfect-panel/frontend/compare/v1.7.1...v1.7.2) (2026-06-09)

### 🐛 Bug Fixes / 问题修复

* **user:** use avatar field instead of email for avatar image src ([5e9127e](https://github.com/perfect-panel/frontend/commit/5e9127ed0b674591097751f2f4789a8c9122d0c9))

## [1.7.1](https://github.com/perfect-panel/frontend/compare/v1.7.0...v1.7.1) (2026-06-09)

### 🐛 Bug Fixes / 问题修复

* **user:** remove non-existent menu namespace from sidebar i18n ([f920d9f](https://github.com/perfect-panel/frontend/commit/f920d9f220fc000c4ca59bfc9fe4e091d7195d91)), closes [#78](https://github.com/perfect-panel/frontend/issues/78)

## [1.7.0](https://github.com/perfect-panel/frontend/compare/v1.6.5...v1.7.0) (2026-06-08)

### ✨ Features / 新功能

* **subscribe:** admin toggle to show/hide the user tutorial section ([#75](https://github.com/perfect-panel/frontend/issues/75)) ([b1ad250](https://github.com/perfect-panel/frontend/commit/b1ad25075de08126dbbe5c5b99401cd9e1d097ae)), closes [perfect-panel/server#151](https://github.com/perfect-panel/server/issues/151)

### 🐛 Bug Fixes / 问题修复

* **user:** add clearUserLoading to GlobalStore interface ([dcdd984](https://github.com/perfect-panel/frontend/commit/dcdd984073c9c489d8a6704dc105984335abfbee))
* **user:** properly handle user loading state for navigation ([d826e4a](https://github.com/perfect-panel/frontend/commit/d826e4af638238301e90ccf44617825933319264)), closes [#74](https://github.com/perfect-panel/frontend/issues/74)

### 🔧 Chores / 其他变更

* **release:** Release 1.6.4-dev.1 / 发布版本 1.6.4-dev.1 [skip ci] ([a087bae](https://github.com/perfect-panel/frontend/commit/a087bae953449df3dfd3326881590e5a989120f6))

## [1.6.5](https://github.com/perfect-panel/frontend/compare/v1.6.4...v1.6.5) (2026-06-08)

### 🐛 Bug Fixes / 问题修复

* **user:** wait for user info to load before redirecting ([58266bf](https://github.com/perfect-panel/frontend/commit/58266bf0828ec4c07e06ac667e89196f20d64781)), closes [#74](https://github.com/perfect-panel/frontend/issues/74)

## [1.6.4](https://github.com/perfect-panel/frontend/compare/v1.6.3...v1.6.4) (2026-06-04)

### 🐛 Bug Fixes / 问题修复

* use relative path for locale files to support non-root base paths ([593d038](https://github.com/perfect-panel/frontend/commit/593d038becde535fec20b27e53bfdd2af6b6ba49)), closes [#72](https://github.com/perfect-panel/frontend/issues/72)

### 👷 Continuous Integration / CI/CD

* add weekly auto-merge develop into main workflow ([b689e8b](https://github.com/perfect-panel/frontend/commit/b689e8bd64f819122b42684697dcd86b7baac277))
* resolve conflicts with develop strategy on weekly merge ([cbd4847](https://github.com/perfect-panel/frontend/commit/cbd484746a3e7bb7a0806f6c2d9e8d42d3487852))
* sync main into develop before weekly merge ([d99a6bc](https://github.com/perfect-panel/frontend/commit/d99a6bcaf45ade9790118cea273c20bc419d217f))

### 🔧 Chores / 其他变更

* trigger release ([a66dfcb](https://github.com/perfect-panel/frontend/commit/a66dfcb13be389287fefbc034e8c3c48ae17cc32))

## [1.6.2](https://github.com/perfect-panel/frontend/compare/v1.6.1...v1.6.2) (2026-05-21)

### 🐛 Bug Fixes / 问题修复

* **server:** disable retry on node config fetch and show inline error ([#62](https://github.com/perfect-panel/frontend/issues/62)) ([819a4ac](https://github.com/perfect-panel/frontend/commit/819a4ac9e2deef632f8e2e84ac221aa25d7df4ff)), closes [#61](https://github.com/perfect-panel/frontend/issues/61)

## [1.6.1](https://github.com/perfect-panel/frontend/compare/v1.6.0...v1.6.1) (2026-05-21)

### 🐛 Bug Fixes / 问题修复

* **user:** complete auth i18n ([#60](https://github.com/perfect-panel/frontend/issues/60)) ([0f99b06](https://github.com/perfect-panel/frontend/commit/0f99b0638125142e8f44bee9c6007e95a181e67e))

## [1.6.0](https://github.com/perfect-panel/frontend/compare/v1.5.2...v1.6.0) (2026-05-20)

### ✨ Features / 新功能

* add per-node config UI and structured outbound form ([#59](https://github.com/perfect-panel/frontend/issues/59)) ([23fe0d3](https://github.com/perfect-panel/frontend/commit/23fe0d3dcb4571431446b505a92bd4143c48dad5))

## [1.5.2](https://github.com/perfect-panel/frontend/compare/v1.5.1...v1.5.2) (2026-05-19)

### 🐛 Bug Fixes / 问题修复

* **admin:** remove custom_html injection from admin panel root ([0277e4a](https://github.com/perfect-panel/frontend/commit/0277e4ae3882b17ab45fcbec27c18c38d92f023c)), closes [#56](https://github.com/perfect-panel/frontend/issues/56)
* **announcement:** remove incorrect pinned/popup false filters on announcement list page ([7dac476](https://github.com/perfect-panel/frontend/commit/7dac476b99d01a46e918c4fdbd4d8377a04885f6)), closes [#49](https://github.com/perfect-panel/frontend/issues/49)
* **nodes:** normalize null tags to [] in node-form to prevent Invalid input error ([33ad713](https://github.com/perfect-panel/frontend/commit/33ad713f25b9e1193462ae641d4c6e97f4056dbd)), closes [#51](https://github.com/perfect-panel/frontend/issues/51)
* **nodes:** reset edit form with initial values on open ([b8e19b5](https://github.com/perfect-panel/frontend/commit/b8e19b5fca9a0007fbb99c4e4929ba3080bd1f7e)), closes [#51](https://github.com/perfect-panel/frontend/issues/51)
* resolve TypeScript generics incompatibility in node-form ([e6d6c68](https://github.com/perfect-panel/frontend/commit/e6d6c68596f216781946010627b7b02286445329))
* show error toast on auth form submission failure ([a40d109](https://github.com/perfect-panel/frontend/commit/a40d109a3cb664864811973a651e12256f5968cc)), closes [#57](https://github.com/perfect-panel/frontend/issues/57)
* **types:** make pinned and popup optional in QueryAnnouncementParams ([eae4334](https://github.com/perfect-panel/frontend/commit/eae4334d5f77be339d64f6f4290a5604256aa7c4))

## [1.5.1](https://github.com/perfect-panel/frontend/compare/v1.5.0...v1.5.1) (2026-05-19)

### 🐛 Bug Fixes / 问题修复

* **auth:** use enable_reset_password_verify for cf_token schema in reset forms ([b0cfc8c](https://github.com/perfect-panel/frontend/commit/b0cfc8c1102c14a24540159f2d5c586cf3592502)), closes [#57](https://github.com/perfect-panel/frontend/issues/57)

## [1.5.0](https://github.com/perfect-panel/frontend/compare/v1.4.2...v1.5.0) (2026-05-11)

### ✨ Features / 新功能

* **ci:** add issue triage automation workflow ([1624303](https://github.com/perfect-panel/frontend/commit/1624303b84fca99237f16c71e6d14b03682ec326))
* **ci:** also trigger triage on new issue comments ([ec2bc9a](https://github.com/perfect-panel/frontend/commit/ec2bc9ac827cae7fe3b8e0e472b6a18b122818ea))
* **triage:** include comment data in context for issue_comment events ([c5cc754](https://github.com/perfect-panel/frontend/commit/c5cc754ede249d022563fa2afb728690b16a6eee))

### 🐛 Bug Fixes / 问题修复

* **ui:** remove hardcoded Aceternity placeholder text from Timeline component ([d61bcde](https://github.com/perfect-panel/frontend/commit/d61bcde7bfd22611fb6014aaf7106721133e26a1))

### 📚 Documentation / 文档更新

* **zh-CN:** align clone directory with frontend repo name ([c8f35d9](https://github.com/perfect-panel/frontend/commit/c8f35d922c2b5a4de00973cb5875c17fb512c885))

### 👷 Continuous Integration / CI/CD

* add workflow_dispatch trigger to triage-automation ([e8fa276](https://github.com/perfect-panel/frontend/commit/e8fa276385f12378896a6a6e6b4532881ea8edfe))

## [1.4.2](https://github.com/perfect-panel/frontend/compare/v1.4.1...v1.4.2) (2026-04-06)

### 🐛 Bug Fixes / 问题修复

* **i18n:** remove affiliate namespace from eager preload to prevent retry loops ([af8f09e](https://github.com/perfect-panel/frontend/commit/af8f09e28029bec9a3077fb4779d3212361e6ba2)), closes [#31](https://github.com/perfect-panel/frontend/issues/31)

## [1.4.1](https://github.com/perfect-panel/frontend/compare/v1.4.0...v1.4.1) (2026-03-30)

### 🐛 Bug Fixes / 问题修复

* **ui:** improve text contrast on renew and purchasing pages ([#30](https://github.com/perfect-panel/frontend/issues/30)) ([2f9eac2](https://github.com/perfect-panel/frontend/commit/2f9eac27606a61cbd0e3f53b23023aad93d6c073))

## [1.4.0](https://github.com/perfect-panel/frontend/compare/v1.3.15...v1.4.0) (2026-03-13)

### ✨ Features / 新功能

* **servers:** add Reality support for anytls; fix vless flow ([be24ba0](https://github.com/perfect-panel/frontend/commit/be24ba03f564181d2bd6bc611917004d24e21aee))

## [1.3.15](https://github.com/perfect-panel/frontend/compare/v1.3.14...v1.3.15) (2026-03-12)

### 🐛 Bug Fixes / 问题修复

* **ci:** remove deprecated forwardRef usage in turnstile components ([89ece6e](https://github.com/perfect-panel/frontend/commit/89ece6e959892808c3a67ffb43612c9b90f1e38a))

## [1.3.14](https://github.com/perfect-panel/frontend/compare/v1.3.13...v1.3.14) (2026-03-11)

### 🐛 Bug Fixes / 问题修复

* improve renewal button readability on subscription card ([#25](https://github.com/perfect-panel/frontend/issues/25)) ([ced5c1d](https://github.com/perfect-panel/frontend/commit/ced5c1d24e5af26ff8fdf700fd2b9b864706694a))

## [1.3.13](https://github.com/perfect-panel/frontend/compare/v1.3.12...v1.3.13) (2026-03-07)

### 🐛 Bug Fixes / 问题修复

* **user:** show expire time & improve renewal dialog on mobile ([#22](https://github.com/perfect-panel/frontend/issues/22)) ([889dbf9](https://github.com/perfect-panel/frontend/commit/889dbf97736252d54d3e1d7ed0622e91ee4e8a1e))

## [1.3.12](https://github.com/perfect-panel/frontend/compare/v1.3.11...v1.3.12) (2026-02-26)

### 🐛 Bug Fixes / 问题修复

* **admin:** prioritize follow-up tickets ([#18](https://github.com/perfect-panel/frontend/issues/18)) ([a07d1ca](https://github.com/perfect-panel/frontend/commit/a07d1ca48e6471077f2ec86e55e967c7d1aa8acd))

## [1.3.11](https://github.com/perfect-panel/frontend/compare/v1.3.10...v1.3.11) (2026-02-21)

### 🐛 Bug Fixes / 问题修复

* **admin:** stabilize node sorting with duplicate sort values ([15fc37d](https://github.com/perfect-panel/frontend/commit/15fc37db9eae389644c287763b09c88eed9e2f75))

## [1.3.10](https://github.com/perfect-panel/frontend/compare/v1.3.9...v1.3.10) (2026-02-10)

### 🐛 Bug Fixes / 问题修复

* **admin:** persist reset-password Turnstile verify setting (Fixes [#10](https://github.com/perfect-panel/frontend/issues/10)) ([8831c9b](https://github.com/perfect-panel/frontend/commit/8831c9be9c847f9873634112ce614576325d6d3a))

## [1.3.9](https://github.com/perfect-panel/frontend/compare/v1.3.8...v1.3.9) (2026-02-08)

### 🐛 Bug Fixes / 问题修复

* **auth:** support OAuth callbacks with hash router (Fixes [#9](https://github.com/perfect-panel/frontend/issues/9)) ([fee44fa](https://github.com/perfect-panel/frontend/commit/fee44fa1b22bfc6077a758d2cf82cc32840dadd5))
* **user:** mobile announcement close + payment method selection (Fixes [#8](https://github.com/perfect-panel/frontend/issues/8)) ([b32ba55](https://github.com/perfect-panel/frontend/commit/b32ba55ab8b0af3557a282ff02563d04335106f0))
* **user:** satisfy biome check for oauth/payment UI ([6e3ef8a](https://github.com/perfect-panel/frontend/commit/6e3ef8ab7ed5903d50ec43ba60544fd88d779c3e))

## [1.3.8](https://github.com/perfect-panel/frontend/compare/v1.3.7...v1.3.8) (2026-02-06)

### 🐛 Bug Fixes / 问题修复

* **payment:** satisfy img size lint rule ([30a6967](https://github.com/perfect-panel/frontend/commit/30a6967187d21d38d602a92c03e631ebad931767))
* **payment:** use native WeChat Pay QR data ([160e6da](https://github.com/perfect-panel/frontend/commit/160e6da3f66691580752c65063e93c038b7a5547))

## [1.3.7](https://github.com/perfect-panel/frontend/compare/v1.3.6...v1.3.7) (2026-01-27)

### 🐛 Bug Fixes / 问题修复

* **admin:** refresh user list after balance update ([7e1d574](https://github.com/perfect-panel/frontend/commit/7e1d5746d46dd9bf33b1971f71f809afcdba4bbe))
* **build:** ensure version.lock directory exists + fix merge typo ([052a0a4](https://github.com/perfect-panel/frontend/commit/052a0a420921cffc09c81843d37081d05b4c4717))
* **ci:** avoid void|Promise union for refetch ([6dd743b](https://github.com/perfect-panel/frontend/commit/6dd743bbf4f383249e97549ed0ed0417b6f5609d))
* **i18n:** remove duplicate locale keys ([ed3f6cb](https://github.com/perfect-panel/frontend/commit/ed3f6cb737e0e5b3b57e4149fce3be6e46b0c5eb))

### 🔧 Chores / 其他变更

* **openapi:** regenerate services & patch axios requestType typing ([0ec4f84](https://github.com/perfect-panel/frontend/commit/0ec4f84fa9d4d94048b8219896c3d8fb1d8d2175))
* **release:** Release 1.2.4-dev.2 / 发布版本 1.2.4-dev.2 [skip ci] ([98676fa](https://github.com/perfect-panel/frontend/commit/98676fa27c74eefc9c0fe2d92a549d9e5d7d7fd6))
* **release:** Release 1.3.7-dev.1 / 发布版本 1.3.7-dev.1 [skip ci] ([852b2b8](https://github.com/perfect-panel/frontend/commit/852b2b84ee926a2dc35a7c8380bf41a74ed8bbbf))

## [1.3.7-dev.1](https://github.com/perfect-panel/frontend/compare/v1.3.6...v1.3.7-dev.1) (2026-01-27)

### 🐛 Bug Fixes / 问题修复

* **admin:** refresh user list after balance update ([7e1d574](https://github.com/perfect-panel/frontend/commit/7e1d5746d46dd9bf33b1971f71f809afcdba4bbe))
* **build:** ensure version.lock directory exists + fix merge typo ([052a0a4](https://github.com/perfect-panel/frontend/commit/052a0a420921cffc09c81843d37081d05b4c4717))
* **ci:** avoid void|Promise union for refetch ([6dd743b](https://github.com/perfect-panel/frontend/commit/6dd743bbf4f383249e97549ed0ed0417b6f5609d))
* **i18n:** remove duplicate locale keys ([ed3f6cb](https://github.com/perfect-panel/frontend/commit/ed3f6cb737e0e5b3b57e4149fce3be6e46b0c5eb))

### 🔧 Chores / 其他变更

* **openapi:** regenerate services & patch axios requestType typing ([0ec4f84](https://github.com/perfect-panel/frontend/commit/0ec4f84fa9d4d94048b8219896c3d8fb1d8d2175))
* **release:** Release 1.2.4-dev.2 / 发布版本 1.2.4-dev.2 [skip ci] ([98676fa](https://github.com/perfect-panel/frontend/commit/98676fa27c74eefc9c0fe2d92a549d9e5d7d7fd6))

## [1.3.6](https://github.com/perfect-panel/frontend/compare/v1.3.5...v1.3.6) (2025-12-30)

### 🐛 Bug Fixes / 问题修复

* Update server and web version update descriptions to remove version prefix for clarity ([cbd6e29](https://github.com/perfect-panel/frontend/commit/cbd6e29deda1c7a913fae4edb169e0a0a43a3dd9))

## [1.3.5](https://github.com/perfect-panel/frontend/compare/v1.3.4...v1.3.5) (2025-12-30)

### 🐛 Bug Fixes / 问题修复

* Update getUserSubscribe function to accept short and token parameters for improved URL generation ([39ebd09](https://github.com/perfect-panel/frontend/commit/39ebd09f0989b37308c1c803d8e380f967ab0db5))

## [1.3.4](https://github.com/perfect-panel/frontend/compare/v1.3.3...v1.3.4) (2025-12-29)

### 🐛 Bug Fixes / 问题修复

* Only update internalValue in MonacoEditor if propValue has changed ([fe14002](https://github.com/perfect-panel/frontend/commit/fe1400235967f2ad0c1ffbc05d9e15bab370c664))
* Set modal prop to false for DropdownMenu in multiple components for improved user experience ([0253b62](https://github.com/perfect-panel/frontend/commit/0253b62b6365476591121b6f18dcb3f3261cb4ff))
* Update HTMLEditor onChange event and set DropdownMenu modal to false for better user experience ([ba65588](https://github.com/perfect-panel/frontend/commit/ba65588fdfcfba146cd76bfe7d14e053291f5926))
* Update SendCode parameters to use form.watch for email and telephone fields ([51a98af](https://github.com/perfect-panel/frontend/commit/51a98afcae2c8b83c7176898ad8ac2c8b11ad3d9))

## [1.3.3](https://github.com/perfect-panel/frontend/compare/v1.3.2...v1.3.3) (2025-12-29)

### 🐛 Bug Fixes / 问题修复

* Update user_subscribe_id reference in RowMoreActions to use row.id for correct token reset and status toggle ([2156a7f](https://github.com/perfect-panel/frontend/commit/2156a7f1df52970b5ab0816dd1da5dc7cefc1dae))

## [1.3.2](https://github.com/perfect-panel/frontend/compare/v1.3.1...v1.3.2) (2025-12-29)

### 🐛 Bug Fixes / 问题修复

* Refactor update dialog logic in SystemVersionCard for better clarity and handling of update states ([0690deb](https://github.com/perfect-panel/frontend/commit/0690debf6c1bab7472468c742f9b15639f904c20))
* Update default inventory value in SubscribeForm to -1 for better handling of inventory state ([2f50c6d](https://github.com/perfect-panel/frontend/commit/2f50c6df3345e26bc92f5730bc8b891d0515a367))

## [1.3.1](https://github.com/perfect-panel/frontend/compare/v1.3.0...v1.3.1) (2025-12-29)

### 🐛 Bug Fixes / 问题修复

* : Update localization files and improve display logic for inventory handling ([83d821a](https://github.com/perfect-panel/frontend/commit/83d821a2dc24d97838af43ab610b65ff0d0d0d15))
* Update quantity handling in Purchase and Renewal components based on showOriginalPrice prop ([a274607](https://github.com/perfect-panel/frontend/commit/a2746073a636706b0e214eca84055735417680f3))
* Update SubscribeTable to display inventory using Display component for better clarity ([cc52e36](https://github.com/perfect-panel/frontend/commit/cc52e3614d9b6723f4ce8ab6385d626f0fcc54d7))

## [1.3.0](https://github.com/perfect-panel/frontend/compare/v1.2.4...v1.3.0) (2025-12-29)

### ✨ Features / 新功能

* Add original price display option and enhance inventory messages in subscription components ([543a7b9](https://github.com/perfect-panel/frontend/commit/543a7b9eb9b2cd278a70f668b0a0e0e9e261fe57))
* Added localized support for user subscription and deletion status, and optimized the subscription form and user interface. ([9f95cec](https://github.com/perfect-panel/frontend/commit/9f95cec876c9ac8bf00a6ca12a5c40243c7171af))
* Added reset and pause subscription functionality, and updated the status display. ([bc451ee](https://github.com/perfect-panel/frontend/commit/bc451eea16b51f1ab81b6cacf65201886866e1cc))
* Added the option to restore subscription, and updated the relevant description and confirmation information. ([5f5c339](https://github.com/perfect-panel/frontend/commit/5f5c33987e54533c5348223b3cebe31aef91aa25))
* Enhance DatePicker component with clear button and improved value handling ([b27b928](https://github.com/perfect-panel/frontend/commit/b27b9287be0eb26fe5d5189b618a32db340c506c))
* Refactor SubscriptionForm layout for improved readability and maintainability ([f432ba0](https://github.com/perfect-panel/frontend/commit/f432ba06f9d3a86ec00bfd316d1c020ddf779de6))
* Update API proxy target to use environment variable for improved configurability ([8d514df](https://github.com/perfect-panel/frontend/commit/8d514dfd8f0a8fb9acc97a288addd1b1cbc882b8))
* Update queryKey structure in Purchase and Renewal components for improved order creation ([9559e00](https://github.com/perfect-panel/frontend/commit/9559e003b7821303f7d0ac7f4da5fae4bf1ccad4))
* Update Vite configuration to load environment variables for improved API proxy setup ([d36a2c9](https://github.com/perfect-panel/frontend/commit/d36a2c902b7943441282278009c5e5210d30c746))

### 🐛 Bug Fixes / 问题修复

* Replace tag removal icon with a button for better accessibility and event handling ([3751f64](https://github.com/perfect-panel/frontend/commit/3751f64f73cd70eaddd44cb650dd38949f0ca069))
* Uncomment navigation to dashboard for authenticated users ([4d15b2b](https://github.com/perfect-panel/frontend/commit/4d15b2b6fc8f0d178c7c749aa9e1d9826bb706f8))

### 📚 Documentation / 文档更新

* Update default administrator account information and security recommendations in installation guides ([7279275](https://github.com/perfect-panel/frontend/commit/7279275532ad0b73994ffe5cf2e4c2f8dabc280b))

## [1.2.4](https://github.com/perfect-panel/frontend/compare/v1.2.3...v1.2.4) (2025-12-28)

### 🐛 Bug Fixes / 问题修复

* Add onSuccess callback to Unsubscribe component and conditionally render Renewal component ([7b5367a](https://github.com/perfect-panel/frontend/commit/7b5367a9a99ac8ae608a765b79a66c1f7380dcd8))
* Remove the system log dialog component from the system version card ([71cb827](https://github.com/perfect-panel/frontend/commit/71cb827918ee3250f0c9d06d46d876ce6799b8ac))
* Update invite link format in auth forms and sidebar to include hash fragment for routing. ([7a8c010](https://github.com/perfect-panel/frontend/commit/7a8c0102958a859c9e7476810d5c9b822f882692))

## [1.2.4-dev.2](https://github.com/perfect-panel/frontend/compare/v1.2.4-dev.1...v1.2.4-dev.2) (2026-01-27)

### 🐛 Bug Fixes / 问题修复

* **admin:** refresh user list after balance update ([7e1d574](https://github.com/perfect-panel/frontend/commit/7e1d5746d46dd9bf33b1971f71f809afcdba4bbe))
* **ci:** avoid void|Promise union for refetch ([6dd743b](https://github.com/perfect-panel/frontend/commit/6dd743bbf4f383249e97549ed0ed0417b6f5609d))

### 📚 Documentation / 文档更新

* Add one-click installation script for PPanel with Docker support ([912c5c4](https://github.com/perfect-panel/frontend/commit/912c5c4cb63eeb0ecbc33bef6b31bd50d83d6491))

### 🔧 Chores / 其他变更

* **openapi:** regenerate services & patch axios requestType typing ([0ec4f84](https://github.com/perfect-panel/frontend/commit/0ec4f84fa9d4d94048b8219896c3d8fb1d8d2175))

## [1.2.4-dev.1](https://github.com/perfect-panel/frontend/compare/v1.2.3...v1.2.4-dev.1) (2025-12-22)

### 🐛 Bug Fixes / 问题修复

* Add onSuccess callback to Unsubscribe component and conditionally render Renewal component ([7b5367a](https://github.com/perfect-panel/frontend/commit/7b5367a9a99ac8ae608a765b79a66c1f7380dcd8))
* Remove the system log dialog component from the system version card ([71cb827](https://github.com/perfect-panel/frontend/commit/71cb827918ee3250f0c9d06d46d876ce6799b8ac))
* Update invite link format in auth forms and sidebar to include hash fragment for routing. ([7a8c010](https://github.com/perfect-panel/frontend/commit/7a8c0102958a859c9e7476810d5c9b822f882692))

## [1.2.3](https://github.com/perfect-panel/frontend/compare/v1.2.2...v1.2.3) (2025-12-16)

### 🐛 Bug Fixes / 问题修复

* add success message for sorting in subscription table and update device limit terminology to "IP限制" for consistency ([d22919b](https://github.com/perfect-panel/frontend/commit/d22919bf57044d6ad30e6c0debf63e5bc724d3ea))
* Add the VITE_SHOW_LANDING_PAGE configuration to control the landing page display logic. ([a8a3d18](https://github.com/perfect-panel/frontend/commit/a8a3d180616315fd58d410ad70647d92fb2ea234))
* Added a scroll wheel event handler to improve the scrolling experience of the combo box option list. ([7648175](https://github.com/perfect-panel/frontend/commit/76481755eacfcc212cdcd034e627c004927d1990))
* comment out favicon links in admin and user HTML files for clarity; update icon type to support all image formats in route files ([033af5c](https://github.com/perfect-panel/frontend/commit/033af5c01ae1827430fffbb4a69138816824ab8b))
* enhance logout functionality to support hash-based routing and improve redirect logic ([69a89e0](https://github.com/perfect-panel/frontend/commit/69a89e0c398274b5183d166d7a09be2b7ee9c695))
* update device limit terminology to "IP Limit" for consistency in English and Chinese locales ([4b868b0](https://github.com/perfect-panel/frontend/commit/4b868b0c1dfe4902ea499918a2a672f9116354cb))
* update email validation to use z.email for consistency in login and reset forms ([11a0df6](https://github.com/perfect-panel/frontend/commit/11a0df67b74f32da6555261c4f5c310db8449ef8))
* Update the import path and use empty spaces in the composite component to maintain consistency. ([25d95c7](https://github.com/perfect-panel/frontend/commit/25d95c792fbfde67ac1be7da3b6fb12478848cf6))
* update user agent placeholders in subscription configuration for consistency ([7f06f76](https://github.com/perfect-panel/frontend/commit/7f06f76056850b9334e99e62749102acaa69bee4))

## [1.2.2](https://github.com/perfect-panel/frontend/compare/v1.2.1...v1.2.2) (2025-12-16)

### 🐛 Bug Fixes / 问题修复

* add skipErrorHandler option to getModuleConfig for improved error handling ([3a37e74](https://github.com/perfect-panel/frontend/commit/3a37e74e71c07f15fb556df28e865b8843b4b885))
* replace anchor tags with Link components for improved routing in user subscription and footer ([227e922](https://github.com/perfect-panel/frontend/commit/227e922958d80d1bf5650e96c30c1359015133f0))
* update color variables for improved theme consistency in globals.css ([b559613](https://github.com/perfect-panel/frontend/commit/b55961395f051055c29e60b292b739ebecfb5d9e))
* update LoadingBar color to primary for better visibility in navigation progress ([46cbdea](https://github.com/perfect-panel/frontend/commit/46cbdeafd4d4f0c6a31b63fbd0128f7d920be632))
* update logout redirection URL to use hash-based routing ([6ca8109](https://github.com/perfect-panel/frontend/commit/6ca8109251ef3f7c76b0649ba6dba35cac4b6893))

### ♻️ Code Refactoring / 代码重构

* update Docker image references from ghcr.io to ppanel for backend setup in documentation ([c76a09c](https://github.com/perfect-panel/frontend/commit/c76a09c9d6996f2ee550f6308054cb8407703146))

## [1.2.1](https://github.com/perfect-panel/frontend/compare/v1.2.0...v1.2.1) (2025-12-12)

### 🐛 Bug Fixes / 问题修复

* add error handling skip option for server and web version checks ([cc41deb](https://github.com/perfect-panel/frontend/commit/cc41debb335f6b0fd0b9911786ae05a62b598fbf))
* replace window.location with navigate for payment redirection in recharge, renewal, and reset-traffic components ([3862007](https://github.com/perfect-panel/frontend/commit/3862007b54f5a9f6982aa4836188966151854131))
* update API prefix handling to ensure compatibility with undefined VITE_API_PREFIX ([3920c6f](https://github.com/perfect-panel/frontend/commit/3920c6ff59106c2f0368c4d6ceda30622be36ce7))

### 📚 Documentation / 文档更新

* fix teek theme ([5ee56f8](https://github.com/perfect-panel/frontend/commit/5ee56f8217cfb7956c50fac76c4732a0c230463f))

## [1.2.0](https://github.com/perfect-panel/frontend/compare/v1.1.3...v1.2.0) (2025-12-11)

### ✨ Features / 新功能

* update localization files and improve system version management ([3cf6a5c](https://github.com/perfect-panel/frontend/commit/3cf6a5cfb47ea872d6e07be0d89304dc80ed61bb))

### 📚 Documentation / 文档更新

* Add documentation ([99e7f60](https://github.com/perfect-panel/frontend/commit/99e7f6062db81143e7b8e3692d626ebafe6e731f))

### 🔧 Chores / 其他变更

* **release:** Release 1.2.0-dev.1 / 发布版本 1.2.0-dev.1 [skip ci] ([50e695a](https://github.com/perfect-panel/frontend/commit/50e695a1bb156f7176b2af0db26b59f70124ad61))

## [1.2.0](https://github.com/perfect-panel/frontend/compare/v1.1.3...v1.2.0) (2025-12-11)

### ✨ Features / 新功能

* update localization files and improve system version management ([3cf6a5c](https://github.com/perfect-panel/frontend/commit/3cf6a5cfb47ea872d6e07be0d89304dc80ed61bb))

### 📚 Documentation / 文档更新

* Add documentation ([99e7f60](https://github.com/perfect-panel/frontend/commit/99e7f6062db81143e7b8e3692d626ebafe6e731f))

### 🔧 Chores / 其他变更

* **release:** Release 1.2.0-dev.1 / 发布版本 1.2.0-dev.1 [skip ci] ([50e695a](https://github.com/perfect-panel/frontend/commit/50e695a1bb156f7176b2af0db26b59f70124ad61))

## [1.2.0-dev.1](https://github.com/perfect-panel/frontend/compare/v1.1.3...v1.2.0-dev.1) (2025-12-01)

### ✨ Features / 新功能

* update localization files and improve system version management ([3cf6a5c](https://github.com/perfect-panel/frontend/commit/3cf6a5cfb47ea872d6e07be0d89304dc80ed61bb))

## [1.1.3](https://github.com/perfect-panel/frontend/compare/v1.1.2...v1.1.3) (2025-12-01)

### 🐛 Bug Fixes / 问题修复

* update prepare command to use bun for building before packaging admin and user applications ([0dcd50b](https://github.com/perfect-panel/frontend/commit/0dcd50b6d3bbafccab73fe564325ee527ca14569))

## [1.1.2](https://github.com/perfect-panel/frontend/compare/v1.1.1...v1.1.2) (2025-11-30)

### 🐛 Bug Fixes / 问题修复

* Add version.lock plugin to generate version lock file after build ([574c06c](https://github.com/perfect-panel/frontend/commit/574c06c754deb84953d182057ea17bba14a2bcd4))

## [1.1.1](https://github.com/perfect-panel/frontend/compare/v1.1.0...v1.1.1) (2025-11-30)

### 🐛 Bug Fixes / 问题修复

* add hash history support for routing in admin and user applications ([bfc1773](https://github.com/perfect-panel/frontend/commit/bfc1773226ea7dd77e2dabd181493108eacca5ba))

## [1.1.0](https://github.com/perfect-panel/frontend/compare/v1.0.3...v1.1.0) (2025-11-30)

### ✨ Features / 新功能

* add new payment icons for Alipay and WeChat Pay, update asset paths ([2ce0572](https://github.com/perfect-panel/frontend/commit/2ce0572283fe677e2e862aa2a8af1d44b7e7cfed))

## [1.0.3](https://github.com/perfect-panel/frontend/compare/v1.0.2...v1.0.3) (2025-11-29)

### 🐛 Bug Fixes / 问题修复

* update asset names in release configuration for admin and user applications ([7cbccee](https://github.com/perfect-panel/frontend/commit/7cbccee32ef18700fcba0f66886219e70692e8be))

## [1.0.2](https://github.com/perfect-panel/frontend/compare/v1.0.1...v1.0.2) (2025-11-29)

### 🐛 Bug Fixes / 问题修复

* update repository links and add environment configuration for admin and user apps ([4c77487](https://github.com/perfect-panel/frontend/commit/4c774871a80def1e41d7081112f18377ff9fa7b8))

## [1.0.1](https://github.com/perfect-panel/frontend/compare/v1.0.0...v1.0.1) (2025-11-27)

### 🐛 Bug Fixes / 问题修复

* configure axios request with base URL and update typings ([0f393c7](https://github.com/perfect-panel/frontend/commit/0f393c77efc89591ac3be6ced73763ea9beb6e77))

## 1.0.0 (2025-11-27)

### ✨ Features / 新功能

* initialization ([a801849](https://github.com/perfect-panel/frontend/commit/a801849fb2c369b999dc93bbe8fda2753fba8ae6))
