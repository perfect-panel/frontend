declare namespace API {
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

  type BindOAuthCallbackRequest = {
    callback: any;
    method: "google" | "apple" | "telegram" | "github";
  };

  type BindOAuthRequest = {
    method: "google" | "apple" | "telegram" | "github";
    redirect: string;
  };

  type BindOAuthResponse = {
    redirect: string;
  };

  type BindTelegramResponse = {
    expired_at: number;
    url: string;
  };

  type CheckoutOrderRequest = {
    checkout_token?: string;
    orderNo?: string;
    returnUrl?: string;
  };

  type CheckoutOrderResponse = {
    checkout_url: string;
    stripe: StripePayment;
    /** Type is url, qr, stripe, or balance. */
    type: "url" | "qr" | "stripe" | "balance";
  };

  type CloseOrderRequest = {
    orderNo: string;
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

  type CommissionWithdrawRequest = {
    amount: number;
    content: string;
  };

  type CreateUserTicketFollowRequest = {
    content?: string;
    from?: string;
    ticket_id?: number;
    type?: number;
  };

  type CreateUserTicketRequest = {
    description?: string;
    title?: string;
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

  type Follow = {
    content: string;
    created_at: number;
    from: string;
    id: number;
    ticket_id: number;
    type: number;
  };

  type GetAvailablePaymentMethodsResponse = {
    list: PaymentMethod[];
  };

  type GetDeviceListResponse = {
    list: UserDevice[];
    total: number;
  };

  type GetLoginLogResponse = {
    list: UserLoginLog[];
    total: number;
  };

  type GetOAuthMethodsResponse = {
    methods: UserAuthMethod[];
  };

  type GetSubscribeLogResponse = {
    list: UserSubscribeLog[];
    total: number;
  };

  type GetSubscriptionResponse = {
    list: Subscribe[];
  };

  type GetUserTicketListResponse = {
    list: Ticket[];
    total: number;
  };

  type getV1PublicAnnouncementListParams = {
    page: number;
    pinned?: boolean;
    popup?: boolean;
    size: number;
  };

  type getV1PublicDocumentDetailParams = {
    id: number;
  };

  type getV1PublicOrderDetailParams = {
    order_no: string;
  };

  type getV1PublicOrderListParams = {
    page: number;
    size: number;
  };

  type getV1PublicPortalOrderStatusParams = {
    checkout_token?: string;
    order_no: string;
  };

  type getV1PublicPortalSubscribeParams = {
    language?: string;
  };

  type getV1PublicSubscribeListParams = {
    language?: string;
  };

  type getV1PublicTicketDetailParams = {
    id: number;
  };

  type getV1PublicTicketListParams = {
    page: number;
    search?: string;
    size: number;
    status?: number;
  };

  type getV1PublicUserAffiliateListParams = {
    page: number;
    size: number;
  };

  type getV1PublicUserCommissionLogParams = {
    page: number;
    size: number;
  };

  type getV1PublicUserLoginLogParams = {
    page: number;
    size: number;
  };

  type getV1PublicUserSubscribeLogParams = {
    page: number;
    size: number;
  };

  type getV1PublicUserWithdrawalLogParams = {
    page: number;
    size: number;
  };

  type getV1SubscribeConfigParams = {
    /** Subscription token; alternatively send the token header */
    token?: string;
    /** Subscription format flag */
    flag?: string;
    /** Subscription format type */
    type?: string;
  };

  type getV2PublicOrdersOrderNoEventsParams = {
    /** Order number */
    orderNo: string;
    /** Short-lived order event ticket */
    ticket: string;
    /** Replay cursor when Last-Event-ID is unavailable */
    after?: string;
  };

  type getV2PublicOrdersOrderNoParams = {
    /** Order number */
    orderNo: string;
    /** Guest checkout capability */
    checkout_token?: string;
  };

  type OrderDetail = {
    amount: number;
    commission: number;
    coupon: string;
    coupon_discount: number;
    created_at: number;
    discount: number;
    fee_amount: number;
    gift_amount: number;
    id: number;
    method: string;
    order_no: string;
    payment: PaymentMethod;
    price: number;
    quantity: number;
    status: number;
    subscribe: Subscribe;
    subscribe_id: number;
    trade_no: string;
    type: number;
    updated_at: number;
    user_id: number;
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

  type PortalPurchaseRequest = {
    auth_type: string;
    coupon?: string;
    identifier: string;
    invite_code?: string;
    password: string;
    payment: number;
    quantity: number;
    subscribe_id: number;
    turnstile_token?: string;
  };

  type PortalPurchaseResponse = {
    checkout_token: string;
    order_no: string;
  };

  type postV2PublicOrdersOrderNoCheckoutParams = {
    /** Order number */
    orderNo: string;
  };

  type postV2PublicOrdersOrderNoEventTicketParams = {
    /** Order number */
    orderNo: string;
  };

  type postV2PublicOrdersOrderNoSessionParams = {
    /** Order number */
    orderNo: string;
  };

  type PreOrderResponse = {
    amount: number;
    coupon: string;
    coupon_discount: number;
    discount: number;
    fee_amount: number;
    gift_amount: number;
    price: number;
  };

  type PrePurchaseOrderRequest = {
    coupon?: string;
    payment?: number;
    quantity: number;
    subscribe_id: number;
  };

  type PrePurchaseOrderResponse = {
    amount: number;
    coupon: string;
    coupon_discount: number;
    discount: number;
    fee_amount: number;
    price: number;
  };

  type PreUnsubscribeRequest = {
    id?: number;
  };

  type PreUnsubscribeResponse = {
    deduction_amount: number;
  };

  type PurchaseOrderRequest = {
    coupon?: string;
    payment?: number;
    quantity: number;
    subscribe_id?: number;
    user_subscribe_id?: number;
  };

  type PurchaseOrderResponse = {
    order_no: string;
  };

  type QueryAnnouncementResponse = {
    announcements: Announcement[];
    total: number;
  };

  type QueryDocumentListResponse = {
    list: Document[];
    total: number;
  };

  type QueryOrderListResponse = {
    list: OrderDetail[];
    total: number;
  };

  type QueryPurchaseOrderResponse = {
    amount: number;
    coupon: string;
    coupon_discount: number;
    created_at: number;
    discount: number;
    fee_amount: number;
    order_no: string;
    payment: PaymentMethod;
    price: number;
    quantity: number;
    status: number;
    subscribe: Subscribe;
    token: string;
  };

  type QuerySubscribeListResponse = {
    list: Subscribe[];
    total: number;
  };

  type QueryUserAffiliateCountResponse = {
    registers: number;
    total_commission: number;
  };

  type QueryUserAffiliateListResponse = {
    list: UserAffiliate[];
    total: number;
  };

  type QueryUserBalanceLogListResponse = {
    list: BalanceLog[];
    total: number;
  };

  type QueryUserCommissionLogListResponse = {
    list: CommissionLog[];
    total: number;
  };

  type QueryUserSubscribeListResponse = {
    list: UserSubscribe[];
    total: number;
  };

  type QueryUserSubscribeNodeListResponse = {
    list: UserSubscribeInfo[];
  };

  type QueryWithdrawalLogListResponse = {
    list: WithdrawalLog[];
    total: number;
  };

  type RechargeOrderRequest = {
    amount: number;
    payment?: number;
  };

  type RechargeOrderResponse = {
    order_no: string;
  };

  type RenewalOrderRequest = {
    coupon?: string;
    payment?: number;
    quantity?: number;
    user_subscribe_id?: number;
  };

  type RenewalOrderResponse = {
    order_no: string;
  };

  type ResetTrafficOrderRequest = {
    payment?: number;
    user_subscribe_id?: number;
  };

  type ResetTrafficOrderResponse = {
    order_no: string;
  };

  type ResetUserSubscribeTokenRequest = {
    user_subscribe_id?: number;
  };

  type ResponseErrorBean = {
    code: number;
    msg: string;
  };

  type ResponseSuccessBean = {
    code: number;
    msg: string;
  };

  type StripePayment = {
    client_secret: string;
    method: string;
    publishable_key: string;
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

  type SubscribeDiscount = {
    discount: number;
    quantity: number;
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

  type UnbindDeviceRequest = {
    id: number;
  };

  type UnbindOAuthRequest = {
    method?: string;
  };

  type UnsubscribeRequest = {
    id?: number;
  };

  type UpdateBindEmailRequest = {
    email: string;
  };

  type UpdateBindMobileRequest = {
    area_code: string;
    code: string;
    mobile: string;
  };

  type UpdateUserNotifyRequest = {
    enable_balance_notify?: boolean;
    enable_login_notify?: boolean;
    enable_subscribe_notify?: boolean;
    enable_trade_notify?: boolean;
  };

  type UpdateUserPasswordRequest = {
    password: string;
  };

  type UpdateUserRulesRequest = {
    rules: string[];
  };

  type UpdateUserSubscribeNoteRequest = {
    note?: string;
    user_subscribe_id: number;
  };

  type UpdateUserTicketStatusRequest = {
    id: number;
    status: number;
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

  type UserAffiliate = {
    avatar: string;
    enable: boolean;
    identifier: string;
    registered_at: number;
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

  type UserSubscribeInfo = {
    created_at: number;
    download: number;
    expire_time: number;
    finished_at: number;
    id: number;
    is_try_out: boolean;
    nodes: UserSubscribeNodeInfo[];
    order_id: number;
    reset_time: number;
    start_time: number;
    status: number;
    subscribe_id: number;
    token: string;
    traffic: number;
    updated_at: number;
    upload: number;
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

  type UserSubscribeNodeInfo = {
    address: string;
    city: string;
    country: string;
    created_at: number;
    id: number;
    name: string;
    port: number;
    protocol: string;
    tags: string[];
    uuid: string;
  };

  type V2CheckoutOrderRequest = {
    checkout_token?: string;
    return_url?: string;
  };

  type V2CreateOrderRequest = {
    amount?: number;
    coupon?: string;
    guest?: V2GuestOrderRequest;
    payment_id?: number;
    quantity?: number;
    return_url?: string;
    subscribe_id?: number;
    type?: string;
    user_subscribe_id?: number;
  };

  type V2EventTicketRequest = {
    checkout_token?: string;
  };

  type V2EventTicketResponse = {
    ticket_expires_at: number;
    url: string;
  };

  type V2GuestOrderRequest = {
    auth_type?: string;
    identifier?: string;
    invite_code?: string;
    password?: string;
  };

  type V2OrderEvents = {
    ticket_expires_at: number;
    url: string;
  };

  type V2OrderPayment = {
    checkout_url: string;
    payment_status: string;
    stripe: StripePayment;
    /** Type is url, qr, stripe, or balance. */
    type: "url" | "qr" | "stripe" | "balance";
  };

  type V2OrderResponse = {
    checkout_token: string;
    events: V2OrderEvents;
    order: V2OrderSnapshot;
    payment: V2OrderPayment;
  };

  type V2OrderSessionRequest = {
    checkout_token?: string;
  };

  type V2OrderSessionResponse = {
    access_token: string;
  };

  type V2OrderSnapshot = {
    amount: number;
    currency: string;
    expires_at: number;
    fulfillment_status: string;
    order_no: string;
    payment_status: string;
    state_version: number;
    status: string;
  };

  type VerifyEmailRequest = {
    code: string;
    email: string;
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
