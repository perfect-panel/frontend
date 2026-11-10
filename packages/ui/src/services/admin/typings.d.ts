declare namespace API {
  type AdminActionLog = {
    action: string;
    client_ip: string;
    created_at: number;
    detail: string;
    id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    object: string;
    object_id: number;
    source: string;
    telegram_sender_id: number;
    timestamp: number;
    user_agent: string;
    user_id: number;
  };

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
    recipient_count: number;
    /** Recipients lists the first recorded recipients, one per line, and
says how many more there are; RecipientCount is the whole audience,
the additional addresses included. */
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
    /** TradeNo is refused when set: the gateway assigns it when the order is
paid, and Stripe and Cryptomus read it as their own payment identifier. */
    trade_no?: string;
    type: 1 | 2 | 3 | 4;
    user_id: number;
    /** UserSubscribeId is the user subscription a renewal (type 2) or traffic
reset (type 3) order applies to; required for those types. */
    user_subscribe_id?: number;
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
    type: 1 | 2;
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

  type FilterAdminActionLogResponse = {
    list: AdminActionLog[];
    total: number;
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

  type FilterUnmatchedPaymentLogResponse = {
    list: UnmatchedPaymentLog[];
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

  type getLogAdminListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    /** UserId narrows the trail to one administrator. */
    user_id?: number;
  };

  type getLogBalanceListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
  };

  type getLogCommissionListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
  };

  type getLogEmailListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
  };

  type getLogGiftListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
  };

  type getLogLoginListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
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
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
  };

  type getLogOrderListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
  };

  type getLogPaymentUnmatchedListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    /** UserId narrows the list to one payer. */
    user_id?: number;
  };

  type getLogRegisterListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
  };

  type getLogServerTrafficListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    server_id?: number;
    size: number;
    start_date?: string;
  };

  type getLogSubscribeListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
    user_subscribe_id?: number;
  };

  type getLogSubscribeResetListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_subscribe_id?: number;
  };

  type getLogSubscribeTrafficListParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    size: number;
    start_date?: string;
    user_id?: number;
    user_subscribe_id?: number;
  };

  type getLogTrafficDetailsParams = {
    date?: string;
    end_date?: string;
    page: number;
    search?: string;
    server_id?: number;
    size: number;
    start_date?: string;
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
    /** UserSubscribeId is the user subscription a renewal or traffic reset
order applies to; zero for other orders and for orders created before
it was recorded. */
    user_subscribe_id: number;
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
    /** The rendered template preview */
    template: string;
  };

  type PrivacyPolicyConfig = {
    privacy_policy: string;
  };

  type Protocol = {
    /** Listener compatibility: whether to accept the PROXY protocol; node inbounds do not all enable it yet. */
    accept_proxy_protocol: boolean;
    /** TLS client compatibility: allows skipping certificate verification; inbound configurations usually ignore it, and it is not a server certificate setting. */
    allow_insecure: boolean;
    /** TLS/HTTP/QUIC protocols: the TLS ALPN list; Nowhere requires exactly nw3. */
    alpn: string[];
    /** TLS protocols: the environment variables (credentials) passed to the DNS provider with cert_mode=dns. */
    cert_dns_env: string;
    /** TLS protocols: the DNS provider used with cert_mode=dns. */
    cert_dns_provider: string;
    /** TLS protocols: the certificate source, file, self, http or dns; none configures no certificate. */
    cert_mode: string;
    /** Shadowsocks/SSR: the Shadowsocks method or the SSR cipher. */
    cipher: string;
    /** QUIC protocols: TUIC's congestion control field, and the legacy alias of Naive's. */
    congestion_controller: string;
    /** TLS client compatibility: disables SNI; server inbounds currently ignore it. */
    disable_sni: boolean;
    /** Hysteria2 only: the server's download bandwidth in Mbps. */
    down_mbps: number;
    /** Subscription clients: whether Encrypted ClientHello is enabled; left out of the configuration distributed to the nodes. */
    ech_enable: boolean;
    /** Subscription clients: the outer ECH server name; left out of the configuration distributed to the nodes. */
    ech_server_name: string;
    /** Common: whether the inbound protocol is enabled. */
    enable: boolean;
    /** VLESS Encryption only: the cipher suite, such as none or mlkem768x25519plus. */
    encryption: string;
    /** VLESS Encryption client information: the padding rules of the client direction, for the subscription output. */
    encryption_client_padding: string;
    /** VLESS Encryption only: the key encapsulation mode, such as native, xorpub or random. */
    encryption_mode: string;
    /** VLESS Encryption client information: the 1-RTT (derived) authentication password, for the subscription output. */
    encryption_password: string;
    /** VLESS Encryption, server side only: the ML-KEM/X25519 private key material. */
    encryption_private_key: string;
    /** VLESS Encryption only: the handshake round-trip mode, 0rtt or 1rtt. */
    encryption_rtt: string;
    /** VLESS Encryption, server side only: the padding rules of the server direction. */
    encryption_server_padding: string;
    /** VLESS Encryption, server side only: the 0-RTT ticket. */
    encryption_ticket: string;
    /** TLS client compatibility: the uTLS fingerprint; node inbounds currently ignore it, it is kept only for outbound and legacy configurations. */
    fingerprint: string;
    /** VLESS only: the XTLS Vision flow control; xtls-rprx-vision is currently the only valid value. */
    flow: string;
    /** TUIC only: the connection heartbeat interval in seconds; 0 uses the node's default. */
    heartbeat: number;
    /** Hysteria2/TUIC-style QUIC protocols: the port hopping interval; node inbounds do not enable port hopping yet. */
    hop_interval: number;
    /** Hysteria2/TUIC-style QUIC protocols: the port hopping range; node inbounds do not enable port hopping yet. */
    hop_ports: string;
    /** VLESS/VMess/Trojan transport: the Host of WebSocket, HTTPUpgrade or XHTTP. */
    host: string;
    /** Snell only: the Snell v6 mode; other protocols leave it unset. */
    mode: string;
    /** Protocol-independent capability: the multiplexing level (off, low, medium or high), for the stream protocols that support mux. */
    multiplex: string;
    /** Listening network: tcp, udp or both; Nowhere normalizes it to mix, tcp or udp, and the other protocols check it against what each supports. */
    network: string;
    /** Obfuscating protocols: Hysteria2's Salamander, Snell v5's obfs, SSR's obfs method, or Nowhere's morph (default) / none. */
    obfs: string;
    /** Legacy obfuscation compatibility: the obfuscation Host; node inbounds currently ignore it, and Shadowsocks plugins take plugin_opts instead. */
    obfs_host: string;
    /** SSR only: the SSR obfs_param. */
    obfs_param: string;
    /** Hysteria2 only: the Salamander obfuscation password, used only with obfs=salamander. */
    obfs_password: string;
    /** Legacy obfuscation compatibility: the obfuscation request path; node inbounds currently ignore it, and Shadowsocks plugins take plugin_opts instead. */
    obfs_path: string;
    /** AnyTLS only: the TLS record padding scheme. */
    padding_scheme: string;
    /** VLESS/VMess/Trojan transport: the request path of WebSocket, HTTPUpgrade or XHTTP. */
    path: string;
    /** Shadowsocks (AEAD/2022) only: the inbound plugin, such as obfs, v2ray-plugin, shadow-tls or restls. */
    plugin: string;
    /** Shadowsocks (AEAD/2022) only: the structured options of the selected inbound plugin. */
    plugin_opts: any;
    /** Common: the inbound listening port. */
    port: number;
    /** SSR only: the SSR protocol method, under the JSON name protocol, which is not the top-level type. */
    protocol: string;
    /** SSR only: the SSR protocol_param. */
    protocol_param: string;
    /** QUIC protocols: Naive's congestion control field, and the compatibility alias of TUIC's. */
    quic_congestion_control: string;
    /** Panel: the traffic billing ratio, 1 by default; not part of the protocol handshake. */
    ratio: number;
    /** VLESS/VMess REALITY, server side only: the server's X25519 private key. */
    reality_private_key: string;
    /** VLESS/VMess REALITY client information: the public key of the private key, mainly for the subscription output. */
    reality_public_key: string;
    /** VLESS/VMess REALITY only: the address the REALITY handshake is forwarded to. */
    reality_server_addr: string;
    /** VLESS/VMess REALITY only: the port the REALITY handshake is forwarded to. */
    reality_server_port: number;
    /** VLESS/VMess REALITY only: the short ID clients may use. */
    reality_short_id: string;
    /** TUIC only: enables QUIC 0-RTT to save round trips on the first handshake. */
    reduce_rtt: boolean;
    /** TLS/REALITY protocols: none, tls or reality; each protocol limits the values it accepts. */
    security: string;
    /** Key-based protocols: the Shadowsocks 2022 server key, the SSR password or the Snell PSK. */
    server_key: string;
    /** VLESS/VMess/Trojan gRPC transport only: the gRPC service name. */
    service_name: string;
    /** TLS protocols: the certificate domain and the TLS server name; REALITY also uses it as the server name. */
    sni: string;
    /** Mieru only: the traffic pattern (packet length distribution) settings. */
    traffic_pattern: string;
    /** VLESS/VMess/Trojan transport: tcp, ws, httpupgrade, grpc or xhttp. */
    transport: string;
    /** Common: the protocol type, such as shadowsocks, vless, vmess, hysteria2, tuic or nowhere. */
    type: string;
    /** TUIC/Hysteria compatibility: the UDP relay mode of the former implementation; node inbounds currently ignore it. */
    udp_relay_mode: string;
    /** Protocol-independent capability: UDP over TCP, for every protocol that supports UoT rather than one in particular. */
    uot: boolean;
    /** Protocol-independent capability: the UoT version, currently 1 or 2; 0 means the default version. */
    uot_version: number;
    /** Hysteria2 only: the server's upload bandwidth in Mbps. */
    up_mbps: number;
    /** Mieru only: whether clients must send a user hint that identifies the user. */
    user_hint_is_mandatory: boolean;
    /** Version: Snell accepts 5 or 6, TUIC 5 and Nowhere 3; 0 means the protocol's default. */
    version: number;
    /** VLESS/VMess/Trojan XHTTP transport only: the XHTTP extra path and parameters. */
    xhttp_extra: string;
    /** VLESS/VMess/Trojan XHTTP transport only: the XHTTP mode, such as auto, packet-up or stream-up. */
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

  type UnmatchedPaymentLog = {
    actor_id: number;
    amount: number;
    client_ip: string;
    created_at: number;
    currency: string;
    id: number;
    ip_as_organization: string;
    ip_asn: number;
    ip_city: string;
    ip_country: string;
    ip_country_code: string;
    ip_region: string;
    order_no: string;
    platform: string;
    reason: string;
    timestamp: number;
    trade_no: string;
    user_agent: string;
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
    /** Balance, Commission and GiftAmount are wallet amounts to set; one
left out of the request leaves that amount as it is, so a client
sending only what the administrator edited cannot revert the money
movements made since the form was loaded. */
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
    entitlement_source: string;
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
    entitlement_source: string;
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
