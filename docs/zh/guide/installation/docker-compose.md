# Docker Compose 部署

Docker Compose 是生产环境推荐的部署方式。它提供更好的服务管理、更简单的配置和更便捷的升级流程。

## 前置条件

### 安装 Docker

如果你还没有安装 Docker，请按照官方安装指南进行安装：

**Ubuntu/Debian:**
```bash
# 更新包索引
sudo apt-get update

# 安装必要的依赖包
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**CentOS/RHEL:**
```bash
# 安装 yum-utils
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker
```

### 验证安装

```bash
# 查看 Docker 版本
docker --version

# 查看 Docker Compose 版本
docker compose version

# 测试 Docker 安装
sudo docker run hello-world
```

## 部署步骤

### 步骤 1: 创建项目目录

```bash
# 创建项目目录
mkdir -p ~/ppanel
cd ~/ppanel
```

### 步骤 2: 创建 docker-compose.yml

创建 `docker-compose.yml` 文件，内容如下：

创建 `.env` 文件保存数据库密码，避免明文写进 compose 文件：

```bash
cat > .env <<EOF
POSTGRES_PASSWORD=$(openssl rand -base64 16)
EOF
```

`docker-compose.yml` 内容如下：

```yaml
services:
  postgres:
    image: postgres:18-alpine
    container_name: ppanel-postgres
    restart: always
    environment:
      POSTGRES_DB: ppanel
      POSTGRES_USER: ppanel
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: Asia/Shanghai
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - ppanel-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ppanel -d ppanel"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:8-alpine
    container_name: ppanel-redis
    restart: always
    command: ["redis-server", "--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru"]
    volumes:
      - redis-data:/data
    networks:
      - ppanel-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  ppanel-service:
    image: ppanel/ppanel-server:latest
    container_name: ppanel-service
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
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

volumes:
  postgres-data:
  redis-data:
```

**配置说明:**

- **image**: 使用的 Docker 镜像，支持 amd64/arm64。生产环境建议锁定具体版本而非 `latest`，标签格式为 `<版本>-<提交>`，例如 `ppanel/ppanel-server:1.15.20-23f8e345`，可用标签见 [Docker Hub](https://hub.docker.com/r/ppanel/ppanel-server/tags)
- **container_name**: 设置自定义容器名称
- **ports**: 将容器的 8080 端口映射到宿主机的 8080 端口（可根据需要修改宿主机端口）
- **volumes**:
  - `./config:/app/etc:ro` - 配置目录（只读）
  - `./web:/app/static` - 静态文件目录（管理后台和用户前端）
  - `postgres-data` / `redis-data` - 命名卷，用于持久化数据库数据
- **networks**: 创建自定义网络，三个服务通过服务名（`postgres`、`redis`）互相访问
- **depends_on**: 等数据库与 Redis 健康检查通过后再启动面板
- **restart**: 自动重启策略（always 表示总是重启）
- **healthcheck**: 服务健康检查

::: tip 数据库只在内部网络暴露
`postgres` 与 `redis` 都没有映射到宿主机端口，只有同一网络内的容器能访问。如需从宿主机连接调试，再自行添加 `ports`。
:::

### 步骤 3: 准备配置

```bash
# 创建配置目录
mkdir -p config

# 读取上一步生成的数据库密码，并生成 JWT 密钥
source .env
ACCESS_SECRET=$(openssl rand -base64 32)

# 创建配置文件
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
    AccessSecret: $ACCESS_SECRET
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

Database:
    Driver: postgres
    Addr: postgres:5432
    Username: ppanel
    Password: $POSTGRES_PASSWORD
    Dbname: ppanel
    Config: sslmode=disable&TimeZone=Asia%2FShanghai
    MaxIdleConns: 10
    MaxOpenConns: 10
    SlowThreshold: 1000

Redis:
    Host: redis:6379
    Pass: ''
    DB: 0
EOF
```

::: warning 地址必须使用服务名，而不是 localhost
`Addr: postgres:5432` 和 `Host: redis:6379` 里的 `postgres`、`redis` 是 compose 中的服务名。容器内的 `localhost` 指向容器自身，填 `localhost` 会导致连接被拒。

如果你使用外部数据库（而非上面 compose 里的容器），把地址换成对应的主机名或 IP，并从 `docker-compose.yml` 中删除 `postgres` / `redis` 两个服务及其 `depends_on`。
:::

### 步骤 4: 启动服务

```bash
# 拉取最新镜像
docker compose pull

