#!/bin/bash

#######################################################
# PPanel 一键安装脚本
# 支持: Docker Compose 部署
# 用法: curl -fsSL https://ppanel.dev/scripts/zh/install-ppanel.sh | bash
#######################################################

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
INSTALL_DIR="${INSTALL_DIR:-$(pwd)/ppanel}"
DOCKER_IMAGE="ppanel/ppanel:latest"
CONTAINER_NAME="ppanel-service"
HOST_PORT="${HOST_PORT:-8080}"

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查 Docker 是否已安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装"
        log_info "请先安装 Docker:"
        log_info "curl -fsSL https://ppanel.dev/scripts/install-docker.sh | sudo bash"
        exit 1
    fi

    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose 未安装"
        log_info "请先安装 Docker Compose"
        exit 1
    fi

    log_info "✓ Docker 已安装 ($(docker --version))"
    log_info "✓ Docker Compose 已安装 ($(docker compose version --short))"
}

# 检查端口是否被占用
check_port() {
    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$HOST_PORT "; then
            log_error "端口 $HOST_PORT 已被占用"
            log_info "请设置其他端口: export HOST_PORT=8081"
            exit 1
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln | grep -q ":$HOST_PORT "; then
            log_error "端口 $HOST_PORT 已被占用"
            log_info "请设置其他端口: export HOST_PORT=8081"
            exit 1
        fi
    fi
    log_info "✓ 端口 $HOST_PORT 可用"
}

# 创建安装目录
create_directories() {
    log_step "创建安装目录..."

    mkdir -p "$INSTALL_DIR"/config
    # 设置权限确保容器可以读取配置文件
    chmod -R 755 "$INSTALL_DIR"

    log_info "✓ 目录已创建: $INSTALL_DIR"
}

# 生成随机密钥
generate_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -hex 32
    else
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
    fi
}

# 获取用户输入
get_user_input() {
    log_step "配置 PPanel..."
    echo ""

    # MySQL 配置
    MYSQL_USER="ppanel"
    MYSQL_PASSWORD=$(generate_secret | cut -c1-16)
    MYSQL_DB="ppanel"
    MYSQL_ROOT_PASSWORD=$(generate_secret | cut -c1-16)

    log_info "✓ 已生成 MySQL 密码"

    # Redis 配置
    REDIS_PASS=$(generate_secret | cut -c1-16)

    log_info "✓ 已生成 Redis 密码"

    # 管理员配置
    ADMIN_EMAIL="admin-$(generate_secret | cut -c1-8)@ppanel.dev"
    ADMIN_PASSWORD=$(generate_secret | cut -c1-16)

    log_info "✓ 已生成管理员密码"

    # 生成 JWT 密钥
    JWT_SECRET=$(generate_secret)
    log_info "✓ 已生成 JWT 密钥"
}

# 创建配置文件
create_config() {
    log_step "创建配置文件..."

    cat > "$INSTALL_DIR/config/ppanel.yaml" <<EOF
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
    AccessSecret: $JWT_SECRET
    AccessExpire: 604800

Administrator:
    Email: $ADMIN_EMAIL
    Password: "$ADMIN_PASSWORD"

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
    Addr: mysql:3306
    Username: $MYSQL_USER
    Password: $MYSQL_PASSWORD
    Dbname: $MYSQL_DB
    Config: charset=utf8mb4&parseTime=true&loc=Asia%2FShanghai
    MaxIdleConns: 10
    MaxOpenConns: 10
    SlowThreshold: 1000

Redis:
    Host: redis:6379
    Pass: $REDIS_PASS
    DB: 0
EOF

    log_info "✓ 配置文件已创建: $INSTALL_DIR/config/ppanel.yaml"
}

# 创建 docker-compose.yml
create_docker_compose() {
    log_step "创建 Docker Compose 配置..."

    cat > "$INSTALL_DIR/docker-compose.yml" <<'COMPOSE_EOF'
services:
  mysql:
    image: mysql:8.0
    container_name: ppanel-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DB}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      TZ: Asia/Shanghai
    volumes:
      - mysql:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    healthcheck:
      test: [
        "CMD-SHELL",
        "mysqladmin ping -h localhost -u $$MYSQL_USER -p$$MYSQL_PASSWORD || exit 1"
      ]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

  redis:
    image: redis:7-alpine
    container_name: ppanel-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASS} --appendonly yes
    volumes:
      - redis:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  ppanel-service:
    image: ${DOCKER_IMAGE}
    container_name: ${CONTAINER_NAME}
    restart: always
    ports:
      - "${HOST_PORT}:8080"
    volumes:
      - ./config:/app/etc:ro
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  mysql:
  redis:
COMPOSE_EOF

    log_info "✓ Docker Compose 配置已创建"

    # 创建 .env 文件
    cat > "$INSTALL_DIR/.env" <<ENV_EOF
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DB=$MYSQL_DB
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
REDIS_PASS=$REDIS_PASS
DOCKER_IMAGE=$DOCKER_IMAGE
CONTAINER_NAME=$CONTAINER_NAME
HOST_PORT=$HOST_PORT
ENV_EOF

    log_info "✓ 环境变量文件已创建"
}

