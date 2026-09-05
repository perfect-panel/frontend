# Frontend Separation Deployment

This guide will help you independently deploy PPanel frontend applications and connect them to the deployed backend service.

## Moving from the retired gateway

Backend 1.20.2 removed gateway registration and gateway-managed upgrades. Deploy the frontend against the backend's `/v1` and `/v2` routes. The admin dashboard reads `/v1/admin/tool/version`; it no longer calls `/basic/*` or `/v1/admin/system/module`.

For same-origin deployment, leave both settings empty when building the frontend:

```sh
VITE_API_BASE_URL=
VITE_API_PREFIX=
```

Route `/v1/` and `/v2/` to the backend in your production reverse proxy. For separate API domains, set `VITE_API_BASE_URL` to the backend's public origin and configure CORS for the frontend origin.

`VITE_API_PREFIX` remains optional for custom reverse proxies. If it is `/api`, the proxy must forward `/api/v1/...` as `/v1/...` and `/api/v2/...` as `/v2/...`. This prefix does not require the retired gateway service. Vite development proxies perform this rewrite and default to `http://127.0.0.1:8080` when no API base URL is configured.

These values are applied at build time. Rebuild and redeploy both frontends after changing them. Existing gateway installations must also configure the backend's `Host` and `Port` and update upstream routing; the backend no longer registers its address with the gateway or reads `PPANEL_PORT`.

## Overview

Frontend separation deployment allows you to deploy PPanel frontend applications on independent servers or CDN, communicating with backend services through APIs.

PPanel frontend includes two independent applications:
- **User Web** (`ppanel-user-web`): User-facing interface
- **Admin Web** (`ppanel-admin-web`): Administrator backend management interface

### Advantages

- 🚀 Leverage CDN to accelerate static resource access
- 🌍 Support multi-region distribution
- 📦 Independent frontend deployment without affecting backend services
- 🔄 Facilitate rapid frontend iteration and updates
- 🎨 Modern tech stack (React 19, TypeScript, TailwindCSS 4)

## Prerequisites

- Completed [Backend Deployment](./backend.md)
- Backend API address (e.g., `https://api.your-domain.com`)
- Frontend domains:
  - User Web: `https://user.your-domain.com`
  - Admin Web: `https://admin.your-domain.com`

## Tech Stack

- **Runtime**: Bun (recommended) / Node.js 20+
- **Build Tool**: Vite 6
- **Framework**: React 19 + TypeScript
- **Router**: TanStack Router
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **i18n**: i18next
- **Monorepo**: Turborepo

## Deployment Methods

### Method 1: Build from Source (Recommended)

#### 1. Environment Setup

Install Bun (recommended):

```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows (WSL2)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

Or use Node.js (requires 20+):

```bash
# Check Node.js version
node --version  # Should be v20 or higher
```

#### 2. Clone Repository

```bash
git clone https://github.com/perfect-panel/frontend.git
cd frontend
```

#### 3. Install Dependencies

```bash
# Using Bun (recommended, faster)
bun install

# Or using npm
npm install

# Or using pnpm
pnpm install
```

#### 4. Configure Environment Variables

Create environment configuration files in application directories.

**Admin Web Config** (`apps/admin/.env.production`):

```bash
# Backend API address (required)
VITE_API_BASE_URL=https://api.your-domain.com

# CDN address (optional, for accelerating static resources)
VITE_CDN_URL=https://cdn.jsdmirror.com

# Enable tutorial documentation (optional)
VITE_TUTORIAL_DOCUMENT=true

# Show landing page (optional, set to false to redirect to login directly)
VITE_SHOW_LANDING_PAGE=true

# Development default credentials (leave empty in production)
VITE_USER_EMAIL=
VITE_USER_PASSWORD=
```

**User Web Config** (`apps/user/.env.production`):

```bash
# Backend API address (required)
VITE_API_BASE_URL=https://api.your-domain.com

