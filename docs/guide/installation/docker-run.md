# Docker Run Deployment

This guide shows you how to deploy PPanel using the `docker run` command. This method is suitable for quick testing or simple deployments.

::: tip
For production environments, we recommend using [Docker Compose](/guide/installation/docker-compose) instead.
:::

## Prerequisites

### Install Docker

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

**CentOS/RHEL:**
```bash
# Install Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Verify Installation

```bash
docker --version
sudo docker run hello-world
```

## Quick Start

### Step 1: Pull the Image

```bash
# Pull latest version
docker pull ppanel/ppanel:latest

# Or pull a specific version
docker pull ppanel/ppanel:v0.1.2
```

### Step 2: Prepare Configuration

```bash
# Create configuration directory
mkdir -p ~/ppanel-config

# Create configuration file
cat > ~/ppanel-config/ppanel.yaml <<EOF
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

### Step 3: Run Container

**Basic Command:**
```bash
docker run -d \
  --name ppanel-service \
  -p 8080:8080 \
  -v ~/ppanel-config:/app/etc:ro \
  -v ~/ppanel-web:/app/static \
  --restart always \
  ppanel/ppanel:latest
```

**With All Options:**
```bash
docker run -d \
  --name ppanel-service \
  -p 8080:8080 \
  -v ~/ppanel-config:/app/etc:ro \
  -v ~/ppanel-web:/app/static \
  --restart always \
  --memory="2g" \
  --cpus="2" \
  --network ppanel-net \
  ppanel/ppanel:latest
```

**Parameter Explanation:**
- `-d`: Run in detached mode (background)
- `--name ppanel-service`: Set container name
- `-p 8080:8080`: Map port (host:container)
- `-v ~/ppanel-config:/app/etc:ro`: Mount configuration (read-only)
- `-v ~/ppanel-web:/app/static`: Mount static files directory
- `--restart always`: Auto-restart policy (always restart)
- `--memory="2g"`: Memory limit (optional)
- `--cpus="2"`: CPU limit (optional)
- `--network ppanel-net`: Connect to custom network (optional)

### Step 4: Verify Running

```bash
# Check container status
docker ps | grep ppanel

# View logs
docker logs -f ppanel

# Test access
curl http://localhost:8080
```

## Container Management

### View Logs

```bash
# View all logs
docker logs ppanel

# Follow logs in real-time
docker logs -f ppanel

# View last 100 lines
docker logs --tail 100 ppanel

# View logs with timestamps
docker logs -t ppanel
```

### Stop Container

```bash
docker stop ppanel
```

### Start Container

```bash
docker start ppanel
```

### Restart Container

```bash
docker restart ppanel
```

### Remove Container

```bash
# Stop and remove
docker stop ppanel
docker rm ppanel
```

::: warning
Removing the container does not delete the data volume. To remove the volume:
```bash
docker volume rm ppanel-data
```
:::

::: warning Default Credentials
**Default Administrator Account**:
- **Email**: `admin@ppanel.dev`
- **Password**: `password`

**Security**: Change the default credentials immediately after first login.
:::

## Upgrading

Upgrade PPanel directly from the **Admin Dashboard**. On the dashboard homepage, you can check for new versions and upgrade with one click.

::: tip
The system will automatically handle the upgrade process, including pulling the new image and restarting the service.
:::

## Advanced Usage

### Custom Network

```bash
# Create network
docker network create ppanel-net

# Run with custom network
docker run -d \
  --name ppanel \
  --network ppanel-net \
  -p 8080:8080 \
  -v ~/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  ppanel/ppanel:latest
```

### Environment Variables

```bash
docker run -d \
  --name ppanel \
  -p 8080:8080 \
  -e SERVER_PORT=8080 \
  -e DATABASE_TYPE=sqlite \
  -e TZ=Asia/Shanghai \
  -v ~/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  ppanel/ppanel:latest
```

### Multiple Instances

```bash
# Instance 1 on port 8081
docker run -d \
  --name ppanel-1 \
  -p 8081:8080 \
  -v ~/ppanel-config-1:/app/etc:ro \
  -v ppanel-data-1:/app/data \
  ppanel/ppanel:latest

# Instance 2 on port 8082
docker run -d \
  --name ppanel-2 \
  -p 8082:8080 \
  -v ~/ppanel-config-2:/app/etc:ro \
  -v ppanel-data-2:/app/data \
  ppanel/ppanel:latest
```

### Resource Limits

```bash
docker run -d \
  --name ppanel \
  -p 8080:8080 \
  --memory="2g" \
  --memory-swap="2g" \
  --cpus="2" \
  --pids-limit=100 \
  -v ~/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  ppanel/ppanel:latest
```

## Troubleshooting

### Container Exits Immediately

```bash
# Check logs
docker logs ppanel

# Check architecture
uname -m
docker image inspect ppanel/ppanel:latest --format '{{.Architecture}}'
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8080

# Use different port
docker run -d --name ppanel -p 8081:8080 ...
```

### Configuration Not Loading

```bash
# Verify mount
docker exec ppanel ls -la /app/etc

# Check file content
docker exec ppanel cat /app/etc/ppanel.yaml

# Check permissions
ls -la ~/ppanel-config/
```

### Access Container Shell

```bash
# Access bash (if available)
docker exec -it ppanel bash

# Access sh
docker exec -it ppanel sh

# Run command
docker exec ppanel ls -la /app
```

## Next Steps

- Try [Docker Compose](/guide/installation/docker-compose) for easier management
- Configure [Reverse Proxy](/guide/installation/docker-compose#configure-reverse-proxy)
- Learn about [Configuration](/guide/configuration)

## Need Help?

- Check [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
- Review Docker logs: `docker logs ppanel`
- Verify system requirements
