---
layout: home

tk:
  teekHome: false

hero:
  name: PPanel
  text: Pure Professional Perfect
  tagline: Operate any proxy fleet with a polished, open-source control plane.
  actions:
    - theme: brand
      text: Install PPanel
      link: /guide/installation/
    - theme: alt
      text: Project Overview
      link: /guide/intro
  image:
    src: /logo.svg
    alt: PPanel

features:
  - icon: 🎯
    title: Complete Management
    details: Provision servers, wire nodes, bundle subscriptions, and launch products from one console.
  - icon: 💼
    title: Business Operations
    details: Automate coupons, campaigns, orders, and announcements with built-in workflows.
  - icon: 👥
    title: User Support System
    details: Rich user directory, ticketing, and docs so teams can resolve requests quickly.
  - icon: 📊
    title: Data Analytics
    details: Twelve log channels surface traffic, balance, and commission insights at a glance.
  - icon: 🔧
    title: Flexible Configuration
    details: Payments, auth policies, ads, and system toggles stay configurable without rebuilds.
  - icon: 🚀
    title: Modern Tech Stack
    details: React 19 + TypeScript + TailwindCSS + shadcn/ui deliver a fast, themeable interface.
  - icon: 🛡️
    title: Hardened Backend
    details: Go service built on Hertz, Gorm, and Asynq provides the backend APIs.
  - icon: 🐳
    title: Turnkey Deployments
    details: Official `ppanel/ppanel-server` Docker images run the backend on amd64 and arm64.
---

## Full Stack Overview

PPanel separates the frontend and backend:

- **[Frontend](https://github.com/perfect-panel/frontend)** — React 19 UI + VitePress docs for both admin and user portals.
- **[PPanel Server](https://github.com/perfect-panel/backend)** — Go APIs focusing on privacy, observability, and multi-protocol orchestration.

### Frontend experience

- Responsive dashboards, granular permissions, and live counters designed for daily operator workflows.
- Shared component system (shadcn/ui + TailwindCSS) keeps admin and user spaces visually aligned.
- Documentation and guides live side-by-side with the product so teams always deploy from the latest instructions.

### Backend foundation

- Multi-protocol relay for Shadowsocks, V2Ray, Trojan, and Trojan-Go managed through the backend APIs.
- Node lifecycle automation (heartbeat, registration, version checks, rolling updates) to keep edges healthy.
- Business domains such as subscriptions, billing, payments, orders, and tickets mirror what you configure in the UI.
- Privacy-first defaults — user activity logs stay off unless explicitly enabled; configs live in `etc/ppanel.yaml`.
- Flexible delivery: Go binaries per platform, Makefile targets, and CI-published Docker images like `ppanel/ppanel-server:latest`.

### Deployment

Run the backend using the official `ppanel/ppanel-server` image or a [backend release binary](https://github.com/perfect-panel/backend/releases). Deploy the admin and user frontends separately, with a reverse proxy or an explicit API base URL connecting them to the backend.

See the [frontend deployment guide](/guide/separation/frontend) for API routing. Existing gateway deployments need to [migrate before upgrading](/guide/separation/frontend#moving-from-the-retired-gateway) to backend 1.20.2 or later. The dashboard displays service versions and supports restarting the backend; upgrades are handled by your deployment tooling.