# CDN address (optional)
VITE_CDN_URL=https://cdn.jsdmirror.com

# Enable tutorial documentation (optional)
VITE_TUTORIAL_DOCUMENT=true

# Development default credentials (leave empty in production)
VITE_USER_EMAIL=
VITE_USER_PASSWORD=
```

#### 5. Build Applications

Build all applications:

```bash
# Using Bun
bun run build

# Or using npm
npm run build
```

Build specific application:

```bash
# Navigate to application directory
cd apps/admin  # or apps/user

# Build
bun run build  # or npm run build
```

After build completes, static files will be output to:
- Admin Web: `apps/admin/dist/`
- User Web: `apps/user/dist/`

#### 6. Preview Build

```bash
# In application directory
bun run serve  # or npm run serve

# Default access address:
# Admin Web: http://localhost:4173
# User Web: http://localhost:4173
```

### Method 2: Deploy with Vercel (One-Click)

#### Admin Web Deployment

Click the button below to deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=PPanel%20is%20a%20pure%2C%20professional%2C%20and%20perfect%20open-source%20proxy%20panel%20tool&demo-image=https%3A%2F%2Furlscan.io%2Fliveshot%2F%3Fwidth%3D1920%26height%3D1080%26url%3Dhttps%3A%2F%2Fadmin.ppanel.dev&demo-title=PPanel%20Admin%20Web&repository-url=https%3A%2F%2Fgithub.com%2Fperfect-panel%2Ffrontend&root-directory=apps%2Fadmin)

#### User Web Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=PPanel%20is%20a%20pure%2C%20professional%2C%20and%20perfect%20open-source%20proxy%20panel%20tool&demo-image=https%3A%2F%2Furlscan.io%2Fliveshot%2F%3Fwidth%3D1920%26height%3D1080%26url%3Dhttps%3A%2F%2Fuser.ppanel.dev&demo-title=PPanel%20User%20Web&repository-url=https%3A%2F%2Fgithub.com%2Fperfect-panel%2Ffrontend&root-directory=apps%2Fuser)

After deployment, configure environment variables in Vercel console:
- `VITE_API_BASE_URL`: Your backend API address
- `VITE_CDN_URL`: CDN address (optional)

### Method 3: Deploy with Netlify

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify

```bash
netlify login
```

#### 3. Deploy Application

```bash
# Admin Web
cd apps/admin
bun run build
netlify deploy --prod --dir=dist

