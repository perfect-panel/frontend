# One-Click Deployment

The quickest way to deploy PPanel using automated installation scripts. Perfect for quick testing or production deployment.

## Prerequisites

- Clean Linux server (Ubuntu 20.04+, Debian 10+, CentOS 8+)
- Root or sudo access
- Basic network connectivity

## Installation Steps

### Option 1: Complete Installation (Recommended)

Install both Docker and PPanel in one command:

```bash
curl -fsSL https://ppanel.dev/scripts/en/install-docker.sh | sudo bash && \
curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
```

### Option 2: Step-by-Step Installation

If you prefer to install components separately:

#### Step 1: Install Docker & Docker Compose

```bash
curl -fsSL https://ppanel.dev/scripts/en/install-docker.sh | sudo bash
```

This script will:
- ✅ Automatically detect your operating system
- ✅ Install Docker Engine and Docker Compose Plugin
- ✅ Configure Docker service to start on boot
- ✅ Add current user to docker group
- ✅ Verify installation

#### Step 2: Install PPanel

```bash
curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
```

This script will:
- ✅ Check Docker environment
- ✅ Check port availability
- ✅ Create installation directories
- ✅ Interactive configuration (MySQL, Redis)
- ✅ Generate JWT secret automatically
- ✅ Create docker-compose.yml
- ✅ Pull Docker images and start services
- ✅ Display access information

## Configuration During Installation

The installation script will prompt you for the following information:

### MySQL Configuration (Required)

```
MySQL Address (default: localhost:3306):
MySQL Username (default: ppanel):
MySQL Password: [your-password]
MySQL Database (default: ppanel):
```

### Redis Configuration (Required)

```
Redis Address (default: localhost:6379):
Redis Password (optional): [your-password]
Redis DB (default: 0):
```

::: tip
The installation script will automatically generate a secure JWT secret for you.
:::

## Custom Installation Directory

By default, PPanel is installed to `~/ppanel`. You can specify a custom directory:

```bash
INSTALL_DIR=/opt/ppanel curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
```

## Custom Port

By default, PPanel listens on port 8080. To use a different port:

```bash
HOST_PORT=3000 curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
```

## Post-Installation

### Access Your Installation

After successful installation, you can access:

- **User Panel**: `http://your-server-ip:8080`
- **Admin Panel**: `http://your-server-ip:8080/admin/`

### Common Commands

The installation script displays these useful commands:

```bash
# Navigate to installation directory
cd ~/ppanel

# Check service status
docker compose ps

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop services
docker compose stop

# Start services
docker compose start
```

### Configure Firewall

**Ubuntu/Debian:**
```bash
sudo ufw allow 8080/tcp
sudo ufw status
```

**CentOS/RHEL:**
```bash
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### Setup Reverse Proxy (Recommended)

For production deployments, configure a reverse proxy with HTTPS:

**Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Caddy:**
```
your-domain.com {
    reverse_proxy localhost:8080
}
```

## Upgrading

Update the backend image tag in your Compose configuration, pull that image, and recreate the backend service. Preserve your configuration and database backup, and deploy frontend releases separately.

The dashboard displays versions and can restart the backend. Backend 1.20.2 removed gateway-managed upgrades. Existing gateway installations must [migrate their frontend API routing](/guide/separation/frontend#moving-from-the-retired-gateway) before upgrading.

## Troubleshooting

### Installation Failed

If the installation fails, check:

1. **Internet connectivity**: Ensure your server can access Docker Hub and GitHub
2. **System requirements**: Verify your OS is supported
3. **Permissions**: Make sure you have sudo/root access
4. **Port availability**: Check if port 8080 is available

### Docker Not Found

If you get "Docker not found" error:

```bash
# Check if Docker is installed
docker --version

# If not installed, run the Docker installation script first
curl -fsSL https://ppanel.dev/scripts/en/install-docker.sh | sudo bash
```

### Service Won't Start

Check the logs for errors:

```bash
cd ~/ppanel
docker compose logs -f
```

Common issues:
- MySQL connection failed: Check MySQL credentials
- Redis connection failed: Check Redis credentials
- Port already in use: Change the HOST_PORT

### Permission Denied

If you get permission errors with Docker:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker
```

## Uninstalling

To completely remove PPanel:

```bash
cd ~/ppanel
docker compose down
cd ~
rm -rf ~/ppanel
```

## Advanced Options

### Non-Interactive Installation

For automated deployments, you can pre-configure settings using environment variables:

```bash
export INSTALL_DIR=/opt/ppanel
export HOST_PORT=8080
export MYSQL_ADDR=localhost:3306
export MYSQL_USER=ppanel
export MYSQL_PASSWORD=your-password
export MYSQL_DB=ppanel
export REDIS_HOST=localhost:6379
export REDIS_PASS=your-redis-password
export REDIS_DB=0

curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
```

### Installation Behind Proxy

If your server is behind a proxy:

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080

curl -fsSL https://ppanel.dev/scripts/en/install-docker.sh | sudo bash
curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
```

## Next Steps

- [Configuration Guide](/guide/configuration) - Customize your PPanel setup
- [Admin Dashboard](/admin/dashboard) - Start managing your panel
- [API Reference](/api/reference) - Integrate with your applications

## Need Help?

- Check [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
- Review installation logs
- Join our community for support
