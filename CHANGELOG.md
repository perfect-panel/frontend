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

### 📚 Documentation / 文档更新

* Add one-click installation script for PPanel with Docker support ([912c5c4](https://github.com/perfect-panel/frontend/commit/912c5c4cb63eeb0ecbc33bef6b31bd50d83d6491))

### 🔧 Chores / 其他变更

* **release:** Release 1.2.4-dev.1 / 发布版本 1.2.4-dev.1 [skip ci] ([62d45bb](https://github.com/perfect-panel/frontend/commit/62d45bbac17fab9656c1cce029a379ce8bb757d6))

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
