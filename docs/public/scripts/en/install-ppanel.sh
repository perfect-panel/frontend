#!/bin/bash

#######################################################
# PPanel One-Click Installation Script
# Support: Docker Compose Deployment
# Usage: curl -fsSL https://ppanel.dev/scripts/en/install-ppanel.sh | bash
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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        log_info "Please install Docker first:"
        log_info "curl -fsSL https://ppanel.dev/scripts/en/install-docker.sh | sudo bash"
        exit 1
    fi

    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed"
        log_info "Please install Docker Compose first"
        exit 1
    fi

    log_info "✓ Docker installed ($(docker --version))"
    log_info "✓ Docker Compose installed ($(docker compose version --short))"
}

# Check if port is in use
check_port() {
    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$HOST_PORT "; then
            log_error "Port $HOST_PORT is already in use"
            log_info "Please set another port: export HOST_PORT=8081"
            exit 1
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln | grep -q ":$HOST_PORT "; then
            log_error "Port $HOST_PORT is already in use"
            log_info "Please set another port: export HOST_PORT=8081"
            exit 1
        fi
    fi
    log_info "✓ Port $HOST_PORT is available"
}

# Create installation directories
create_directories() {
    log_step "Creating installation directories..."

    mkdir -p "$INSTALL_DIR"/config
    # Set permissions to ensure container can read configuration files
    chmod -R 755 "$INSTALL_DIR"

    log_info "✓ Directories created: $INSTALL_DIR"
}

# 生成随机密钥
generate_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -hex 32
    else
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
    fi
}

# Get user input
get_user_input() {
    log_step "Configuring PPanel..."
    echo ""

    # MySQL configuration
    MYSQL_USER="ppanel"
    MYSQL_PASSWORD=$(generate_secret | cut -c1-16)
    MYSQL_DB="ppanel"
    MYSQL_ROOT_PASSWORD=$(generate_secret | cut -c1-16)

    log_info "✓ MySQL password generated"

    # Redis configuration
    REDIS_PASS=$(generate_secret | cut -c1-16)

    log_info "✓ Redis password generated"

    # Administrator configuration
    ADMIN_EMAIL="admin-$(generate_secret | cut -c1-8)@ppanel.dev"
    ADMIN_PASSWORD=$(generate_secret | cut -c1-16)

    log_info "✓ Administrator password generated"

    # Generate JWT secret
    JWT_SECRET=$(generate_secret)
    log_info "✓ JWT secret generated"
}

# Create configuration file
create_config() {
    log_step "Creating configuration file..."

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

    log_info "✓ Configuration file created: $INSTALL_DIR/config/ppanel.yaml"
# Create docker-compose.yml
create_docker_compose() {
    log_step "Creating Docker Compose configuration..."

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

    log_info "✓ Docker Compose configuration created"

    # Create .env file
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

    log_info "✓ Environment variables file created"
}

# Pull Docker image
pull_image() {
    log_step "Pulling Docker image..."

    cd "$INSTALL_DIR"
    docker compose pull

    log_info "✓ Image pulled successfully"
}

# Start service
start_service() {
    log_step "Starting PPanel service..."

    cd "$INSTALL_DIR"
    docker compose up -d

    log_info "✓ Service started"
}

# Wait for service to be ready
wait_for_service() {
    log_step "Waiting for service to be ready..."

    local max_attempts=30
    local attempt=0

    while [[ $attempt -lt $max_attempts ]]; do
        if command -v curl &> /dev/null; then
            if curl -s "http://localhost:$HOST_PORT" &> /dev/null; then
                log_info "✓ Service is ready"
                return 0
            fi
        elif command -v wget &> /dev/null; then
            if wget --quiet --tries=1 --spider "http://localhost:$HOST_PORT" &> /dev/null; then
                log_info "✓ Service is ready"
                return 0
            fi
        else
            # If neither curl nor wget is available, check container health directly
            if docker inspect ppanel-service --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
                log_info "✓ Service is ready"
                return 0
            fi
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    echo ""
    log_warn "Service startup timeout, please check logs"
    log_info "View logs: cd $INSTALL_DIR && docker compose logs -f"
}

# Show access information
show_access_info() {
    local internal_ip
    local public_ip

    # Get internal IP
    internal_ip=$(hostname -I | awk '{print $1}')

    # Get public IP
    public_ip=$(curl -s --max-time 5 https://api.ipify.org 2>/dev/null || curl -s --max-time 5 https://ifconfig.me 2>/dev/null || echo "Unable to get")

    echo ""
    echo "========================================"
    log_info "PPanel installation completed!"
    echo "========================================"
    echo ""
    log_info "Access URLs:"
    echo "  Internal Access (LAN):"
    echo "    User Panel: http://$internal_ip:$HOST_PORT"
    echo "    Admin Panel: http://$internal_ip:$HOST_PORT/admin/"
    echo ""
    if [[ "$public_ip" != "Unable to get" ]]; then
        echo "  Public Access (Internet):"
        echo "    User Panel: http://$public_ip:$HOST_PORT"
        echo "    Admin Panel: http://$public_ip:$HOST_PORT/admin/"
        echo ""
        log_warn "Note: Public access requires firewall and router port forwarding configuration"
    else
        log_warn "Unable to get public IP, please configure manually for public access"
    fi
    echo ""    log_info "Administrator Account:"
    echo "  Email: $ADMIN_EMAIL"
    echo "  Password: $ADMIN_PASSWORD"
    echo ""    log_info "Database Information:"
    echo "  MySQL (Container Network):"
    echo "    Address: mysql:3306"
    echo "    User: $MYSQL_USER"
    echo "    Password: $MYSQL_PASSWORD"
    echo "    Database: $MYSQL_DB"
    echo "    Root Password: $MYSQL_ROOT_PASSWORD"
    echo ""
    echo "  Redis (Container Network):"
    echo "    Address: redis:6379"
    echo "    Password: $REDIS_PASS"
    echo ""
    log_warn "Note: MySQL and Redis are only accessible within the container network"
    echo "      To access from host, edit docker-compose.yml to add port mappings"
    echo ""
    log_info "Installation directory: $INSTALL_DIR"
    echo ""
    log_info "Common commands:"
    echo "  Check status: cd $INSTALL_DIR && docker compose ps"
    echo "  View logs: cd $INSTALL_DIR && docker compose logs -f"
    echo "  Restart: cd $INSTALL_DIR && docker compose restart"
    echo "  Stop: cd $INSTALL_DIR && docker compose stop"
    echo "  Start: cd $INSTALL_DIR && docker compose start"
    echo ""
    log_warn "Important reminders:"
    echo "  1. Please keep database password information safe"
    echo "  2. Please login to admin panel and change the default password"
    echo "  3. Configure firewall rules to restrict access"
    echo "  4. Configure reverse proxy and HTTPS for production"
    echo "  5. Backup database regularly: docker exec ppanel-mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DB > backup.sql"
    echo ""
}

# Show firewall configuration info
show_firewall_info() {
    if command -v ufw &> /dev/null; then
        log_info "Ubuntu/Debian firewall configuration:"
        echo "  sudo ufw allow $HOST_PORT/tcp"
        echo "  sudo ufw status"
        echo ""
    elif command -v firewall-cmd &> /dev/null; then
        log_info "CentOS/RHEL firewall configuration:"
        echo "  sudo firewall-cmd --permanent --add-port=$HOST_PORT/tcp"
        echo "  sudo firewall-cmd --reload"
        echo ""
    fi
}

# Main function
main() {
    echo "========================================"
    echo "     PPanel One-Click Installer"
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
