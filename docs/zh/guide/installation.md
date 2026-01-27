# 安装部署

本指南将帮助你使用 Docker 在服务器上部署 PPanel。

## 系统要求

### 最低配置
- **操作系统**: Linux (Ubuntu 20.04+, Debian 10+, CentOS 8+)
- **CPU**: 1 核心
- **内存**: 512MB RAM
- **存储**: 1GB 可用磁盘空间
- **Docker**: 20.10+
- **Docker Compose**: 2.0+ (可选，但推荐使用)

### 推荐配置
- **CPU**: 2+ 核心
- **内存**: 2GB+ RAM
- **存储**: 5GB+ 可用磁盘空间

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

## 快速开始

### 方式一：使用 Docker Run

#### 步骤 1: 拉取镜像

```bash
# 拉取最新版本
docker pull ppanel/ppanel:latest

# 或拉取指定版本
docker pull ppanel/ppanel:v0.1.2
```

#### 步骤 2: 准备配置

创建配置目录并准备配置文件：

```bash
# 创建配置目录
mkdir -p ppanel-config

# 创建配置文件
cat > ppanel-config/ppanel.yaml <<EOF
# PPanel 配置文件
server:
  host: 0.0.0.0
  port: 8080

database:
  type: sqlite
  path: /app/data/ppanel.db

# 根据需要添加更多配置
EOF
```

::: tip 提示
详细的配置选项请参考 [配置指南](/zh/guide/configuration)。
:::

#### 步骤 3: 运行容器

```bash
docker run -d \
  --name ppanel \
  -p 8080:8080 \
  -v $(pwd)/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  --restart unless-stopped \
  ppanel/ppanel:latest
```

**参数说明:**
- `-d`: 以守护进程模式运行容器（后台运行）
- `--name ppanel`: 设置容器名称
- `-p 8080:8080`: 将容器的 8080 端口映射到宿主机的 8080 端口
- `-v $(pwd)/ppanel-config:/app/etc:ro`: 挂载配置目录（只读）
- `-v ppanel-data:/app/data`: 创建数据卷用于持久化存储
- `--restart unless-stopped`: 容器自动重启（除非手动停止）

#### 步骤 4: 验证运行状态

```bash
# 查看容器状态
docker ps | grep ppanel

# 查看日志
docker logs -f ppanel

# 测试服务是否可访问
curl http://localhost:8080
```

### 方式二：使用 Docker Compose（推荐）

#### 步骤 1: 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  ppanel:
    image: ppanel/ppanel:latest
    container_name: ppanel
    ports:
      - "8080:8080"
    volumes:
      - ./ppanel-config:/app/etc:ro
      - ppanel-data:/app/data
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  ppanel-data:
    driver: local
```

#### 步骤 2: 准备配置

```bash
# 创建配置目录
mkdir -p ppanel-config

# 复制或创建配置文件
# 详细配置请参考配置指南
```

#### 步骤 3: 启动服务

```bash
# 以守护进程模式启动
docker compose up -d

# 查看日志
docker compose logs -f

# 查看状态
docker compose ps
```

## 部署后配置

### 访问应用

安装成功后，你可以通过以下地址访问：

- **用户面板**: `http://your-server-ip:8080`
- **管理后台**: `http://your-server-ip:8080/admin`

::: warning 管理员账户
**默认管理员账户**（如果配置文件未设置）：
- **邮箱**: `admin@ppanel.dev`
- **密码**: `password`

**一键安装脚本**会自动生成随机的管理员账户并在安装结束时显示：
- **邮箱**: `admin-[8位随机字符]@ppanel.dev`
- **密码**: `[随机生成的16位密码]`

**安全建议**：
- 使用一键安装脚本时，请妥善保管脚本生成的凭据
- 首次登录后立即修改密码
- 如果使用默认账户，**必须**在首次登录后修改邮箱和密码
:::

### 配置反向代理（可选）

对于生产环境部署，建议使用 Nginx 或 Caddy 作为反向代理以启用 HTTPS。

**Nginx 示例:**

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
    }
}
```

**Caddy 示例:**

```
your-domain.com {
    reverse_proxy localhost:8080
}
```

## 容器管理

### 查看日志

```bash
# Docker Run
docker logs -f ppanel

# Docker Compose
docker compose logs -f
```

### 停止容器

```bash
# Docker Run
docker stop ppanel

# Docker Compose
docker compose stop
```

### 重启容器

```bash
# Docker Run
docker restart ppanel

# Docker Compose
docker compose restart
```

### 删除容器

```bash
# Docker Run
docker stop ppanel
docker rm ppanel

