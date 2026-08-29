declare namespace API {
  type Ads = {
    content: string;
    created_at: number;
    description: string;
    end_time: number;
    id: number;
    start_time: number;
    status: number;
    target_url: string;
    title: string;
    type: string;
    updated_at: number;
  };

  type Announcement = {
    content: string;
    created_at: number;
    id: number;
    pinned: boolean;
    popup: boolean;
    show: boolean;
    title: string;
    updated_at: number;
  };

  type AuthMethodConfig = {
    config: any;
    enabled: boolean;
    id: number;
    method: string;
  };

  type BalanceLog = {
    actor_id: number;
    amount: number;
    balance: number;
    client_ip: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    order_no: string;
    timestamp: number;
    type: number;
    user_agent: string;
    user_id: number;
  };

  type BatchDeleteCouponRequest = {
    ids: number[];
  };

  type BatchDeleteDocumentRequest = {
    ids: number[];
  };

  type BatchDeleteSubscribeGroupRequest = {
    ids: number[];
  };

  type BatchDeleteSubscribeRequest = {
    ids: number[];
  };

  type BatchDeleteUserRequest = {
    ids: number[];
  };

  type BatchSendEmailTask = {
    additional: string;
    content: string;
    created_at: number;
    current: number;
    errors: string;
    id: number;
    interval: number;
    limit: number;
    recipients: string;
    register_end_time: number;
    register_start_time: number;
    scheduled: number;
    scope: number;
    status: number;
    subject: string;
    total: number;
    updated_at: number;
  };

  type CommissionLog = {
    actor_id: number;
    amount: number;
    client_ip: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    order_no: string;
    timestamp: number;
    type: number;
    user_agent: string;
    user_id: number;
  };

  type Coupon = {
    code: string;
    count: number;
    created_at: number;
    discount: number;
    enable: boolean;
    expire_time: number;
    id: number;
    name: string;
    start_time: number;
    subscribe: number[];
    type: number;
    updated_at: number;
    used_count: number;
    user_limit: number;
  };

  type CreateAdsRequest = {
    content?: string;
    description?: string;
    end_time?: number;
    start_time?: number;
    status?: number;
    target_url?: string;
    title?: string;
    type?: string;
  };

  type CreateAnnouncementRequest = {
    content: string;
    title: string;
  };

  type CreateBatchSendEmailTaskRequest = {
    additional?: string;
    content: string;
    interval?: number;
    limit?: number;
    register_end_time?: number;
    register_start_time?: number;
    scheduled?: number;
    scope: 1 | 2 | 3 | 4 | 5;
    subject: string;
  };

  type CreateCouponRequest = {
    code?: string;
    count?: number;
    discount: number;
    enable?: boolean;
    expire_time: number;
    name: string;
    start_time: number;
    subscribe?: number[];
    type: number;
    used_count?: number;
    user_limit?: number;
  };

  type CreateDocumentRequest = {
    content: string;
    show?: boolean;
    tags?: string[];
    title: string;
  };

  type CreateNodeRequest = {
    address?: string;
    enabled?: boolean;
    name?: string;
    port?: number;
    protocol?: string;
    server_id?: number;
    tags?: string[];
  };

  type CreateOrderRequest = {
    amount: number;
    commission?: number;
    coupon?: string;
    coupon_discount?: number;
    discount?: number;
    fee_amount: number;
    payment_id: number;
    price: number;
    quantity?: number;
    status?: number;
    subscribe_id?: number;
    trade_no?: string;
    type: number;
    user_id: number;
  };

  type CreatePaymentMethodRequest = {
    config: any;
    description?: string;
    domain?: string;
    enable: boolean;
    fee_amount?: number;
    fee_mode?: number;
    fee_percent?: number;
    icon?: string;
    name: string;
    platform: string;
    sort?: number;
  };

  type CreateQuotaTaskRequest = {
    days?: number;
    end_time?: number;
    gift_type?: 0 | 1 | 2;
    gift_value?: number;
    is_active?: boolean;
    reset_traffic?: boolean;
    start_time?: number;
    subscribers?: number[];
  };

  type CreateServerRequest = {
    address?: string;
    city?: string;
    country?: string;
    name?: string;
    protocols?: Protocol[];
    sort?: number;
  };

  type CreateSubscribeApplicationRequest = {
    /** DefaultParams holds the template params this client should receive when the
subscription URL does not carry them, in query-string form such as
"mode=rule&emoji=1". */
    default_params?: string;
    description?: string;
    download_link?: DownloadLink;
    icon?: string;
    is_default?: boolean;
    name?: string;
    output_format?: string;
    scheme?: string;
    template?: string;
    user_agent?: string;
  };

  type CreateSubscribeGroupRequest = {
    description?: string;
    name: string;
  };

  type CreateSubscribeRequest = {
    allow_deduction?: boolean;
    deduction_ratio?: number;
    description?: string;
    device_limit?: number;
    discount?: SubscribeDiscount[];
    inventory?: number;
    language?: string;
    name: string;
    node_tags?: string[];
    nodes?: number[];
    quota?: number;
    renewal_reset?: boolean;
    replacement?: number;
    reset_cycle?: number;
    sell?: boolean;
    show?: boolean;
    show_original_price?: boolean;
    speed_limit?: number;
    traffic?: number;
    unit_price?: number;
    unit_time?: string;
  };

  type CreateTicketFollowRequest = {
    content: string;
    from: string;
    ticket_id: number;
    type: number;
  };

  type CreateUserAuthMethodRequest = {
    auth_identifier?: string;
    auth_type?: string;
    user_id?: number;
  };

  type CreateUserRequest = {
    balance?: number;
    commission?: number;
    duration?: number;
    email?: string;
    gift_amount?: number;
    is_admin?: boolean;
    only_first_purchase?: boolean;
    password?: string;
    product_id?: number;
    refer_code?: string;
    referer_user?: string;
    referral_percentage?: number;
    telephone?: string;
    telephone_area_code?: string;
  };

  type CreateUserSubscribeRequest = {
    expired_at?: number;
    subscribe_id?: number;
    traffic?: number;
    user_id?: number;
  };

  type CurrencyConfig = {
    access_key: string;
    currency_symbol: string;
    currency_unit: string;
  };

  type DeleteAdsRequest = {
    id?: number;
  };

  type DeleteAnnouncementRequest = {
    id: number;
  };

  type DeleteCouponRequest = {
    id: number;
  };

  type DeleteDocumentRequest = {
    id: number;
  };

  type DeleteNodeRequest = {
    id?: number;
  };

  type DeletePaymentMethodRequest = {
    id: number;
  };

  type DeleteServerRequest = {
    id?: number;
  };

  type DeleteSubscribeApplicationRequest = {
    id?: number;
  };

  type DeleteSubscribeGroupRequest = {
    id: number;
  };

  type DeleteSubscribeRequest = {
    id: number;
  };

  type DeleteUserAuthMethodRequest = {
    auth_type?: string;
    user_id?: number;
  };

  type DeleteUserDeivceRequest = {
    id?: number;
  };

  type DeleteUserSubscribeRequest = {
    user_subscribe_id?: number;
  };

  type Document = {
    content: string;
    created_at: number;
    id: number;
    show: boolean;
    tags: string[];
    title: string;
    updated_at: number;
  };

  type DownloadLink = {
    android?: string;
    harmony?: string;
    ios?: string;
    linux?: string;
    mac?: string;
    windows?: string;
  };

  type FilterBalanceLogResponse = {
    list: BalanceLog[];
    total: number;
  };

  type FilterCommissionLogResponse = {
    list: CommissionLog[];
    total: number;
  };

  type FilterEmailLogResponse = {
    list: MessageLog[];
    total: number;
  };

  type FilterGiftLogResponse = {
    list: GiftLog[];
    total: number;
  };

  type FilterLoginLogResponse = {
    list: LoginLog[];
    total: number;
  };

  type FilterMobileLogResponse = {
    list: MessageLog[];
    total: number;
  };

  type FilterNodeListResponse = {
    list: Node[];
    total: number;
  };

  type FilterOrderLogResponse = {
    list: OrderLog[];
    total: number;
  };

  type FilterRegisterLogResponse = {
    list: RegisterLog[];
    total: number;
  };

  type FilterResetSubscribeLogResponse = {
    list: ResetSubscribeLog[];
    total: number;
  };

  type FilterServerListResponse = {
    list: Server[];
    total: number;
  };

  type FilterServerTrafficLogResponse = {
    list: ServerTrafficLog[];
    total: number;
  };

  type FilterSubscribeLogResponse = {
    list: SubscribeLog[];
    total: number;
  };

  type FilterSubscribeTrafficResponse = {
    list: UserSubscribeTrafficLog[];
    total: number;
  };

  type FilterTrafficLogDetailsResponse = {
    list: TrafficLogDetails[];
    total: number;
  };

  type Follow = {
    content: string;
    created_at: number;
    from: string;
    id: number;
    ticket_id: number;
    type: number;
  };

  type getAdsDetailParams = {
    id?: number;
  };

  type getAdsListParams = {
    page: number;
    search?: string;
    size: number;
    status?: number;
  };

  type GetAdsListResponse = {
    list: Ads[];
    total: number;
  };

  type getAnnouncementDetailParams = {
    id: number;
  };

  type getAnnouncementListParams = {
    page: number;
    pinned?: boolean;
    popup?: boolean;
    search?: string;
    show?: boolean;
    size: number;
  };

  type GetAnnouncementListResponse = {
    list: Announcement[];
    total: number;
  };

  type getApplicationPreviewParams = {
    id?: number;
  };

  type getApplicationSubscribeApplicationListParams = {
    page: number;
    size: number;
  };

  type getAuthMethodConfigParams = {
    method?: string;
  };

  type GetAuthMethodListResponse = {
    list: AuthMethodConfig[];
  };

  type GetBatchSendEmailTaskListResponse = {
    list: BatchSendEmailTask[];
    total: number;
  };

  type GetBatchSendEmailTaskStatusRequest = {
    id: number;
  };

  type GetBatchSendEmailTaskStatusResponse = {
    current: number;
    errors: string;
    status: number;
    total: number;
  };

  type getCouponListParams = {
    page: number;
    search?: string;
    size: number;
    subscribe?: number;
  };

  type GetCouponListResponse = {
    list: Coupon[];
    total: number;
  };

  type GetDetailRequest = {
    id: number;
  };

  type getDocumentDetailParams = {
    id: number;
  };

  type getDocumentListParams = {
    page: number;
    search?: string;
    size: number;
    tag?: string;
  };

  type GetDocumentListResponse = {
    list: Document[];
    total: number;
  };

  type getLogBalanceListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
  };

  type getLogCommissionListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
  };

  type getLogEmailListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
  };

  type getLogGiftListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
  };

  type getLogLoginListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
  };

  type getLogMessageListParams = {
    page: number;
    search?: string;
    size: number;
    type: 10 | 11;
  };

  type getLogMobileListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
  };

  type getLogOrderListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
  };

  type getLogRegisterListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
  };

  type getLogServerTrafficListParams = {
    date?: string;
    page: number;
    search?: string;
    server_id?: number;
    size: number;
  };

  type getLogSubscribeListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
    user_subscribe_id?: number;
  };

  type getLogSubscribeResetListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_subscribe_id?: number;
  };

  type getLogSubscribeTrafficListParams = {
    date?: string;
    page: number;
    search?: string;
    size: number;
    user_id?: number;
    user_subscribe_id?: number;
  };

  type getLogTrafficDetailsParams = {
    date?: string;
    page: number;
    search?: string;
    server_id?: number;
    size: number;
    subscribe_id?: number;
    user_id?: number;
  };

  type getMarketingEmailBatchListParams = {
    page?: number;
    scope?: 1 | 2 | 3 | 4 | 5;
    size?: number;
    status?: 0 | 1 | 2 | 3 | 4 | 5;
  };

  type getMarketingQuotaListParams = {
    page?: number;
    size?: number;
    status?: 0 | 1 | 2 | 3 | 4 | 5;
  };

  type GetMessageLogListResponse = {
    list: MessageLog[];
    total: number;
  };

  type GetNodeMultiplierResponse = {
    periods: TimePeriod[];
  };

  type getOrderListParams = {
    page: number;
    search?: string;
    size: number;
    status?: number;
    subscribe_id?: number;
    user_id?: number;
  };

  type GetOrderListResponse = {
    list: Order[];
    total: number;
  };

  type getPaymentListParams = {
    enable?: boolean;
    page: number;
    platform?: string;
    search?: string;
    size: number;
  };

  type GetPaymentMethodListResponse = {
    list: PaymentMethodDetail[];
    total: number;
  };

  type GetPreSendEmailCountRequest = {
    additional?: string;
    register_end_time?: number;
    register_start_time?: number;
    scope: 1 | 2 | 3 | 4 | 5;
  };

  type GetPreSendEmailCountResponse = {
    count: number;
  };

  type getServerListParams = {
    page: number;
    search?: string;
    size: number;
  };

  type getServerNodeConfigParams = {
    server_id: number;
  };

  type GetServerNodeConfigResponse = {
    effective: ServerNodeConfigValues;
    global: ServerNodeConfigValues;
    override: ServerNodeConfigOverride;
  };

  type getServerNodeListParams = {
    page: number;
    search?: string;
    size: number;
  };

  type getServerProtocolsParams = {
    id?: number;
  };

  type GetServerProtocolsResponse = {
    protocols: Protocol[];
  };

  type GetSubscribeApplicationListResponse = {
    list: SubscribeApplication[];
    total: number;
  };

  type getSubscribeDetailsParams = {
    id: number;
  };

  type GetSubscribeGroupListResponse = {
    list: SubscribeGroup[];
    total: number;
  };

  type getSubscribeListParams = {
    language?: string;
    page: number;
    search?: string;
    size: number;
  };

  type GetSubscribeListResponse = {
    list: SubscribeItem[];
    total: number;
  };

  type getTicketDetailParams = {
    id: number;
  };

  type getTicketListParams = {
    page: number;
    search?: string;
    size: number;
    status?: number;
    user_id?: number;
  };

  type GetTicketListResponse = {
    list: Ticket[];
    total: number;
  };

  type getToolIpLocationParams = {
    ip: string;
  };

  type getUserAuthMethodParams = {
    user_id?: number;
  };

  type GetUserAuthMethodResponse = {
    auth_methods: UserAuthMethod[];
  };

  type getUserDetailParams = {
    id: number;
  };

  type getUserListParams = {
    page: number;
    search?: string;
    size: number;
    subscribe_id?: number;
    unscoped?: boolean;
    user_id?: number;
    user_subscribe_id?: number;
    user_subscribe_token?: string;
  };

  type GetUserListResponse = {
    list: User[];
    total: number;
  };

  type getUserLoginLogsParams = {
    page: number;
    size: number;
    user_id?: number;
  };

  type GetUserLoginLogsResponse = {
    list: UserLoginLog[];
    total: number;
  };

  type getUserSubscribeDetailParams = {
    id: number;
  };

  type getUserSubscribeDeviceParams = {
    page: number;
    size: number;
    subscribe_id?: number;
    user_id?: number;
  };

  type GetUserSubscribeDevicesResponse = {
    list: UserDevice[];
    total: number;
  };

  type GetUserSubscribeListResponse = {
    list: UserSubscribe[];
    total: number;
  };

  type getUserSubscribeLogsParams = {
    page: number;
    size: number;
    subscribe_id?: number;
    user_id?: number;
  };

  type GetUserSubscribeLogsResponse = {
    list: UserSubscribeLog[];
    total: number;
  };

  type getUserSubscribeParams = {
    page: number;
    size: number;
    user_id?: number;
  };

  type getUserSubscribeResetLogsParams = {
    page: number;
    size: number;
    user_subscribe_id?: number;
  };

  type GetUserSubscribeResetTrafficLogsResponse = {
    list: ResetSubscribeTrafficLog[];
    total: number;
  };

  type getUserSubscribeTrafficLogsParams = {
    end_time?: number;
    page: number;
    size: number;
    start_time?: number;
    subscribe_id?: number;
    user_id?: number;
  };

  type GetUserSubscribeTrafficLogsResponse = {
    list: TrafficLog[];
    total: number;
  };

  type getWithdrawalListParams = {
    page: number;
    size: number;
    status?: 0 | 1 | 2;
    user_id?: number;
  };

  type GetWithdrawalListResponse = {
    list: WithdrawalLog[];
    total: number;
  };

  type GiftLog = {
    actor_id: number;
    amount: number;
    balance: number;
    client_ip: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    order_no: string;
    remark: string;
    subscribe_id: number;
    timestamp: number;
    type: number;
    user_agent: string;
    user_id: number;
  };

  type InviteConfig = {
    forced_invite: boolean;
    only_first_purchase: boolean;
    referral_percentage: number;
    withdrawal_method: string;
  };

  type KickOfflineRequest = {
    id?: number;
  };

  type LoginLog = {
    actor_id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    login_ip: string;
    method: string;
    success: boolean;
    timestamp: number;
    user_agent: string;
    user_id: number;
  };

  type LogResponse = {
    list: any;
  };

  type LogSetting = {
    auto_clear: boolean;
    clear_days: number;
  };

  type MessageLog = {
    actor_id: number;
    client_ip: string;
    content: any;
    created_at: number;
    id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    platform: string;
    status: number;
    subject: string;
    to: string;
    type: number;
    user_agent: string;
  };

  type ModuleConfig = {
    /** 通讯密钥 */
    secret: string;
    /** 服务名称 */
    service_name: string;
    /** 服务版本 */
    service_version: string;
  };

  type Node = {
    address: string;
    created_at: number;
    enabled: boolean;
    id: number;
    name: string;
    port: number;
    protocol: string;
    server_id: number;
    sort: number;
    tags: string[];
    updated_at: number;
  };

  type NodeConfig = {
    block: string[];
    dns: NodeDNS[];
    ip_strategy: string;
    node_pull_interval: number;
    node_push_interval: number;
    node_secret: string;
    outbound: NodeOutbound[];
    traffic_report_threshold: number;
  };

  type NodeDNS = {
    address: string;
    domains: string[];
    proto: string;
    server_name?: string;
  };

  type NodeOutbound = {
    address: string;
    allow_insecure?: boolean;
    alpn?: string[];
    cipher?: string;
    congestion_controller?: string;
    encryption?: string;
    encryption_client_padding?: string;
    encryption_mode?: string;
    encryption_password?: string;
    encryption_rtt?: string;
    encryption_ticket?: string;
    fingerprint?: string;
    flow?: string;
    heartbeat?: number;
    host?: string;
    multiplex?: string;
    name: string;
    password: string;
    path?: string;
    plugin?: string;
    plugin_opts?: any;
    port: number;
    protocol: string;
    reality_public_key?: string;
    reality_short_id?: string;
    reduce_rtt?: boolean;
    rules: string[];
    security?: string;
    service_name?: string;
    settings?: string;
    sni?: string;
    spider_x?: string;
    stream_settings?: string;
    transport?: string;
    udp_stream?: boolean;
    uot?: boolean;
    uot_version?: number;
    user?: string;
    uuid?: string;
    xhttp_extra?: string;
    xhttp_mode?: string;
  };

  type Order = {
    amount: number;
    commission: number;
    coupon: string;
    coupon_discount: number;
    created_at: number;
    discount: number;
    fee_amount: number;
    gift_amount: number;
    id: number;
    order_no: string;
    payment: PaymentMethod;
    price: number;
    quantity: number;
    status: number;
    subscribe_id: number;
    trade_no: string;
    type: number;
    updated_at: number;
    user_id: number;
  };

  type OrderLog = {
    actor_id: number;
    amount: number;
    client_ip: string;
    coupon_discount: number;
    discount: number;
    fee_amount: number;
    gift_amount: number;
    id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    method: string;
    order_no: string;
    order_type: number;
    payment_id: number;
    price: number;
    quantity: number;
    source: string;
    subscribe_id: number;
    timestamp: number;
    user_agent: string;
    user_id: number;
  };

  type OrdersStatistics = {
    amount_total: number;
    date: string;
    list: OrdersStatistics[];
    new_order_amount: number;
    renewal_order_amount: number;
  };

  type PaymentConfig = {
    config: any;
    description: string;
    domain: string;
    enable: boolean;
    fee_amount: number;
    fee_mode: number;
    fee_percent: number;
    icon: string;
    id: number;
    name: string;
    platform: string;
    sort: number;
  };

  type PaymentMethod = {
    description: string;
    fee_amount: number;
    fee_mode: number;
    fee_percent: number;
    icon: string;
    id: number;
    name: string;
    platform: string;
    sort: number;
  };

  type PaymentMethodDetail = {
    config: any;
    description: string;
    domain: string;
    enable: boolean;
    fee_amount: number;
    fee_mode: number;
    fee_percent: number;
    icon: string;
    id: number;
    name: string;
    notify_url: string;
    platform: string;
    sort: number;
  };

  type PlatformInfo = {
    platform: string;
    platform_field_description: Record<string, any>;
    platform_url: string;
  };

  type PlatformResponse = {
    list: PlatformInfo[];
  };

  type PreViewNodeMultiplierResponse = {
    current_time: string;
    ratio: number;
  };

  type PreviewSubscribeTemplateResponse = {
    /** 预览的模板内容 */
    template: string;
  };

  type PrivacyPolicyConfig = {
    privacy_policy: string;
  };

  type Protocol = {
    /** 监听器通用兼容字段：是否接收 PROXY protocol；当前节点入站尚未统一启用。 */
    accept_proxy_protocol: boolean;
    /** TLS 客户端兼容字段：允许跳过证书校验；入站配置通常不消费，不能作为服务端证书配置使用。 */
    allow_insecure: boolean;
    /** TLS/HTTP/QUIC 协议通用字段：TLS ALPN 列表；Nowhere 必须且只能设置一个值，默认 now/1。 */
    alpn: string[];
    /** TLS 协议通用字段：cert_mode=dns 时传给 DNS 服务商的环境变量/凭据配置。 */
    cert_dns_env: string;
    /** TLS 协议通用字段：cert_mode=dns 时使用的 DNS 服务商标识。 */
    cert_dns_provider: string;
    /** TLS 协议通用字段：证书来源模式，支持 file、self、http、dns；none 表示不配置证书。 */
    cert_mode: string;
    /** Shadowsocks/SSR 共用字段：Shadowsocks method 或 SSR cipher。 */
    cipher: string;
    /** QUIC 协议共用字段：TUIC 的主拥塞控制字段，也是 Naive 的旧字段别名。 */
    congestion_controller: string;
    /** TLS 客户端兼容字段：禁用 SNI；当前服务端入站不消费。 */
    disable_sni: boolean;
    /** Hysteria2 专属字段：服务端下行带宽参数，单位为 Mbps。 */
    down_mbps: number;
    /** 订阅客户端字段：是否启用 Encrypted ClientHello；节点配置下发时会过滤。 */
    ech_enable: boolean;
    /** 订阅客户端字段：ECH 外层 ServerName；节点配置下发时会过滤。 */
    ech_server_name: string;
    /** 通用字段：是否启用该入站协议。 */
    enable: boolean;
    /** VLESS Encryption 专属字段：加密套件，如 none、mlkem768x25519plus。 */
    encryption: string;
    /** VLESS Encryption 客户端信息字段：客户端方向 padding 规则，用于订阅输出。 */
    encryption_client_padding: string;
    /** VLESS Encryption 专属字段：密钥封装模式，如 native、xorpub、random。 */
    encryption_mode: string;
    /** VLESS Encryption 客户端信息字段：1-RTT/派生认证密码，用于订阅输出。 */
    encryption_password: string;
    /** VLESS Encryption 服务端专属字段：ML-KEM/X25519 私钥材料。 */
    encryption_private_key: string;
    /** VLESS Encryption 专属字段：握手往返模式，取值 0rtt 或 1rtt。 */
    encryption_rtt: string;
    /** VLESS Encryption 服务端专属字段：服务端方向 padding 规则。 */
    encryption_server_padding: string;
    /** VLESS Encryption 服务端专属字段：0-RTT ticket。 */
    encryption_ticket: string;
    /** TLS 客户端兼容字段：uTLS 指纹；当前节点入站不消费，仅为出站/旧配置兼容保留。 */
    fingerprint: string;
    /** VLESS 专属字段：XTLS Vision 流控模式，当前有效值为 xtls-rprx-vision。 */
    flow: string;
    /** TUIC 专属字段：连接心跳间隔，单位为秒；0 使用节点默认值。 */
    heartbeat: number;
    /** Hysteria2/TUIC 类 QUIC 协议字段：端口跳跃时间间隔；当前节点入站尚未启用该能力。 */
    hop_interval: number;
    /** Hysteria2/TUIC 类 QUIC 协议字段：端口跳跃范围；当前节点入站尚未启用该能力。 */
    hop_ports: string;
    /** VLESS/VMess/Trojan 传输字段：WebSocket、HTTPUpgrade 或 XHTTP 的 Host。 */
    host: string;
    /** Snell 专属字段：Snell v6 的工作模式；其他协议不应设置。 */
    mode: string;
    /** 协议无关能力字段：多路复用级别（off、low、medium、high），适用于支持 mux 的流协议。 */
    multiplex: string;
    /** 监听网络通用字段：选择 tcp、udp 或 both；Nowhere 规范化为 mix、tcp 或 udp，其他协议按各自能力校验。 */
    network: string;
    /** 混淆协议共用字段：Hysteria2 的 Salamander、Snell v5 的 obfs、SSR 的 obfs 方法。 */
    obfs: string;
    /** 旧混淆实现兼容字段：混淆目标 Host；当前节点入站不消费，Shadowsocks 插件应使用 plugin_opts。 */
    obfs_host: string;
    /** SSR 专属字段：SSR obfs_param。 */
    obfs_param: string;
    /** Hysteria2 专属字段：Salamander 混淆密码，仅在 obfs=salamander 时使用。 */
    obfs_password: string;
    /** 旧混淆实现兼容字段：混淆请求路径；当前节点入站不消费，Shadowsocks 插件应使用 plugin_opts。 */
    obfs_path: string;
    /** AnyTLS 专属字段：TLS record padding 方案。 */
    padding_scheme: string;
    /** VLESS/VMess/Trojan 传输字段：WebSocket、HTTPUpgrade 或 XHTTP 的请求路径。 */
    path: string;
    /** Shadowsocks（AEAD/2022）专属字段：入站插件名，如 obfs、v2ray-plugin、shadow-tls、restls。 */
    plugin: string;
    /** Shadowsocks（AEAD/2022）专属字段：所选入站插件的结构化参数。 */
    plugin_opts: any;
    /** 通用字段：入站监听端口。 */
    port: number;
    /** SSR 专属字段：SSR protocol 方法；JSON 名称 protocol 与顶层 type 不同。 */
    protocol: string;
    /** SSR 专属字段：SSR protocol_param。 */
    protocol_param: string;
    /** QUIC 协议共用字段：Naive 的主拥塞控制字段，也是 TUIC 的兼容别名。 */
    quic_congestion_control: string;
    /** 面板通用字段：流量计费倍率，默认值为 1；不参与节点协议握手。 */
    ratio: number;
    /** VLESS/VMess REALITY 服务端专属字段：服务端 X25519 私钥。 */
    reality_private_key: string;
    /** VLESS/VMess REALITY 客户端信息字段：由私钥对应的公钥，主要用于订阅输出。 */
    reality_public_key: string;
    /** VLESS/VMess REALITY 专属字段：REALITY 握手转发目标地址。 */
    reality_server_addr: string;
    /** VLESS/VMess REALITY 专属字段：REALITY 握手转发目标端口。 */
    reality_server_port: number;
    /** VLESS/VMess REALITY 专属字段：允许客户端使用的 short ID。 */
    reality_short_id: string;
    /** TUIC 专属字段：启用 QUIC 0-RTT，以减少首次握手往返。 */
    reduce_rtt: boolean;
    /** TLS/REALITY 协议通用字段：选择 none、tls 或 reality；实际可选值由具体协议限制。 */
    security: string;
    /** 密钥型协议共用字段：Shadowsocks 2022 服务端密钥、SSR 密码或 Snell PSK。 */
    server_key: string;
    /** VLESS/VMess/Trojan gRPC 传输专属字段：gRPC service name。 */
    service_name: string;
    /** TLS 协议通用字段：证书域名及 TLS ServerName；REALITY 也用它作为服务端名称。 */
    sni: string;
    /** Mieru 专属字段：流量形态/包长分布配置。 */
    traffic_pattern: string;
    /** VLESS/VMess/Trojan 通用传输字段：tcp、ws、httpupgrade、grpc 或 xhttp。 */
    transport: string;
    /** 通用字段：协议类型标识，例如 shadowsocks、vless、vmess、hysteria2、tuic、nowhere。 */
    type: string;
    /** TUIC/Hysteria 兼容字段：旧实现的 UDP relay 模式；当前节点入站不消费。 */
    udp_relay_mode: string;
    /** 协议无关能力字段：UDP over TCP 开关，供支持 UoT 的协议使用，并非某一协议专属。 */
    uot: boolean;
    /** 协议无关能力字段：UoT 协议版本，当前支持 1 或 2；0 表示使用默认版本。 */
    uot_version: number;
    /** Hysteria2 专属字段：服务端上行带宽参数，单位为 Mbps。 */
    up_mbps: number;
    /** Mieru 专属字段：是否强制客户端携带可识别用户的 user hint。 */
    user_hint_is_mandatory: boolean;
    /** 版本字段：Snell 接受 5/6，TUIC 接受 5，Nowhere 接受 1；0 表示使用协议默认值。 */
    version: number;
    /** VLESS/VMess/Trojan XHTTP 传输专属字段：XHTTP 扩展路径/参数。 */
    xhttp_extra: string;
    /** VLESS/VMess/Trojan XHTTP 传输专属字段：XHTTP 工作模式，如 auto、packet-up、stream-up。 */
    xhttp_mode: string;
  };

  type QueryIPLocationResponse = {
    city: string;
    country: string;
    region: string;
  };

  type QueryNodeTagResponse = {
    tags: string[];
  };

  type QueryQuotaTaskListResponse = {
    list: QuotaTask[];
    total: number;
  };

  type QueryQuotaTaskPreCountRequest = {
    end_time?: number;
    is_active?: boolean;
    start_time?: number;
    subscribers?: number[];
  };

  type QueryQuotaTaskPreCountResponse = {
    count: number;
  };

  type QuotaTask = {
    created_at: number;
    current: number;
    days: number;
    end_time: number;
    errors: string;
    gift_type: number;
    gift_value: number;
    id: number;
    is_active: boolean;
    /** UserSubscribe IDs */
    objects: number[];
    reset_traffic: boolean;
    start_time: number;
    status: number;
    subscribers: number[];
    total: number;
    updated_at: number;
  };

  type RegisterConfig = {
    enable_ip_register_limit: boolean;
    enable_trial: boolean;
    ip_register_limit: number;
    ip_register_limit_duration: number;
    stop_register: boolean;
    trial_subscribe: number;
    trial_time: number;
    trial_time_unit: string;
  };

  type RegisterLog = {
    actor_id: number;
    auth_method: string;
    identifier: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    register_ip: string;
    timestamp: number;
    user_agent: string;
    user_id: number;
  };

  type ResetAllSubscribeTokenResponse = {
    success: boolean;
  };

  type ResetSortRequest = {
    sort?: SortItem[];
  };

  type ResetSubscribeLog = {
    actor_id: number;
    client_ip: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    order_no: string;
    timestamp: number;
    type: number;
    user_agent: string;
    user_id: number;
    user_subscribe_id: number;
  };

  type ResetSubscribeTrafficLog = {
    actor_id: number;
    client_ip: string;
    id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    order_no: string;
    timestamp: number;
    type: number;
    user_agent: string;
    user_subscribe_id: number;
  };

  type ResetUserSubscribeTokenRequest = {
    user_subscribe_id?: number;
  };

  type ResetUserSubscribeTrafficRequest = {
    user_subscribe_id?: number;
  };

  type ResponseSuccessBean = {
    code: number;
    msg: string;
  };

  type RevenueStatisticsResponse = {
    all: OrdersStatistics;
    monthly: OrdersStatistics;
    today: OrdersStatistics;
  };

  type ReviewWithdrawalRequest = {
    id: number;
    reason?: string;
    status?: 1 | 2;
  };

  type Server = {
    address: string;
    city: string;
    country: string;
    created_at: number;
    id: number;
    last_reported_at: number;
    name: string;
    protocols: Protocol[];
    sort: number;
    status: ServerStatus;
    updated_at: number;
  };

  type ServerNodeConfigOverride = {
    block: string[];
    dns: NodeDNS[];
    inherit_block: boolean;
    inherit_dns: boolean;
    inherit_ip_strategy: boolean;
    inherit_outbound: boolean;
    ip_strategy: string;
    outbound: NodeOutbound[];
  };

  type ServerNodeConfigValues = {
    block: string[];
    dns: NodeDNS[];
    ip_strategy: string;
    outbound: NodeOutbound[];
  };

  type ServerOnlineIP = {
    ip: string;
    protocol: string;
  };

  type ServerOnlineUser = {
    expired_at: number;
    ip: ServerOnlineIP[];
    subscribe: string;
    subscribe_id: number;
    traffic: number;
    user_id: number;
  };

  type ServerStatus = {
    cpu: number;
    disk: number;
    mem: number;
    online: ServerOnlineUser[];
    protocol: string;
    status: string;
  };

  type ServerTotalDataResponse = {
    monthly_download: number;
    monthly_upload: number;
    offline_servers: number;
    online_servers: number;
    online_users: number;
    server_traffic_ranking_today: ServerTrafficData[];
    server_traffic_ranking_yesterday: ServerTrafficData[];
    today_download: number;
    today_upload: number;
    updated_at: number;
    user_traffic_ranking_today: UserTrafficData[];
    user_traffic_ranking_yesterday: UserTrafficData[];
  };

  type ServerTrafficData = {
    download: number;
    name: string;
    server_id: number;
    upload: number;
  };

  type ServerTrafficLog = {
    /** Date in YYYY-MM-DD format */
    date: string;
    /** Whether to show detailed traffic */
    details: boolean;
    /** Download traffic in bytes */
    download: number;
    /** Server ID */
    server_id: number;
    /** Total traffic in bytes (Upload + Download) */
    total: number;
    /** Upload traffic in bytes */
    upload: number;
  };

  type SetNodeMultiplierRequest = {
    periods?: TimePeriod[];
  };

  type SiteConfig = {
    custom_data: string;
    custom_html: string;
    host: string;
    keywords: string;
    site_desc: string;
    site_logo: string;
    site_name: string;
  };

  type SortItem = {
    id: number;
    sort: number;
  };

  type StopBatchSendEmailTaskRequest = {
    id: number;
  };

  type Subscribe = {
    allow_deduction: boolean;
    created_at: number;
    deduction_ratio: number;
    description: string;
    device_limit: number;
    discount: SubscribeDiscount[];
    id: number;
    inventory: number;
    language: string;
    name: string;
    node_tags: string[];
    nodes: number[];
    quota: number;
    renewal_reset: boolean;
    replacement: number;
    reset_cycle: number;
    sell: boolean;
    show: boolean;
    show_original_price: boolean;
    sort: number;
    speed_limit: number;
    traffic: number;
    unit_price: number;
    unit_time: string;
    updated_at: number;
  };

  type SubscribeApplication = {
    created_at: number;
    default_params: string;
    description: string;
    download_link: DownloadLink;
    icon: string;
    id: number;
    is_default: boolean;
    name: string;
    output_format: string;
    scheme: string;
    template: string;
    updated_at: number;
    user_agent: string;
  };

  type SubscribeConfig = {
    pan_domain: boolean;
    profile_update_interval: number;
    profile_web_page_url: string;
    show_tutorial: boolean;
    single_model: boolean;
    subscribe_domain: string;
    subscribe_path: string;
    user_agent_limit: boolean;
    user_agent_list: string;
  };

  type SubscribeDiscount = {
    discount: number;
    quantity: number;
  };

  type SubscribeGroup = {
    created_at: number;
    description: string;
    id: number;
    name: string;
    updated_at: number;
  };

  type SubscribeItem = {
    allow_deduction: boolean;
    created_at: number;
    deduction_ratio: number;
    description: string;
    device_limit: number;
    discount: SubscribeDiscount[];
    id: number;
    inventory: number;
    language: string;
    name: string;
    node_tags: string[];
    nodes: number[];
    quota: number;
    renewal_reset: boolean;
    replacement: number;
    reset_cycle: number;
    sell: boolean;
    show: boolean;
    show_original_price: boolean;
    sold: number;
    sort: number;
    speed_limit: number;
    traffic: number;
    unit_price: number;
    unit_time: string;
    updated_at: number;
  };

  type SubscribeLog = {
    actor_id: number;
    client_ip: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    timestamp: number;
    token: string;
    user_agent: string;
    user_id: number;
    user_subscribe_id: number;
  };

  type SubscribeSortRequest = {
    sort?: SortItem[];
  };

  type TestEmailSendRequest = {
    email: string;
  };

  type TestSmsSendRequest = {
    area_code: string;
    telephone: string;
  };

  type Ticket = {
    created_at: number;
    description: string;
    follow: Follow[];
    id: number;
    status: number;
    title: string;
    updated_at: number;
    user_id: number;
  };

  type TicketWaitRelpyResponse = {
    count: number;
  };

  type TimePeriod = {
    end_time: string;
    multiplier: number;
    start_time: string;
  };

  type ToggleNodeStatusRequest = {
    enable?: boolean;
    id?: number;
  };

  type ToggleUserSubscribeStatusRequest = {
    user_subscribe_id?: number;
  };

  type TosConfig = {
    tos_content: string;
  };

  type TrafficLog = {
    download: number;
    id: number;
    server_id: number;
    subscribe_id: number;
    timestamp: number;
    upload: number;
    user_id: number;
  };

  type TrafficLogDetails = {
    download: number;
    id: number;
    server_id: number;
    subscribe_id: number;
    timestamp: number;
    upload: number;
    user_id: number;
  };

  type UpdateAdsRequest = {
    content?: string;
    description?: string;
    end_time?: number;
    id?: number;
    start_time?: number;
    status?: number;
    target_url?: string;
    title?: string;
    type?: string;
  };

  type UpdateAnnouncementRequest = {
    content?: string;
    id: number;
    pinned?: boolean;
    popup?: boolean;
    show?: boolean;
    title?: string;
  };

  type UpdateAuthMethodConfigRequest = {
    config?: any;
    enabled?: boolean;
    id?: number;
    method?: string;
  };

  type UpdateCouponRequest = {
    code?: string;
    count?: number;
    discount: number;
    enable?: boolean;
    expire_time: number;
    id: number;
    name: string;
    start_time: number;
    subscribe?: number[];
    type: number;
    used_count?: number;
    user_limit?: number;
  };

  type UpdateDocumentRequest = {
    content: string;
    id: number;
    show?: boolean;
    tags?: string[];
    title: string;
  };

  type UpdateNodeRequest = {
    address?: string;
    enabled?: boolean;
    id?: number;
    name?: string;
    port?: number;
    protocol?: string;
    server_id?: number;
    tags?: string[];
  };

  type UpdateOrderStatusRequest = {
    id: number;
    payment_id?: number;
    status: number;
    trade_no?: string;
  };

  type UpdatePaymentMethodRequest = {
    config: any;
    description?: string;
    domain?: string;
    enable: boolean;
    fee_amount?: number;
    fee_mode?: number;
    fee_percent?: number;
    icon?: string;
    id: number;
    name: string;
    platform: string;
    sort?: number;
  };

  type UpdateServerNodeConfigRequest = {
    block?: string[];
    dns?: NodeDNS[];
    inherit_block?: boolean;
    inherit_dns?: boolean;
    inherit_ip_strategy?: boolean;
    inherit_outbound?: boolean;
    ip_strategy?: string;
    outbound?: NodeOutbound[];
    server_id: number;
  };

  type UpdateServerRequest = {
    address?: string;
    city?: string;
    country?: string;
    id?: number;
    name?: string;
    protocols?: Protocol[];
    sort?: number;
  };

  type UpdateSubscribeApplicationRequest = {
    default_params?: string;
    description?: string;
    download_link?: DownloadLink;
    icon?: string;
    id?: number;
    is_default?: boolean;
    name?: string;
    output_format?: string;
    scheme?: string;
    template?: string;
    user_agent?: string;
  };

  type UpdateSubscribeGroupRequest = {
    description?: string;
    id: number;
    name: string;
  };

  type UpdateSubscribeRequest = {
    allow_deduction?: boolean;
    deduction_ratio?: number;
    description?: string;
    device_limit?: number;
    discount?: SubscribeDiscount[];
    id: number;
    inventory?: number;
    language?: string;
    name: string;
    node_tags?: string[];
    nodes?: number[];
    quota?: number;
    renewal_reset?: boolean;
    replacement?: number;
    reset_cycle?: number;
    sell?: boolean;
    show?: boolean;
    show_original_price?: boolean;
    sort?: number;
    speed_limit?: number;
    traffic?: number;
    unit_price?: number;
    unit_time?: string;
  };

  type UpdateTicketStatusRequest = {
    id: number;
    status: number;
  };

  type UpdateUserAuthMethodRequest = {
    auth_identifier?: string;
    auth_type?: string;
    user_id?: number;
  };

  type UpdateUserBasiceInfoRequest = {
    avatar?: string;
    balance?: number;
    commission?: number;
    enable?: boolean;
    gift_amount?: number;
    is_admin?: boolean;
    only_first_purchase?: boolean;
    password?: string;
    refer_code?: string;
    referer_id?: number;
    referral_percentage?: number;
    telegram?: number;
    user_id: number;
  };

  type UpdateUserNotifySettingRequest = {
    enable_balance_notify?: boolean;
    enable_login_notify?: boolean;
    enable_subscribe_notify?: boolean;
    enable_trade_notify?: boolean;
    user_id: number;
  };

  type UpdateUserSubscribeRequest = {
    download?: number;
    expired_at?: number;
    subscribe_id?: number;
    traffic?: number;
    upload?: number;
    user_subscribe_id?: number;
  };

  type User = {
    auth_methods: UserAuthMethod[];
    avatar: string;
    balance: number;
    commission: number;
    created_at: number;
    deleted_at: number;
    enable: boolean;
    enable_balance_notify: boolean;
    enable_login_notify: boolean;
    enable_subscribe_notify: boolean;
    enable_trade_notify: boolean;
    gift_amount: number;
    id: number;
    is_admin: boolean;
    only_first_purchase: boolean;
    refer_code: string;
    referer_id: number;
    referral_percentage: number;
    rules: string[];
    telegram: number;
    updated_at: number;
    user_devices: UserDevice[];
  };

  type UserAuthMethod = {
    auth_identifier: string;
    auth_type: string;
    verified: boolean;
  };

  type UserDevice = {
    created_at: number;
    enabled: boolean;
    id: number;
    identifier: string;
    ip: string;
    online: boolean;
    updated_at: number;
    user_agent: string;
  };

  type UserLoginLog = {
    actor_id: number;
    id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    login_ip: string;
    success: boolean;
    timestamp: number;
    user_agent: string;
    user_id: number;
  };

  type UserStatistics = {
    date: string;
    list: UserStatistics[];
    new_order_users: number;
    register: number;
    renewal_order_users: number;
  };

  type UserStatisticsResponse = {
    all: UserStatistics;
    monthly: UserStatistics;
    today: UserStatistics;
  };

  type UserSubscribe = {
    created_at: number;
    download: number;
    expire_time: number;
    finished_at: number;
    id: number;
    order_id: number;
    reset_time: number;
    short: string;
    start_time: number;
    status: number;
    subscribe: Subscribe;
    subscribe_id: number;
    token: string;
    traffic: number;
    updated_at: number;
    upload: number;
    user_id: number;
  };

  type UserSubscribeDetail = {
    created_at: number;
    download: number;
    expire_time: number;
    id: number;
    order_id: number;
    reset_time: number;
    start_time: number;
    status: number;
    subscribe: Subscribe;
    subscribe_id: number;
    token: string;
    traffic: number;
    updated_at: number;
    upload: number;
    user: User;
    user_id: number;
  };

  type UserSubscribeLog = {
    actor_id: number;
    id: number;
    ip: string;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    timestamp: number;
    token: string;
    user_agent: string;
    user_id: number;
    user_subscribe_id: number;
  };

  type UserSubscribeTrafficLog = {
    /** Date in YYYY-MM-DD format */
    date: string;
    /** Whether to show detailed traffic */
    details: boolean;
    /** Download traffic in bytes */
    download: number;
    /** Subscribe ID */
    subscribe_id: number;
    /** Total traffic in bytes (Upload + Download) */
    total: number;
    /** Upload traffic in bytes */
    upload: number;
    /** User ID */
    user_id: number;
  };

  type UserTrafficData = {
    download: number;
    /** SID identifies the user_subscribe row the traffic was billed to, UID the
user owning it. UID is carried separately so the console can still name
the user after the subscription row is gone. */
    sid: number;
    uid: number;
    upload: number;
  };

  type VerifyCodeConfig = {
    verify_code_expire_time: number;
    verify_code_interval: number;
    verify_code_limit: number;
  };

  type VerifyConfig = {
    enable_login_verify: boolean;
    enable_register_verify: boolean;
    enable_reset_password_verify: boolean;
    turnstile_secret: string;
    turnstile_site_key: string;
  };

  type VersionResponse = {
    version: string;
  };

  type WithdrawalLog = {
    amount: number;
    content: string;
    created_at: number;
    id: number;
    reason: string;
    status: number;
    updated_at: number;
    user_id: number;
  };
}