# 拉取 Docker 镜像
pull_image() {
    log_step "拉取 Docker 镜像..."

    cd "$INSTALL_DIR"
    docker compose pull

    log_info "✓ 镜像拉取完成"
}

# 启动服务
start_service() {
    log_step "启动 PPanel 服务..."

    cd "$INSTALL_DIR"
    docker compose up -d

    log_info "✓ 服务已启动"
}

# 等待服务就绪
wait_for_service() {
    log_step "等待服务就绪..."

    local max_attempts=30
    local attempt=0

    while [[ $attempt -lt $max_attempts ]]; do
        if command -v curl &> /dev/null; then
            if curl -s "http://localhost:$HOST_PORT" &> /dev/null; then
                log_info "✓ 服务已就绪"
                return 0
            fi
        elif command -v wget &> /dev/null; then
            if wget --quiet --tries=1 --spider "http://localhost:$HOST_PORT" &> /dev/null; then
                log_info "✓ 服务已就绪"
                return 0
            fi
        else
            # 如果 curl 和 wget 都不可用，直接检查容器状态
            if docker inspect ppanel-service --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
                log_info "✓ 服务已就绪"
                return 0
            fi
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    echo ""
    log_warn "服务启动超时，请检查日志"
    log_info "查看日志: cd $INSTALL_DIR && docker compose logs -f"
}

# 显示访问信息
show_access_info() {
    local internal_ip
    local public_ip

    # 获取内网IP
    internal_ip=$(hostname -I | awk '{print $1}')

    # 获取外网IP
    public_ip=$(curl -s --max-time 5 https://api.ipify.org 2>/dev/null || curl -s --max-time 5 https://ifconfig.me 2>/dev/null || echo "无法获取")

    echo ""
    echo "========================================"
    log_info "PPanel 安装完成!"
    echo "========================================"
    echo ""
    log_info "访问地址:"
    echo "  内网访问 (局域网):"
    echo "    用户面板: http://$internal_ip:$HOST_PORT"
    echo "    管理后台: http://$internal_ip:$HOST_PORT/admin/"
    echo ""
    if [[ "$public_ip" != "无法获取" ]]; then
        echo "  外网访问 (公网):"
        echo "    用户面板: http://$public_ip:$HOST_PORT"
        echo "    管理后台: http://$public_ip:$HOST_PORT/admin/"
        echo ""
        log_warn "注意: 外网访问需要配置防火墙和路由器端口转发"
    else
        log_warn "未能获取公网IP，如需外网访问请手动配置"
    fi
    echo ""
    log_info "管理员账户:"
    echo "  邮箱: $ADMIN_EMAIL"
    echo "  密码: $ADMIN_PASSWORD"
    echo ""
    log_info "数据库信息:"
    echo "  MySQL (容器间通信):"
    echo "    地址: mysql:3306"
    echo "    用户: $MYSQL_USER"
    echo "    密码: $MYSQL_PASSWORD"
    echo "    数据库: $MYSQL_DB"
    echo "    Root 密码: $MYSQL_ROOT_PASSWORD"
    echo ""
    echo "  Redis (容器间通信):"
    echo "    地址: redis:6379"
    echo "    密码: $REDIS_PASS"
    echo ""
    log_warn "注意: MySQL 和 Redis 仅在容器网络内可访问，未暴露到宿主机"
    echo "       如需从宿主机访问，请编辑 docker-compose.yml 添加端口映射"
    echo ""
    log_info "安装目录: $INSTALL_DIR"
    echo ""
    log_info "常用命令:"
    echo "  查看状态: cd $INSTALL_DIR && docker compose ps"
    echo "  查看日志: cd $INSTALL_DIR && docker compose logs -f"
    echo "  重启服务: cd $INSTALL_DIR && docker compose restart"
    echo "  停止服务: cd $INSTALL_DIR && docker compose stop"
    echo "  启动服务: cd $INSTALL_DIR && docker compose start"
    echo ""
    log_warn "重要提示:"
    echo "  1. 请妥善保管数据库密码信息"
    echo "  2. 请及时登录管理后台修改默认密码"
    echo "  3. 建议配置防火墙规则限制访问"
    echo "  4. 生产环境请配置反向代理和 HTTPS"
    echo "  5. 定期备份数据库: docker exec ppanel-mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DB > backup.sql"
    echo ""
}

# 配置防火墙提示
show_firewall_info() {
    if command -v ufw &> /dev/null; then
        log_info "Ubuntu/Debian 防火墙配置:"
        echo "  sudo ufw allow $HOST_PORT/tcp"
        echo "  sudo ufw status"
        echo ""
    elif command -v firewall-cmd &> /dev/null; then
        log_info "CentOS/RHEL 防火墙配置:"
        echo "  sudo firewall-cmd --permanent --add-port=$HOST_PORT/tcp"
        echo "  sudo firewall-cmd --reload"
        echo ""
    fi
}

# 主函数
main() {
    echo "========================================"
    echo "     PPanel 一键安装脚本"
    echo "========================================"
    echo ""

    check_docker
    check_port
    create_directories
    get_user_input
    create_config
    create_docker_compose
    pull_image
    start_service
    wait_for_service
    show_access_info
    show_firewall_info
}

main "$@"
