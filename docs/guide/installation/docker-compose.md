# Docker Compose Deployment

Docker Compose is the recommended deployment method for production environments. It provides better service management, easier configuration, and simplified upgrades.

## Prerequisites

### Install Docker

If you haven't installed Docker yet, please follow the official installation guide:

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**CentOS/RHEL:**
```bash
# Install yum-utils
sudo yum install -y yum-utils

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

### Verify Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker installation
sudo docker run hello-world
```

## Deployment Steps

### Step 1: Create Project Directory

```bash
# Create project directory
mkdir -p ~/ppanel
cd ~/ppanel
```

### Step 2: Create docker-compose.yml

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'

services:
  ppanel-service:
    image: ppanel/ppanel:latest
    container_name: ppanel-service
    restart: always
    ports:
      - "8080:8080"
    volumes:
      - ./config:/app/etc:ro
      - ./web:/app/static
    networks:
      - ppanel-net
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  ppanel-net:
    driver: bridge
```

**Configuration Explanation:**

- **image**: Docker image to use (latest or specific version like `v0.1.2`)
- **container_name**: Set a custom container name
- **ports**: Map container port 8080 to host port 8080 (change host port if needed)
- **volumes**:
  - `./config:/app/etc:ro` - Configuration directory (read-only)
  - `./web:/app/static` - Static files directory (admin and user frontend)
- **networks**: Create a custom network for service isolation
- **restart**: Auto-restart policy (always restart on failures)
- **healthcheck**: Monitor service health

### Step 3: Prepare Configuration

```bash
# Create configuration directory
mkdir -p config

# Create configuration file
cat > config/ppanel.yaml <<EOF
Host: 0.0.0.0
Port: 8080
TLS:
    Enable: false
    CertFile: ""
    KeyFile: ""
Debug: false

Static:
  Admin:
    Enabled: true
    Prefix: /admin
    Path: ./static/admin
  User:
    Enabled: true
    Prefix: /
    Path: ./static/user

JwtAuth:
    AccessSecret: your-secret-key-change-this
    AccessExpire: 604800

Logger:
    ServiceName: ApiService
    Mode: console
    Encoding: plain
    TimeFormat: "2006-01-02 15:04:05.000"
    Path: logs
    Level: info
    MaxContentLength: 0
    Compress: false
    Stat: true
    KeepDays: 0
    StackCooldownMillis: 100
    MaxBackups: 0
    MaxSize: 0
    Rotation: daily
    FileTimeFormat: 2006-01-02T15:04:05.000Z07:00

MySQL:
    Addr: localhost:3306
    Username: your-username
    Password: your-password
    Dbname: ppanel
    Config: charset=utf8mb4&parseTime=true&loc=Asia%2FShanghai
    MaxIdleConns: 10
    MaxOpenConns: 10
    SlowThreshold: 1000

Redis:
    Host: localhost:6379
    Pass: your-redis-password
    DB: 0
EOF
```

::: warning Required Configuration
**MySQL and Redis are required.** Please configure the following before deployment:
- `JwtAuth.AccessSecret` - Use a strong random secret (required)
- `MySQL.*` - Configure your MySQL database connection (required)
- `Redis.*` - Configure your Redis connection (required)
:::

::: tip
For detailed configuration options, please refer to the [Configuration Guide](/guide/configuration).
:::

### Step 4: Start Services

```bash
# Pull the latest image
docker compose pull

# Start in detached mode
docker compose up -d

# View logs
docker compose logs -f
```

### Step 5: Verify Deployment

```bash
# Check service status
docker compose ps

# Check if service is accessible
curl http://localhost:8080

# View real-time logs
docker compose logs -f ppanel
```

## Post-Installation

### Access the Application

After successful installation, you can access:

- **User Panel**: `http://your-server-ip:8080`
- **Admin Panel**: `http://your-server-ip:8080/admin/`

::: warning Default Credentials
**Default Administrator Account** (if not configured):
- **Email**: `admin@ppanel.dev`
- **Password**: `password`

**Security**: Change the default credentials immediately after first login.
:::

### Configure Reverse Proxy (Recommended)

For production deployment, it's recommended to use Nginx or Caddy as a reverse proxy to enable HTTPS.

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
}
```

**Caddy Configuration:**

```
your-domain.com {
    reverse_proxy localhost:8080
}
```

::: tip
Caddy automatically handles SSL certificates via Let's Encrypt.
:::

## Service Management

### View Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs ppanel
```

### Stop Services

```bash
# Stop all services
docker compose stop

# Stop specific service
docker compose stop ppanel
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart ppanel
```

### Stop and Remove Services

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers and volumes
docker compose down -v
```

::: warning Data Persistence
Using `docker compose down -v` will delete all data volumes. Only use this if you want to completely remove all data.
:::

## Upgrading

Upgrade PPanel directly from the **Admin Dashboard**. On the dashboard homepage, you can check for new versions and upgrade with one click.

::: tip
The system will automatically handle the upgrade process, including pulling the new image and restarting the service.
:::

## Advanced Configuration

### Custom Port

To use a different port, edit `docker-compose.yml`:

```yaml
services:
  ppanel-service:
    ports:
      - "3000:8080"  # Host port 3000 -> Container port 8080
```

### Multiple Instances

To run multiple instances, create separate directories:

```bash
# Instance 1
mkdir ~/ppanel-1
cd ~/ppanel-1
# Create docker-compose.yml with port 8081

# Instance 2
mkdir ~/ppanel-2
cd ~/ppanel-2
# Create docker-compose.yml with port 8082
```

### Resource Limits

Add resource limits to prevent overconsumption:

```yaml
services:
  ppanel:
    # ... other config ...
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Custom Network

Create a custom network for better isolation:

```yaml
version: '3.8'

services:
  ppanel:
    # ... other config ...
    networks:
      - ppanel-net

networks:
  ppanel-net:
    driver: bridge
```

## Troubleshooting

### Container Fails to Start

```bash
# Check logs for errors
docker compose logs ppanel

# Check container status
docker compose ps

# Verify configuration
docker compose config
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8080

# Change port in docker-compose.yml
# ports:
#   - "8081:8080"
```

### Permission Issues

```bash
# Fix configuration directory permissions
sudo chown -R $USER:$USER config/

# Make sure files are readable
chmod 644 config/ppanel.yaml
```

### Cannot Access from Outside

1. **Check firewall rules:**
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 8080

   # CentOS/RHEL
   sudo firewall-cmd --add-port=8080/tcp --permanent
   sudo firewall-cmd --reload
   ```

2. **Verify service is listening:**
   ```bash
   docker compose ps
   netstat -tlnp | grep 8080
   ```

## Next Steps

- [Configuration Guide](/guide/configuration) - Detailed configuration options
- [Admin Dashboard](/admin/dashboard) - Start managing your panel
- [API Reference](/api/reference) - API integration guide

## Need Help?

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review [Docker Compose logs](#view-logs)
3. Search [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
4. Create a new issue with detailed system information and logs
