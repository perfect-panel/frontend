# Docker Run 部署

本指南介绍如何使用 `docker run` 命令部署 PPanel。此方法适合快速测试或简单部署。

::: tip 提示
对于生产环境，我们推荐使用 [Docker Compose](/zh/guide/installation/docker-compose)。
:::

## 前置条件

### 安装 Docker

**Ubuntu/Debian:**
```bash
# 更新包索引
sudo apt-get update

# 安装 Docker
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
# 安装 Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 验证安装

```bash
docker --version
sudo docker run hello-world
```

## 快速开始

### 步骤 1: 拉取镜像

```bash
# 拉取最新版本
docker pull ppanel/ppanel:latest

# 或拉取指定版本
docker pull ppanel/ppanel:v0.1.2
```

### 步骤 2: 准备配置

```bash
# 创建配置目录
mkdir -p ~/ppanel-config

# 创建配置文件
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

::: warning 必需配置
**MySQL 和 Redis 是必需的。** 部署前请配置以下项：
- `JwtAuth.AccessSecret` - 使用强随机密钥（必需）
- `MySQL.*` - 配置你的 MySQL 数据库连接（必需）
- `Redis.*` - 配置你的 Redis 连接（必需）
:::

### 步骤 3: 运行容器

**基础命令:**
```bash
docker run -d \
  --name ppanel-service \
  -p 8080:8080 \
  -v ~/ppanel-config:/app/etc:ro \
  -v ~/ppanel-web:/app/static \
  --restart always \
  ppanel/ppanel:latest
```

**完整参数命令:**
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

**参数说明:**
- `-d`: 以守护进程模式运行（后台运行）
- `--name ppanel-service`: 设置容器名称
- `-p 8080:8080`: 端口映射（宿主机:容器）
- `-v ~/ppanel-config:/app/etc:ro`: 挂载配置（只读）
- `-v ~/ppanel-web:/app/static`: 挂载静态文件目录
- `--restart always`: 自动重启策略（总是重启）
- `--memory="2g"`: 内存限制（可选）
- `--cpus="2"`: CPU 限制（可选）
- `--network ppanel-net`: 连接到自定义网络（可选）

### 步骤 4: 验证运行

```bash
# 查看容器状态
docker ps | grep ppanel

# 查看日志
docker logs -f ppanel

# 测试访问
curl http://localhost:8080
```

## 容器管理

### 查看日志

```bash
# 查看所有日志
docker logs ppanel

# 实时跟踪日志
docker logs -f ppanel

# 查看最后 100 行
docker logs --tail 100 ppanel

# 显示时间戳
docker logs -t ppanel
```

### 停止容器

```bash
docker stop ppanel
```

### 启动容器

```bash
docker start ppanel
```

### 重启容器

```bash
docker restart ppanel
```

### 删除容器

```bash
# 停止并删除
docker stop ppanel
docker rm ppanel
```

::: warning 注意
删除容器不会删除数据卷。要删除数据卷：
```bash
docker volume rm ppanel-data
```
:::

::: warning 默认凭据
**默认管理员账号**:
- **邮箱**: `admin@ppanel.dev`
- **密码**: `password`

**安全提醒**: 首次登录后请立即修改默认凭据。
:::

## 升级

直接从**管理后台**主页升级 PPanel。在仪表盘主页可以检查新版本并一键升级。

::: tip 提示
系统会自动处理升级过程，包括拉取新镜像和重启服务。
:::

## 高级用法

### 自定义网络

```bash
# 创建网络
docker network create ppanel-net

# 在自定义网络上运行
docker run -d \
  --name ppanel \
  --network ppanel-net \
  -p 8080:8080 \
  -v ~/ppanel-config:/app/etc:ro \
  -v ppanel-data:/app/data \
  ppanel/ppanel:latest
```

### 环境变量

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

### 多实例部署

```bash
# 实例 1 使用端口 8081
docker run -d \
  --name ppanel-1 \
  -p 8081:8080 \
  -v ~/ppanel-config-1:/app/etc:ro \
  -v ppanel-data-1:/app/data \
  ppanel/ppanel:latest

# 实例 2 使用端口 8082
docker run -d \
  --name ppanel-2 \
  -p 8082:8080 \
  -v ~/ppanel-config-2:/app/etc:ro \
  -v ppanel-data-2:/app/data \
  ppanel/ppanel:latest
```

### 资源限制

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

## 故障排除

### 容器立即退出

```bash
# 查看日志
docker logs ppanel

# 检查架构
uname -m
docker image inspect ppanel/ppanel:latest --format '{{.Architecture}}'
```

### 端口被占用

```bash
# 检查什么在使用该端口
sudo lsof -i :8080

# 使用不同端口
docker run -d --name ppanel -p 8081:8080 ...
```

### 配置未加载

```bash
# 验证挂载
docker exec ppanel ls -la /app/etc

# 查看文件内容
docker exec ppanel cat /app/etc/ppanel.yaml

# 检查权限
ls -la ~/ppanel-config/
```

### 进入容器 Shell

```bash
# 进入 bash（如果可用）
docker exec -it ppanel bash

# 进入 sh
docker exec -it ppanel sh

# 运行命令
docker exec ppanel ls -la /app
```

## 下一步

- 尝试 [Docker Compose](/zh/guide/installation/docker-compose) 以获得更简单的管理方式
- 配置[反向代理](/zh/guide/installation/docker-compose#配置反向代理)
- 了解[配置选项](/zh/guide/configuration)

## 需要帮助？

- 查看 [GitHub Issues](https://github.com/perfect-panel/ppanel/issues)
- 查看 Docker 日志: `docker logs ppanel`
- 验证系统要求
