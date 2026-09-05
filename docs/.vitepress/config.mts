import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

const teekConfig = defineTeekConfig({
  article: {
    author: "PPanel",
  },
  footer: {
    copyright: "Copyright © 2025 PPanel",
  },
  toComment: {
    enabled: true,
    done: () => {
      window.open("https://t.me/PPanelChat", "_blank");
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,

  title: "PPanel",
  description:
    "PPanel is a pure, professional, and perfect open-source proxy panel tool, designed to be your ideal choice for learning and practical use.",

  locales: {
    root: {
      label: "English",
      lang: "en-US",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "Guide", link: "/guide/intro" },
          { text: "Features", link: "/admin/dashboard" },
          { text: "API", link: "/api/reference" },
          { text: "Sponsors", link: "/sponsors" },
          {
            text: "Stats",
            link: "https://stats.ppanel.dev",
            target: "_blank",
          },
          { text: "Buy Theme", link: "https://bygga.app", target: "_blank" },
        ],
        sidebar: {
          "/api/": [
            {
              text: "API",
              items: [
                { text: "Overview", link: "/api/reference" },
                { text: "Common Service", link: "/api/common" },
                { text: "User Service", link: "/api/user" },
                { text: "Admin Service", link: "/api/admin" },
              ],
            },
          ],
          "/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Introduction", link: "/guide/intro" },
                { text: "Contributing", link: "/guide/contributing" },
              ],
            },
            {
              text: "Installation",
              items: [
                { text: "Overview", link: "/guide/installation/" },
                {
                  text: "One-Click Deployment",
                  link: "/guide/installation/one-click",
                },
                {
                  text: "Docker Compose",
                  link: "/guide/installation/docker-compose",
                },
                {
                  text: "Docker Run",
                  link: "/guide/installation/docker-run",
                },
                {
                  text: "Binary Deployment",
                  link: "/guide/installation/binary",
                },
              ],
            },
            {
              text: "Separation Deployment",
              items: [
                {
                  text: "Backend Deployment",
                  link: "/guide/separation/backend",
                },
                {
                  text: "Frontend Deployment",
                  link: "/guide/separation/frontend",
                },
              ],
            },
            {
              text: "Node Agent",
              items: [
                {
                  text: "Installation",
                  link: "/guide/node/installation",
                },
              ],
            },
          ],
          "/admin/": [
            {
              text: "Dashboard",
              items: [{ text: "Overview", link: "/admin/dashboard" }],
            },
            {
              text: "Maintenance",
              items: [
                {
                  text: "Server Management",
                  link: "/admin/maintenance/servers",
                },
                {
                  text: "Node Management",
                  link: "/admin/maintenance/nodes",
                },
                {
                  text: "Subscribe Config",
                  link: "/admin/maintenance/subscribe",
                },
                {
                  text: "Product Management",
                  link: "/admin/maintenance/products",
                },
              ],
            },
            {
              text: "Commerce",
              items: [
                { text: "Order Management", link: "/admin/commerce/orders" },
                {
                  text: "Coupon Management",
                  link: "/admin/commerce/coupons",
                },
                {
                  text: "Marketing Management",
                  link: "/admin/commerce/marketing",
                },
                {
                  text: "Announcement Management",
                  link: "/admin/commerce/announcements",
                },
              ],
            },
            {
              text: "Users & Support",
              items: [
                {
                  text: "User Management",
                  link: "/admin/users-support/users",
                },
                {
                  text: "Ticket Management",
                  link: "/admin/users-support/tickets",
                },
                {
                  text: "Document Management",
                  link: "/admin/users-support/documents",
                },
              ],
            },
            {
              text: "System",
              items: [
                { text: "System Config", link: "/admin/system/config" },
                { text: "Auth Control", link: "/admin/system/auth-control" },
                { text: "Payment Config", link: "/admin/system/payment" },
                { text: "ADS Config", link: "/admin/system/ads" },
              ],
            },
            {
              text: "Logs & Analytics",
              items: [
                { text: "Login Logs", link: "/admin/logs/login" },
                { text: "Register Logs", link: "/admin/logs/register" },
                { text: "Email Logs", link: "/admin/logs/email" },
                { text: "Mobile Logs", link: "/admin/logs/mobile" },
                { text: "Subscribe Logs", link: "/admin/logs/subscribe" },
                {
                  text: "Reset Subscribe Logs",
                  link: "/admin/logs/reset-subscribe",
                },
                {
                  text: "Subscribe Traffic",
                  link: "/admin/logs/subscribe-traffic",
                },
                {
                  text: "Server Traffic",
                  link: "/admin/logs/server-traffic",
                },
                {
                  text: "Traffic Details",
                  link: "/admin/logs/traffic-details",
                },
                { text: "Balance Logs", link: "/admin/logs/balance" },
                { text: "Commission Logs", link: "/admin/logs/commission" },
                { text: "Gift Logs", link: "/admin/logs/gift" },
              ],
            },
          ],
        },
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      themeConfig: {
        nav: [
          { text: "首页", link: "/zh/" },
          { text: "指南", link: "/zh/guide/intro" },
          { text: "功能文档", link: "/zh/admin/dashboard" },
          { text: "API 文档", link: "/zh/api/reference" },
          { text: "赞助商", link: "/zh/sponsors" },
          {
            text: "统计",
            link: "https://stats.ppanel.dev",
            target: "_blank",
          },
          { text: "主题购买", link: "https://bygga.app", target: "_blank" },
        ],
        sidebar: {
          "/zh/api/": [
            {
              text: "API",
              items: [
                { text: "概览", link: "/zh/api/reference" },
                { text: "通用服务", link: "/zh/api/common" },
                { text: "用户服务", link: "/zh/api/user" },
                { text: "管理端服务", link: "/zh/api/admin" },
              ],
            },
          ],
          "/zh/guide/": [
            {
              text: "指南",
              items: [
                { text: "简介", link: "/zh/guide/intro" },
                { text: "贡献指南", link: "/zh/guide/contributing" },
              ],
            },
            {
              text: "安装部署",
              items: [
                { text: "概览", link: "/zh/guide/installation/" },
                {
                  text: "一键部署",
                  link: "/zh/guide/installation/one-click",
                },
                {
                  text: "Docker Compose",
                  link: "/zh/guide/installation/docker-compose",
                },
                {
                  text: "Docker Run",
                  link: "/zh/guide/installation/docker-run",
                },
                {
                  text: "二进制部署",
                  link: "/zh/guide/installation/binary",
                },
              ],
            },
            {
              text: "分离部署",
              items: [
                {
                  text: "后端部署",
                  link: "/zh/guide/separation/backend",
                },
                {
                  text: "前端部署",
                  link: "/zh/guide/separation/frontend",
                },
              ],
            },
            {
              text: "节点端",
              items: [
                {
                  text: "安装",
                  link: "/zh/guide/node/installation",
                },
              ],
            },
          ],
          "/zh/admin/": [
            {
              text: "仪表盘",
              items: [{ text: "总览", link: "/zh/admin/dashboard" }],
            },
            {
              text: "运维管理",
              items: [
                { text: "服务器管理", link: "/zh/admin/maintenance/servers" },
                { text: "节点管理", link: "/zh/admin/maintenance/nodes" },
                { text: "订阅配置", link: "/zh/admin/maintenance/subscribe" },
                { text: "产品管理", link: "/zh/admin/maintenance/products" },
              ],
            },
            {
              text: "商务管理",
              items: [
                { text: "订单管理", link: "/zh/admin/commerce/orders" },
                { text: "优惠券管理", link: "/zh/admin/commerce/coupons" },
                { text: "营销管理", link: "/zh/admin/commerce/marketing" },
                { text: "公告管理", link: "/zh/admin/commerce/announcements" },
              ],
            },
            {
              text: "用户与支持",
              items: [
                { text: "用户管理", link: "/zh/admin/users-support/users" },
                { text: "工单管理", link: "/zh/admin/users-support/tickets" },
                { text: "文档管理", link: "/zh/admin/users-support/documents" },
              ],
            },
            {
              text: "系统管理",
              items: [
                { text: "系统配置", link: "/zh/admin/system/config" },
                { text: "认证控制", link: "/zh/admin/system/auth-control" },
                { text: "支付配置", link: "/zh/admin/system/payment" },
                { text: "广告配置", link: "/zh/admin/system/ads" },
              ],
            },
            {
              text: "日志与分析",
              items: [
                { text: "登录日志", link: "/zh/admin/logs/login" },
                { text: "注册日志", link: "/zh/admin/logs/register" },
                { text: "邮件日志", link: "/zh/admin/logs/email" },
                { text: "短信日志", link: "/zh/admin/logs/mobile" },
                { text: "订阅日志", link: "/zh/admin/logs/subscribe" },
                {
                  text: "重置订阅日志",
                  link: "/zh/admin/logs/reset-subscribe",
                },
                { text: "订阅流量", link: "/zh/admin/logs/subscribe-traffic" },
                { text: "服务器流量", link: "/zh/admin/logs/server-traffic" },
                { text: "流量详情", link: "/zh/admin/logs/traffic-details" },
                { text: "余额日志", link: "/zh/admin/logs/balance" },
                { text: "佣金日志", link: "/zh/admin/logs/commission" },
                { text: "赠送日志", link: "/zh/admin/logs/gift" },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      { icon: "github", link: "https://github.com/perfect-panel/ppanel" },
    ],
  },
});
