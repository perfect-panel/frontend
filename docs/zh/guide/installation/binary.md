# 二进制部署

本指南介绍如何使用预编译的二进制可执行文件部署 PPanel。此方法适合不想使用 Docker 或需要更多部署控制权的用户。

## 前置条件

- **操作系统**: Linux (Ubuntu 20.04+, Debian 10+, CentOS 8+)
- **架构**: amd64 (x86_64) 或 arm64
- **权限**: Root 或 sudo 访问权限
- **依赖**: 无（二进制文件静态编译）

## 下载二进制文件

### 步骤 1: 检查系统架构

```bash
# 查看系统架构
uname -m
# 输出: x86_64 (amd64) 或 aarch64 (arm64)
```

### 步骤 2: 下载最新版本

访问 [GitHub Releases](https://github.com/perfect-panel/ppanel/releases) 页面或直接下载：

::: tip 安装目录
你可以将 PPanel 安装在任意目录，本文档使用 `/opt/ppanel` 作为示例。如果选择其他目录，请相应调整后续命令中的路径。
:::

```bash
# 创建安装目录（可以自定义路径）
sudo mkdir -p /opt/ppanel
cd /opt/ppanel

# 下载 Linux amd64 版本
wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-linux-amd64.tar.gz

# 或下载 Linux arm64 版本
# wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-linux-arm64.tar.gz

# 或下载 macOS amd64 版本
# wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-darwin-amd64.tar.gz

# 或下载 macOS arm64 版本 (Apple Silicon)
# wget https://github.com/perfect-panel/ppanel/releases/latest/download/gateway-darwin-arm64.tar.gz

# 解压
tar -xzf gateway-linux-amd64.tar.gz

# 验证解压的文件
ls -la
```

预期的文件结构：
```
/opt/ppanel/
├── gateway          # 网关可执行文件
└── etc/             # 配置目录
    └── ppanel.yaml  # 配置文件
```

## 配置

### 步骤 1: 准备配置

```bash
# 编辑配置
sudo nano /opt/ppanel/etc/ppanel.yaml
```

**配置示例:**

::: tip 相对路径
配置中的路径（如 `Path`、`logs` 等）支持相对路径。相对路径是相对于程序工作目录（WorkingDirectory）的，在 systemd 服务中即 `/opt/ppanel`。
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

::: warning 必需配置
**MySQL 和 Redis 是必需的。** 部署前请配置以下项：
- `JwtAuth.AccessSecret` - 使用强随机密钥（必需）
- `MySQL.*` - 配置你的 MySQL 数据库连接（必需）
- `Redis.*` - 配置你的 Redis 连接（必需）
:::

### 步骤 2: 创建必要的目录

```bash
# 创建数据和日志目录
sudo mkdir -p /opt/ppanel/data
sudo mkdir -p /opt/ppanel/logs
sudo mkdir -p /opt/ppanel/static

# 设置适当的权限
sudo chmod 755 /opt/ppanel
sudo chmod 700 /opt/ppanel/data
sudo chmod 755 /opt/ppanel/logs
sudo chmod 755 /opt/ppanel/static
```

## 运行服务

### 方式一: 直接运行（测试用）

用于快速测试：

```bash
# 使二进制文件可执行
sudo chmod +x /opt/ppanel/gateway

# 直接运行
cd /opt/ppanel
sudo ./gateway
```

按 `Ctrl+C` 停止。

### 方式二: Systemd 服务（推荐）

为生产环境部署创建 systemd 服务：

#### 步骤 1: 创建服务文件

```bash
sudo nano /etc/systemd/system/ppanel.service
```

**服务文件内容:**

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

# 安全设置
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/ppanel/data /opt/ppanel/logs

# 资源限制
LimitNOFILE=65535
LimitNPROC=4096

# 日志
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ppanel

[Install]
WantedBy=multi-user.target
```

#### 步骤 2: 启用并启动服务

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启用服务（开机自启）
sudo systemctl enable ppanel

# 启动服务
sudo systemctl start ppanel

# 检查状态
sudo systemctl status ppanel
```

## 服务管理

### 检查状态

```bash
# 检查服务是否运行
sudo systemctl status ppanel

# 查看详细状态
sudo systemctl show ppanel
```

### 查看日志

```bash
# 查看 systemd 日志
sudo journalctl -u ppanel -f

# 查看最后 100 行
sudo journalctl -u ppanel -n 100

# 查看应用日志
sudo tail -f /opt/ppanel/logs/ppanel.log
```

### 启动/停止/重启

```bash
# 启动服务
sudo systemctl start ppanel

# 停止服务
sudo systemctl stop ppanel

# 重启服务
sudo systemctl restart ppanel

# 重新加载配置（如果支持）
sudo systemctl reload ppanel
```

### 启用/禁用自动启动

```bash
# 启用开机自启
sudo systemctl enable ppanel

# 禁用自动启动
sudo systemctl disable ppanel

# 检查是否已启用
sudo systemctl is-enabled ppanel
```

## 部署后配置

### 验证安装

```bash
# 检查服务是否监听端口
sudo netstat -tlnp | grep 8080

# 或使用 ss
sudo ss -tlnp | grep 8080

# 测试 HTTP 访问
curl http://localhost:8080

# 检查进程
ps aux | grep ppanel
```

### 访问应用

- **用户面板**: `http://your-server-ip:8080`
- **管理后台**: `http://your-server-ip:8080/admin/`

::: warning 默认凭据
**默认管理员账号**:
- **邮箱**: `admin@ppanel.dev`
- **密码**: `password`

**安全提醒**: 首次登录后请立即修改默认凭据。
:::

### 配置防火墙

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 8080/tcp
sudo ufw status

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

### 设置反向代理

生产环境建议使用 Nginx 或 Caddy 作为反向代理：

**Nginx 配置** (`/etc/nginx/sites-available/ppanel`):

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

        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/ppanel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 升级

直接从**管理后台**主页升级 PPanel。在仪表盘主页可以检查新版本并一键升级。

::: tip 提示
系统会自动处理升级过程，包括下载新的二进制文件和重启服务。
:::

## 故障排除

### 服务启动失败

```bash
# 查看详细日志
sudo journalctl -u ppanel -xe

# 检查配置语法
/opt/ppanel/ppanel-server --check-config

# 验证权限
ls -la /opt/ppanel
sudo chown -R root:root /opt/ppanel
```

### 端口被占用

```bash
# 查找占用端口的进程
sudo lsof -i :8080
sudo netstat -tlnp | grep 8080

# 在配置中更改端口
sudo nano /opt/ppanel/etc/ppanel.yaml
# 更新 server.port 值

# 重启服务
sudo systemctl restart ppanel
```

### 二进制文件无法执行

```bash
# 检查架构兼容性
uname -m
file /opt/ppanel/gateway

# 检查是否可执行
ls -la /opt/ppanel/gateway
sudo chmod +x /opt/ppanel/gateway

# 检查缺失的库（静态编译应该没有）
ldd /opt/ppanel/gateway
```

### 内存使用过高

```bash
# 检查内存使用
ps aux | grep ppanel
top -p $(pgrep ppanel-server)

# 在 systemd 服务中添加内存限制
sudo nano /etc/systemd/system/ppanel.service
# 在 [Service] 下添加:
# MemoryMax=2G
# MemoryHigh=1.5G

sudo systemctl daemon-reload
sudo systemctl restart ppanel
```

### 数据库连接问题

```bash
# 检查数据库文件权限
ls -la /opt/ppanel/data/

# 对于 SQLite，验证配置中的路径
sudo nano /opt/ppanel/etc/ppanel.yaml

# 测试数据库连接
sqlite3 /opt/ppanel/data/ppanel.db "SELECT 1;"

# 检查日志中的数据库错误
sudo journalctl -u ppanel | grep -i database
```

## 卸载

完全移除 PPanel：

```bash
# 停止并禁用服务
sudo systemctl stop ppanel
sudo systemctl disable ppanel

# 删除服务文件
sudo rm /etc/systemd/system/ppanel.service
sudo systemctl daemon-reload

# 删除安装目录
sudo rm -rf /opt/ppanel

# 删除防火墙规则（如果添加过）
sudo ufw delete allow 8080/tcp
# 或
sudo firewall-cmd --permanent --remove-port=8080/tcp
sudo firewall-cmd --reload
```

## 高级配置

### 以非 Root 用户运行

为了更好的安全性，使用专用用户运行：

```bash
# 创建专用用户
sudo useradd -r -s /bin/false ppanel

# 更改所有权
sudo chown -R ppanel:ppanel /opt/ppanel

# 更新 systemd 服务
sudo nano /etc/systemd/system/ppanel.service
# 更改: User=ppanel

# 如果绑定到端口 < 1024，授予能力
sudo setcap 'cap_net_bind_service=+ep' /opt/ppanel/gateway

sudo systemctl daemon-reload
sudo systemctl restart ppanel
```

### 多实例部署

运行多个实例：

```bash
# 创建独立目录
sudo mkdir -p /opt/ppanel-1
sudo mkdir -p /opt/ppanel-2

# 复制二进制文件和配置
sudo cp -r /opt/ppanel/* /opt/ppanel-1/
sudo cp -r /opt/ppanel/* /opt/ppanel-2/

# 编辑配置使用不同端口
sudo nano /opt/ppanel-1/etc/ppanel.yaml  # port: 8081
sudo nano /opt/ppanel-2/etc/ppanel.yaml  # port: 8082

# 创建独立的 systemd 服务
sudo cp /etc/systemd/system/ppanel.service /etc/systemd/system/ppanel-1.service
sudo cp /etc/systemd/system/ppanel.service /etc/systemd/system/ppanel-2.service

# 相应编辑服务文件
sudo systemctl daemon-reload
sudo systemctl enable ppanel-1 ppanel-2
sudo systemctl start ppanel-1 ppanel-2
```

### 自定义环境变量

在 systemd 服务中添加环境变量：

```ini
[Service]
Environment="PPANEL_ENV=production"
Environment="PPANEL_DEBUG=false"
EnvironmentFile=/opt/ppanel/env.conf
```

## 性能调优

### 优化文件限制

```bash
# 编辑限制
sudo nano /etc/security/limits.conf

# 添加:
* soft nofile 65535
* hard nofile 65535

# systemd 服务中已设置:
# LimitNOFILE=65535
```

### 启用数据库优化

对于 SQLite：

```bash
# 在 ppanel.yaml 中添加
database:
  type: sqlite
  path: /opt/ppanel/data/ppanel.db
  options:
    cache_size: -2000
    journal_mode: WAL
    synchronous: NORMAL
```

## 下一步

- [配置指南](/zh/guide/configuration) - 详细的配置选项
- [管理后台](/zh/admin/dashboard) - 开始管理你的面板
- [API 参考](/zh/api/reference) - API 集成

## 需要帮助？

- 查看 [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
- 查看 systemd 日志: `sudo journalctl -u ppanel -f`
- 查看应用日志: `tail -f /opt/ppanel/logs/ppanel.log`
