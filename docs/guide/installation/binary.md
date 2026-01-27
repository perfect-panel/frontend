# Binary Deployment

This guide shows you how to deploy PPanel using pre-built binary executables. This method is suitable for users who prefer not to use Docker or need more control over the deployment.

## Prerequisites

- **Operating System**: Linux (Ubuntu 20.04+, Debian 10+, CentOS 8+)
- **Architecture**: amd64 (x86_64) or arm64
- **Permissions**: Root or sudo access
- **Dependencies**: None (binaries are statically compiled)

## Download Binary

### Step 1: Check System Architecture

```bash
# Check your system architecture
uname -m
# Output: x86_64 (amd64) or aarch64 (arm64)
```

### Step 2: Download Latest Release

Visit the [GitHub Releases](https://github.com/perfect-panel/ppanel/releases) page or download directly:

::: tip Installation Directory
You can install PPanel in any directory. This guide uses `/opt/ppanel` as an example. If you choose a different directory, adjust the paths in subsequent commands accordingly.
:::

```bash
# Create installation directory (customizable)
sudo mkdir -p /opt/ppanel
cd /opt/ppanel

# Download for Linux amd64
wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-linux-amd64.tar.gz

# Or for Linux arm64
# wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-linux-arm64.tar.gz

# Or for macOS amd64
# wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-darwin-amd64.tar.gz

# Or for macOS arm64 (Apple Silicon)
# wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-darwin-arm64.tar.gz

# Extract
tar -xzf gateway-linux-amd64.tar.gz

# Verify extracted files
ls -la
```

Expected files:
```
/opt/ppanel/
├── gateway          # Gateway executable
└── etc/             # Configuration directory
    └── ppanel.yaml  # Configuration file
```

## Configuration

### Step 1: Prepare Configuration

```bash
# Edit configuration
sudo nano /opt/ppanel/etc/ppanel.yaml
```

**Configuration Example:**

::: tip Relative Paths
Paths in the configuration (such as `Path`, `logs`, etc.) support relative paths. Relative paths are relative to the program's working directory (WorkingDirectory), which is `/opt/ppanel` in the systemd service.
:::

```yaml
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
```

::: warning Required Configuration
**MySQL and Redis are required.** Please configure the following before deployment:
- `JwtAuth.AccessSecret` - Use a strong random secret (required)
- `MySQL.*` - Configure your MySQL database connection (required)
- `Redis.*` - Configure your Redis connection (required)
:::

### Step 2: Create Required Directories

```bash
# Create data and log directories
sudo mkdir -p /opt/ppanel/data
sudo mkdir -p /opt/ppanel/logs
sudo mkdir -p /opt/ppanel/static

# Set proper permissions
sudo chmod 755 /opt/ppanel
sudo chmod 700 /opt/ppanel/data
sudo chmod 755 /opt/ppanel/logs
sudo chmod 755 /opt/ppanel/static
```

## Running the Service

### Method 1: Direct Execution (Testing)

For quick testing:

```bash
# Make binary executable
sudo chmod +x /opt/ppanel/gateway

# Run directly
cd /opt/ppanel
sudo ./gateway
```

Press `Ctrl+C` to stop.

### Method 2: Systemd Service (Recommended)

Create a systemd service for production deployment:

#### Step 1: Create Service File

```bash
sudo nano /etc/systemd/system/ppanel.service
```

**Service File Content:**

```ini
[Unit]
Description=PPanel Server
Documentation=https://github.com/perfect-panel/ppanel
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ppanel
ExecStart=/opt/ppanel/gateway
Restart=always
RestartSec=10

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/ppanel/data /opt/ppanel/logs

# Resource limits
LimitNOFILE=65535
LimitNPROC=4096

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ppanel

[Install]
WantedBy=multi-user.target
```

#### Step 2: Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (start on boot)
sudo systemctl enable ppanel

# Start service
sudo systemctl start ppanel

# Check status
sudo systemctl status ppanel
```

## Service Management

### Check Status

```bash
# Check if service is running
sudo systemctl status ppanel

# View detailed status
sudo systemctl show ppanel
```

### View Logs

```bash
# View systemd logs
sudo journalctl -u ppanel -f

# View last 100 lines
sudo journalctl -u ppanel -n 100

# View application logs
sudo tail -f /opt/ppanel/logs/ppanel.log
```

### Start/Stop/Restart

```bash
# Start service
sudo systemctl start ppanel

# Stop service
sudo systemctl stop ppanel

# Restart service
sudo systemctl restart ppanel

# Reload configuration (if supported)
sudo systemctl reload ppanel
```

### Enable/Disable Auto-start

```bash
# Enable auto-start on boot
sudo systemctl enable ppanel

# Disable auto-start
sudo systemctl disable ppanel

# Check if enabled
sudo systemctl is-enabled ppanel
```

## Post-Installation

### Verify Installation

```bash
# Check if service is listening
sudo netstat -tlnp | grep 8080

# Or use ss
sudo ss -tlnp | grep 8080

# Test HTTP access
curl http://localhost:8080

# Check process
ps aux | grep ppanel
```

### Access the Application

- **User Panel**: `http://your-server-ip:8080`
- **Admin Panel**: `http://your-server-ip:8080/admin/`

::: warning Default Credentials
**Default Administrator Account**:
- **Email**: `admin@ppanel.dev`
- **Password**: `password`

**Security**: Change the default credentials immediately after first login.
:::

### Configure Firewall

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 8080/tcp
sudo ufw status

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

### Setup Reverse Proxy

For production, use Nginx or Caddy as reverse proxy:

**Nginx Configuration** (`/etc/nginx/sites-available/ppanel`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/ppanel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Upgrading

Upgrade PPanel directly from the **Admin Dashboard**. On the dashboard homepage, you can check for new versions and upgrade with one click.

::: tip
The system will automatically handle the upgrade process, including downloading the new binary and restarting the service.
:::

## Troubleshooting

### Service Fails to Start

```bash
# Check detailed logs
sudo journalctl -u ppanel -xe

# Check configuration syntax
/opt/ppanel/ppanel-server --check-config

# Verify permissions
ls -la /opt/ppanel
sudo chown -R root:root /opt/ppanel
```

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :8080
sudo netstat -tlnp | grep 8080

# Change port in configuration
sudo nano /opt/ppanel/etc/ppanel.yaml
# Update server.port value

# Restart service
sudo systemctl restart ppanel
```

### Binary Won't Execute

```bash
# Check architecture compatibility
uname -m
file /opt/ppanel/gateway

# Check if executable
ls -la /opt/ppanel/gateway
sudo chmod +x /opt/ppanel/gateway

# Check for missing libraries (should be none for static binary)
ldd /opt/ppanel/gateway
```

### High Memory Usage

```bash
# Check memory usage
ps aux | grep ppanel
top -p $(pgrep ppanel-server)

# Add memory limit to systemd service
sudo nano /etc/systemd/system/ppanel.service
# Add under [Service]:
# MemoryMax=2G
# MemoryHigh=1.5G

sudo systemctl daemon-reload
sudo systemctl restart ppanel
```

### Database Connection Issues

```bash
# Check database file permissions
ls -la /opt/ppanel/data/

# For SQLite, verify path in config
sudo nano /opt/ppanel/etc/ppanel.yaml

# Test database connection
sqlite3 /opt/ppanel/data/ppanel.db "SELECT 1;"

# Check logs for database errors
sudo journalctl -u ppanel | grep -i database
```

## Uninstallation

To completely remove PPanel:

```bash
# Stop and disable service
sudo systemctl stop ppanel
sudo systemctl disable ppanel

# Remove service file
sudo rm /etc/systemd/system/ppanel.service
sudo systemctl daemon-reload

# Remove installation directory
sudo rm -rf /opt/ppanel

# Remove firewall rules (if added)
sudo ufw delete allow 8080/tcp
# or
sudo firewall-cmd --permanent --remove-port=8080/tcp
sudo firewall-cmd --reload
```

## Advanced Configuration

### Running as Non-Root User

For better security, run as dedicated user:

```bash
# Create dedicated user
sudo useradd -r -s /bin/false ppanel

# Change ownership
sudo chown -R ppanel:ppanel /opt/ppanel

# Update systemd service
sudo nano /etc/systemd/system/ppanel.service
# Change: User=ppanel

# If binding to port < 1024, grant capability
sudo setcap 'cap_net_bind_service=+ep' /opt/ppanel/gateway

sudo systemctl daemon-reload
sudo systemctl restart ppanel
```

### Multiple Instances

To run multiple instances:

```bash
# Create separate directories
sudo mkdir -p /opt/ppanel-1
sudo mkdir -p /opt/ppanel-2

# Copy binaries and configs
sudo cp -r /opt/ppanel/* /opt/ppanel-1/
sudo cp -r /opt/ppanel/* /opt/ppanel-2/

# Edit configs with different ports
sudo nano /opt/ppanel-1/etc/ppanel.yaml  # port: 8081
sudo nano /opt/ppanel-2/etc/ppanel.yaml  # port: 8082

# Create separate systemd services
sudo cp /etc/systemd/system/ppanel.service /etc/systemd/system/ppanel-1.service
sudo cp /etc/systemd/system/ppanel.service /etc/systemd/system/ppanel-2.service

# Edit service files accordingly
sudo systemctl daemon-reload
sudo systemctl enable ppanel-1 ppanel-2
sudo systemctl start ppanel-1 ppanel-2
```

### Custom Environment Variables

Add environment variables to systemd service:

```ini
[Service]
Environment="PPANEL_ENV=production"
Environment="PPANEL_DEBUG=false"
EnvironmentFile=/opt/ppanel/env.conf
```

## Performance Tuning

### Optimize File Limits

```bash
# Edit limits
sudo nano /etc/security/limits.conf

# Add:
* soft nofile 65535
* hard nofile 65535

# For systemd service, already set in service file:
# LimitNOFILE=65535
```

### Enable Database Optimization

For SQLite:

```bash
# Add to ppanel.yaml
database:
  type: sqlite
  path: /opt/ppanel/data/ppanel.db
  options:
    cache_size: -2000
    journal_mode: WAL
    synchronous: NORMAL
```

## Next Steps

- [Configuration Guide](/guide/configuration) - Detailed configuration options
- [Admin Dashboard](/admin/dashboard) - Start managing your panel
- [API Reference](/api/reference) - API integration

## Need Help?

- Check [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
- Review systemd logs: `sudo journalctl -u ppanel -f`
- Check application logs: `tail -f /opt/ppanel/logs/ppanel.log`