# User Web
cd apps/user
bun run build
netlify deploy --prod --dir=dist
```

#### 4. Configure Environment Variables

Add in Netlify console under Site settings → Build & deploy → Environment:
- `VITE_API_BASE_URL`
- `VITE_CDN_URL`

### Method 4: Deploy with Cloudflare Pages

#### 1. Connect GitHub Repository

Login to Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git

#### 2. Configure Build Settings

**Admin Web**:
- **Framework preset**: None
- **Build command**: `bun install && bun --filter ppanel-admin-web build`
- **Build output directory**: `apps/admin/dist`
- **Root directory**: Leave empty (repository root)

**User Web**:
- **Framework preset**: None
- **Build command**: `bun install && bun --filter ppanel-user-web build`
- **Build output directory**: `apps/user/dist`
- **Root directory**: Leave empty (repository root)

The repository root must remain the Pages project root so Cloudflare deploys
the shared `/functions` directory used to proxy `/v1/*` requests.

#### 3. Configure Environment Variables

Add in Settings → Environment variables:
- `API_BASE_URL`: Backend API origin used by the Pages Function, for example
  `https://api.your-domain.com`
- `VITE_CDN_URL`

## Self-Hosted Server Deployment

### Using Nginx

#### 1. Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

#### 2. Upload Build Files

```bash
# Create directories
sudo mkdir -p /var/www/ppanel/{admin,user}

# Upload build files
sudo cp -r apps/admin/dist/* /var/www/ppanel/admin/
sudo cp -r apps/user/dist/* /var/www/ppanel/user/

# Set permissions
sudo chown -R www-data:www-data /var/www/ppanel
```

#### 3. Configure Nginx

**Admin Web Config** (`/etc/nginx/sites-available/ppanel-admin`):

```nginx
server {
    listen 80;
    server_name admin.your-domain.com;

    root /var/www/ppanel/admin;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;
    gzip_min_length 1024;

    # Static resource caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

**User Web Config** (`/etc/nginx/sites-available/ppanel-user`):

```nginx
server {
    listen 80;
    server_name user.your-domain.com;

    root /var/www/ppanel/user;
    index index.html;

    # Other config same as admin web
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 4. Enable Sites

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/ppanel-admin /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ppanel-user /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 5. Configure HTTPS (Recommended)

Use Certbot to automatically configure SSL certificates:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificates
sudo certbot --nginx -d admin.your-domain.com
sudo certbot --nginx -d user.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Using Caddy

Caddy automatically handles HTTPS with simpler configuration.

#### 1. Install Caddy

```bash
# Ubuntu/Debian
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

#### 2. Configure Caddyfile

Create `/etc/caddy/Caddyfile`:

```caddy
admin.your-domain.com {
    root * /var/www/ppanel/admin
    encode gzip
    file_server

    try_files {path} /index.html

    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot
    }
    header @static Cache-Control "public, max-age=31536000, immutable"

    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
}

user.your-domain.com {
    root * /var/www/ppanel/user
    encode gzip
    file_server

    try_files {path} /index.html

    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot
    }
    header @static Cache-Control "public, max-age=31536000, immutable"

    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
}
```

#### 3. Start Caddy

```bash
sudo systemctl restart caddy
sudo systemctl enable caddy
```

## CDN Configuration

### Cloudflare Configuration

1. Add domain to Cloudflare
2. Configure DNS records pointing to origin server
3. Enable optimization options:
   - **Auto Minify**: Enable JavaScript, CSS, HTML minification
   - **Brotli**: Enable Brotli compression
   - **Rocket Loader**: Enable JS async loading (optional)
   - **Caching Level**: Set to Standard

4. Configure page rules:
   ```
   *your-domain.com/*
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: Respect Existing Headers
   ```

### Alibaba Cloud CDN

1. Create CDN acceleration domain
2. Configure origin server: Point to frontend server
3. Configure caching rules:
   - Static files (js, css, images): Cache 1 year
   - HTML files: Cache 5 minutes or no cache
4. Enable HTTPS and HTTP/2

## Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API address | ✅ | - | `https://api.your-domain.com` |
| `VITE_CDN_URL` | CDN address | ❌ | `https://cdn.jsdmirror.com` | `https://cdn.your-domain.com` |
| `VITE_TUTORIAL_DOCUMENT` | Enable tutorial docs | ❌ | `true` | `true` / `false` |
| `VITE_SHOW_LANDING_PAGE` | Show landing page | ❌ | `true` | `true` / `false` |
| `VITE_USER_EMAIL` | Default login email (dev only) | ❌ | - | - |
| `VITE_USER_PASSWORD` | Default login password (dev only) | ❌ | - | - |

## Verify Deployment

### Check Frontend Service

```bash
# Access frontend addresses
curl -I https://admin.your-domain.com
curl -I https://user.your-domain.com

# Expected output
# HTTP/2 200
# content-type: text/html
```

### Check API Connection

Open frontend address in browser, open developer tools:

1. Check Network tab
2. Verify API requests are successful
3. Confirm request addresses are correct (`https://api.your-domain.com`)
4. Check response data is normal

### Check Build Version

Access `/version.lock` file to view currently deployed version:

```bash
curl https://admin.your-domain.com/version.lock
# Example output: 1.2.0
```

## Performance Optimization

### 1. Enable HTTP/2

In Nginx:

```nginx
listen 443 ssl http2;
```

### 2. Enable Brotli Compression

```bash
# Install Nginx Brotli module
sudo apt install libnginx-mod-http-brotli-filter libnginx-mod-http-brotli-static -y
```

In Nginx configuration:

```nginx
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml;
brotli_comp_level 6;
```

### 3. Preload Critical Resources

Vite automatically handles this during build, adding `<link rel="modulepreload">` in `index.html`.

### 4. Enable Service Worker

Frontend has built-in PWA support, Service Worker caching is automatically enabled after build.

### 5. Use CDN Acceleration

Configure `VITE_CDN_URL` environment variable to load static resources from CDN.

## Troubleshooting

### API Request Failed

**Issue**: Frontend cannot connect to backend API

**Solution**:
1. Check if `VITE_API_BASE_URL` is correctly configured
2. Check if backend CORS configuration allows frontend domain
3. Open browser console for specific error messages
4. Use `curl` to test if backend API is accessible

```bash
curl https://api.your-domain.com/api/health
```

### Page Route 404

**Issue**: Refreshing page or directly accessing sub-route returns 404

**Solution**: Ensure web server has SPA fallback configured

```nginx
# Nginx
try_files $uri $uri/ /index.html;

# Apache (.htaccess)
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Static Resource Loading Failed

**Issue**: JS/CSS files 404 or cannot load

**Solution**:
1. Check file permissions
2. Check if Nginx `root` path is correct
3. Clear browser cache
4. Check CDN configuration

### Build Failed

**Issue**: `bun run build` or `npm run build` fails

**Solution**:
1. Ensure Node.js version >= 20
2. Delete `node_modules` and lock file, reinstall
   ```bash
   rm -rf node_modules bun.lockb
   bun install
   ```
3. Check for syntax errors or type errors
   ```bash
   bun run check
   ```

## Update Deployment

### Update from Source

```bash
# Pull latest code
git pull origin main

# Reinstall dependencies
bun install

# Rebuild
bun run build

# Update files
sudo rm -rf /var/www/ppanel/admin
sudo rm -rf /var/www/ppanel/user
sudo cp -r apps/admin/dist /var/www/ppanel/admin
sudo cp -r apps/user/dist /var/www/ppanel/user

# Clear CDN cache (if using CDN)
```

### Vercel Update

Vercel automatically monitors GitHub repository changes and deploys automatically. Can also trigger manually:

```bash
vercel --prod
```

### Netlify Update

```bash
cd apps/admin  # or apps/user
bun run build
netlify deploy --prod
```

## Security Recommendations

1. **Enable HTTPS**: Must use SSL/TLS certificates
2. **Configure CSP**: Content Security Policy
   ```nginx
   add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.your-domain.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';";
   ```
3. **Set Security Headers**: Already included in Nginx configuration
4. **Disable Directory Browsing**: `Options -Indexes` (Apache) or `autoindex off;` (Nginx)
5. **Limit File Upload Size**:
   ```nginx
   client_max_body_size 10M;
   ```

## Monitoring and Analytics

### Add Web Analytics

Supports Google Analytics, Umami, Plausible, etc.

Configuration: Add tracking code in `index.html` or configure via environment variables.

### Error Tracking

Frontend supports integrating Sentry for error tracking (needs code configuration).

## Development and Production

### Local Development

```bash
# Use development server
cd apps/admin  # or apps/user
bun run dev

# Admin Web runs on http://localhost:3001 by default
# User Web runs on http://localhost:3000 by default
```

Development environment uses Vite's proxy feature to proxy API requests to backend.

### Preview Production Build

```bash
# Preview after build
bun run build
bun run serve
```

## Next Steps

- [Backend Separation Deployment](./backend.md) - If backend not yet deployed
- [Node Agent Installation](../node/installation.md) - Deploy node service
- [Feature Documentation](/admin/dashboard) - Learn feature usage