# Docker Compose
docker compose down
```

::: warning 数据持久化
删除容器不会删除数据卷。如需同时删除数据卷，请使用：
```bash
docker compose down -v
```
:::

## 升级

### 备份配置

升级前，请先备份配置和数据：

```bash
# 备份配置
tar czf ppanel-config-backup-$(date +%Y%m%d).tar.gz ppanel-config/

# 备份数据卷
docker run --rm \
  -v ppanel-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/ppanel-data-backup-$(date +%Y%m%d).tar.gz /data
```

### 升级步骤

#### 使用 Docker Run

```bash
# 拉取最新镜像
docker pull ppanel/ppanel:latest

# 停止并删除旧容器
docker stop ppanel
docker rm ppanel

# 使用相同配置启动新容器
docker run -d \
  --name ppanel \
  -p 8080:8080 \
  -v $(pwd)/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  --restart unless-stopped \
  ppanel/ppanel:latest
```

#### 使用 Docker Compose

```bash
# 拉取最新镜像
docker compose pull

# 使用新镜像重新创建容器
docker compose up -d
```

### 验证升级

```bash
# 检查容器是否正在运行
docker ps | grep ppanel

# 检查日志是否有错误
docker logs ppanel

# 验证应用是否可访问
curl http://localhost:8080
```

## 故障排除

### 容器立即退出

**检查架构兼容性:**
```bash
# 查看主机架构
uname -m

# 查看镜像架构
docker image inspect ppanel/ppanel:latest --format '{{.Architecture}}'
```

**查看日志:**
```bash
docker logs ppanel
```

### 无法访问服务

1. **检查容器是否运行:**
   ```bash
   docker ps | grep ppanel
   ```

2. **检查端口映射:**
   ```bash
   docker port ppanel
   ```

3. **检查防火墙规则:**
   ```bash
   # Ubuntu/Debian
   sudo ufw status
   sudo ufw allow 8080

   # CentOS/RHEL
   sudo firewall-cmd --list-ports
   sudo firewall-cmd --add-port=8080/tcp --permanent
   sudo firewall-cmd --reload
   ```

### 配置未生效

1. **验证挂载路径:**
   ```bash
   docker exec ppanel ls -la /app/etc
   ```

2. **检查配置语法:**
   ```bash
   docker exec ppanel cat /app/etc/ppanel.yaml
   ```

3. **重启容器:**
   ```bash
   docker restart ppanel
   ```

### 性能问题

1. **检查资源使用情况:**
   ```bash
   docker stats ppanel
   ```

2. **增加容器资源**（如果使用 Docker Desktop）:
   - 打开 Docker Desktop 设置
   - 转到 Resources（资源）
   - 增加 CPU 和内存分配

3. **检查磁盘空间:**
   ```bash
   df -h
   docker system df
   ```

## 高级配置

### 使用环境变量

你可以通过环境变量覆盖配置：

```bash
docker run -d \
  --name ppanel \
  -p 8080:8080 \
  -e SERVER_PORT=8080 \
  -e DATABASE_TYPE=sqlite \
  -v $(pwd)/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  --restart unless-stopped \
  ppanel/ppanel:latest
```

### 运行多个实例

要运行多个实例，请使用不同的端口和容器名称：

```bash
# 实例 1
docker run -d \
  --name ppanel-1 \
  -p 8081:8080 \
  -v $(pwd)/ppanel-config-1:/app/etc:ro \
  -v ppanel-data-1:/app/data \
  ppanel/ppanel:latest

# 实例 2
docker run -d \
  --name ppanel-2 \
  -p 8082:8080 \
  -v $(pwd)/ppanel-config-2:/app/etc:ro \
  -v ppanel-data-2:/app/data \
  ppanel/ppanel:latest
```

### 自定义网络

创建自定义 Docker 网络以获得更好的隔离：

```bash
# 创建网络
docker network create ppanel-net

# 在自定义网络上运行容器
docker run -d \
  --name ppanel \
  --network ppanel-net \
  -p 8080:8080 \
  -v $(pwd)/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  ppanel/ppanel:latest
```

## 下一步

- [配置指南](/zh/guide/configuration) - 了解详细的配置选项
- [管理后台](/zh/admin/dashboard) - 开始管理你的面板
- [API 参考](/zh/api/reference) - 集成 PPanel API

## 需要帮助？

如果遇到任何问题：

1. 查看上面的[故障排除](#故障排除)部分
2. 搜索 [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
3. 加入我们的社区讨论
4. 创建新 issue 并附上详细的日志和系统信息