# 以守护进程模式启动
docker compose up -d

# 查看日志
docker compose logs -f
```

### 步骤 5: 验证部署

```bash
# 查看服务状态
docker compose ps

# 测试服务是否可访问
curl http://localhost:8080

# 查看实时日志
docker compose logs -f ppanel
```

## 部署后配置

### 访问应用

安装成功后，你可以通过以下地址访问：

- **用户面板**: `http://your-server-ip:8080`
- **管理后台**: `http://your-server-ip:8080/admin/`

::: warning 默认凭据
**默认管理员账号**（如果未配置时）:
- **邮箱**: `admin@ppanel.dev`
- **密码**: `password`

**安全提醒**: 首次登录后请立即修改默认凭据。
:::

### 配置反向代理（推荐）

对于生产环境部署，建议使用 Nginx 或 Caddy 作为反向代理以启用 HTTPS。

**Nginx 配置:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
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

**Caddy 配置:**

```
your-domain.com {
    reverse_proxy localhost:8080
}
```

::: tip 提示
Caddy 会通过 Let's Encrypt 自动处理 SSL 证书。
:::

## 服务管理

### 查看日志

```bash
# 查看所有日志
docker compose logs

# 实时跟踪日志
docker compose logs -f

# 查看特定服务日志
docker compose logs ppanel
```

### 停止服务

```bash
# 停止所有服务
docker compose stop

# 停止特定服务
docker compose stop ppanel
```

### 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart ppanel
```

### 停止并删除服务

```bash
# 停止并删除容器
docker compose down

# 停止并删除容器和数据卷
docker compose down -v
```

::: warning 数据持久化
使用 `docker compose down -v` 会删除所有数据卷。只有在想完全清除所有数据时才使用此命令。
:::

## 升级

在 Compose 配置中更新后端镜像标签，拉取该镜像并重建后端服务。保留配置文件和数据库备份，前端版本需单独部署。

管理后台保留版本展示和后端重启功能。后端 1.20.2 已移除网关管理的升级功能，旧网关部署应先[迁移前端 API 路由](/zh/guide/separation/frontend#迁移旧网关部署)，再升级后端。

## 高级配置

### 自定义端口

要使用不同的端口，编辑 `docker-compose.yml`：

```yaml
services:
  ppanel-service:
    ports:
      - "3000:8080"  # 宿主机端口 3000 -> 容器端口 8080
```

### 多实例部署

要运行多个实例，创建独立的目录：

```bash
# 实例 1
mkdir ~/ppanel-1
cd ~/ppanel-1
# 创建 docker-compose.yml，使用端口 8081

# 实例 2
mkdir ~/ppanel-2
cd ~/ppanel-2
# 创建 docker-compose.yml，使用端口 8082
```

### 资源限制

添加资源限制以防止过度消耗：

```yaml
services:
  ppanel:
    # ... 其他配置 ...
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 自定义网络

创建自定义网络以获得更好的隔离：

```yaml
version: '3.8'

services:
  ppanel:
    # ... 其他配置 ...
    networks:
      - ppanel-net

networks:
  ppanel-net:
    driver: bridge
```

## 故障排除

### 容器启动失败

```bash
# 查看错误日志
docker compose logs ppanel

# 检查容器状态
docker compose ps

# 验证配置
docker compose config
```

### 端口被占用

```bash
# 检查什么在使用该端口
sudo lsof -i :8080

# 在 docker-compose.yml 中更改端口
# ports:
#   - "8081:8080"
```

### 权限问题

```bash
# 修复配置目录权限
sudo chown -R $USER:$USER config/

# 确保文件可读
chmod 644 config/ppanel.yaml
```

### 无法从外部访问

1. **检查防火墙规则:**
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 8080

   # CentOS/RHEL
   sudo firewall-cmd --add-port=8080/tcp --permanent
   sudo firewall-cmd --reload
   ```

2. **验证服务是否监听:**
   ```bash
   docker compose ps
   netstat -tlnp | grep 8080
   ```

## 下一步

- [配置指南](/zh/guide/configuration) - 详细的配置选项
- [管理后台](/zh/admin/dashboard) - 开始管理你的面板
- [API 参考](/zh/api/reference) - API 集成指南

## 需要帮助？

如果遇到任何问题：

1. 查看上面的[故障排除](#故障排除)部分
2. 查看 [Docker Compose 日志](#查看日志)
3. 搜索 [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
4. 创建新 issue 并附上详细的系统信息和日志
