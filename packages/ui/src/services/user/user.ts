// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get pan-domain subscription configuration GET / */
export async function get(options?: { [key: string]: any }) {
  return request<string>(`${import.meta.env.VITE_API_PREFIX || ""}/`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Query announcement GET /v1/public/announcement/list */
export async function getV1PublicAnnouncementList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicAnnouncementListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryAnnouncementResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/announcement/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get document detail GET /v1/public/document/detail */
export async function getV1PublicDocumentDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicDocumentDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Document }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/document/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get document list GET /v1/public/document/list */
export async function getV1PublicDocumentList(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryDocumentListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/document/list`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Close order POST /v1/public/order/close */
export async function postV1PublicOrderClose(
  body: API.CloseOrderRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/close`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get order GET /v1/public/order/detail */
export async function getV1PublicOrderDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicOrderDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.OrderDetail }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get order list GET /v1/public/order/list */
export async function getV1PublicOrderList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicOrderListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryOrderListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Pre create order POST /v1/public/order/pre */
export async function postV1PublicOrderPre(
  body: API.PurchaseOrderRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.PreOrderResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/pre`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** purchase Subscription POST /v1/public/order/purchase */
export async function postV1PublicOrderPurchase(
  body: API.PurchaseOrderRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.PurchaseOrderResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Recharge POST /v1/public/order/recharge */
export async function postV1PublicOrderRecharge(
  body: API.RechargeOrderRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.RechargeOrderResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/recharge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Renewal Subscription POST /v1/public/order/renewal */
export async function postV1PublicOrderRenewal(
  body: API.RenewalOrderRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.RenewalOrderResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/renewal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Reset traffic POST /v1/public/order/reset */
export async function postV1PublicOrderReset(
  body: API.ResetTrafficOrderRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.ResetTrafficOrderResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/order/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Get available payment methods GET /v1/public/payment/methods */
export async function getV1PublicPaymentMethods(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetAvailablePaymentMethodsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/payment/methods`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Purchase Checkout POST /v1/public/portal/order/checkout */
export async function postV1PublicPortalOrderCheckout(
  body: API.CheckoutOrderRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.CheckoutOrderResponse }
  >(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/portal/order/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Query Purchase Order GET /v1/public/portal/order/status */
export async function getV1PublicPortalOrderStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicPortalOrderStatusParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryPurchaseOrderResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/portal/order/status`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get available payment methods GET /v1/public/portal/payment-method */
export async function getV1PublicPortalPaymentMethod(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetAvailablePaymentMethodsResponse }
  >(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/portal/payment-method`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Pre Purchase Order POST /v1/public/portal/pre */
export async function postV1PublicPortalPre(
  body: API.PrePurchaseOrderRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.PrePurchaseOrderResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/portal/pre`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Purchase subscription POST /v1/public/portal/purchase */
export async function postV1PublicPortalPurchase(
  body: API.PortalPurchaseRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.PortalPurchaseResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/portal/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Get Subscription GET /v1/public/portal/subscribe */
export async function getV1PublicPortalSubscribe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicPortalSubscribeParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetSubscriptionResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/portal/subscribe`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get subscribe list GET /v1/public/subscribe/list */
export async function getV1PublicSubscribeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicSubscribeListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QuerySubscribeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get user subscribe node info GET /v1/public/subscribe/node/list */
export async function getV1PublicSubscribeNodeList(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryUserSubscribeNodeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe/node/list`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Update ticket status PUT /v1/public/ticket/ */
export async function putV1PublicTicket(
  body: API.UpdateUserTicketStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/ticket/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Create ticket POST /v1/public/ticket/ */
export async function postV1PublicTicket(
  body: API.CreateUserTicketRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/ticket/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get ticket detail GET /v1/public/ticket/detail */
export async function getV1PublicTicketDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicTicketDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Ticket }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/ticket/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create ticket follow POST /v1/public/ticket/follow */
export async function postV1PublicTicketFollow(
  body: API.CreateUserTicketFollowRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/ticket/follow`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get ticket list GET /v1/public/ticket/list */
export async function getV1PublicTicketList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicTicketListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserTicketListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/ticket/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query User Affiliate Count GET /v1/public/user/affiliate/count */
export async function getV1PublicUserAffiliateCount(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryUserAffiliateCountResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/affiliate/count`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Query User Affiliate List GET /v1/public/user/affiliate/list */
export async function getV1PublicUserAffiliateList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicUserAffiliateListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryUserAffiliateListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/affiliate/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query User Balance Log GET /v1/public/user/balance_log */
export async function getV1PublicUserBalanceLog(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryUserBalanceLogListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/balance_log`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Update Bind Email PUT /v1/public/user/bind_email */
export async function putV1PublicUserBindEmail(
  body: API.UpdateBindEmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/bind_email`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Update Bind Mobile PUT /v1/public/user/bind_mobile */
export async function putV1PublicUserBindMobile(
  body: API.UpdateBindMobileRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/bind_mobile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Bind OAuth POST /v1/public/user/bind_oauth */
export async function postV1PublicUserBindOauth(
  body: API.BindOAuthRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.BindOAuthResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/bind_oauth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Bind OAuth Callback POST /v1/public/user/bind_oauth/callback */
export async function postV1PublicUserBindOauthCallback(
  body: API.BindOAuthCallbackRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/public/user/bind_oauth/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Bind Telegram GET /v1/public/user/bind_telegram */
export async function getV1PublicUserBindTelegram(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.BindTelegramResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/bind_telegram`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query User Commission Log GET /v1/public/user/commission_log */
export async function getV1PublicUserCommissionLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicUserCommissionLogParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryUserCommissionLogListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/commission_log`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Commission Withdraw POST /v1/public/user/commission_withdraw */
export async function postV1PublicUserCommissionWithdraw(
  body: API.CommissionWithdrawRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.WithdrawalLog }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/public/user/commission_withdraw`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get Device List GET /v1/public/user/devices */
export async function getV1PublicUserDevices(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetDeviceListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/devices`, {
    method: "GET",
    ...(options || {}),
  });
}

/** returns the current user profile. GET /v1/public/user/info */
export async function getV1PublicUserInfo(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.User }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/info`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get Login Log GET /v1/public/user/login_log */
export async function getV1PublicUserLoginLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicUserLoginLogParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.GetLoginLogResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/login_log`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update User Notify PUT /v1/public/user/notify */
export async function putV1PublicUserNotify(
  body: API.UpdateUserNotifyRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/notify`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get OAuth Methods GET /v1/public/user/oauth_methods */
export async function getV1PublicUserOauthMethods(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetOAuthMethodsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/oauth_methods`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Update User Password PUT /v1/public/user/password */
export async function putV1PublicUserPassword(
  body: API.UpdateUserPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Update User Rules PUT /v1/public/user/rules */
export async function putV1PublicUserRules(
  body: API.UpdateUserRulesRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/rules`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Query User Subscribe GET /v1/public/user/subscribe */
export async function getV1PublicUserSubscribe(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryUserSubscribeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/subscribe`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Get Subscribe Log GET /v1/public/user/subscribe_log */
export async function getV1PublicUserSubscribeLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicUserSubscribeLogParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetSubscribeLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/subscribe_log`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update User Subscribe Note PUT /v1/public/user/subscribe_note */
export async function putV1PublicUserSubscribeNote(
  body: API.UpdateUserSubscribeNoteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/subscribe_note`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Reset User Subscribe Token PUT /v1/public/user/subscribe_token */
export async function putV1PublicUserSubscribeToken(
  body: API.ResetUserSubscribeTokenRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/subscribe_token`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Unbind Device PUT /v1/public/user/unbind_device */
export async function putV1PublicUserUnbindDevice(
  body: API.UnbindDeviceRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/unbind_device`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Unbind OAuth POST /v1/public/user/unbind_oauth */
export async function postV1PublicUserUnbindOauth(
  body: API.UnbindOAuthRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/unbind_oauth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Unbind Telegram POST /v1/public/user/unbind_telegram */
export async function postV1PublicUserUnbindTelegram(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/unbind_telegram`,
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** Unsubscribe POST /v1/public/user/unsubscribe */
export async function postV1PublicUserUnsubscribe(
  body: API.UnsubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/unsubscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Pre Unsubscribe POST /v1/public/user/unsubscribe/pre */
export async function postV1PublicUserUnsubscribePre(
  body: API.PreUnsubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.PreUnsubscribeResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/unsubscribe/pre`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Verify Email POST /v1/public/user/verify_email */
export async function postV1PublicUserVerifyEmail(
  body: API.VerifyEmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/verify_email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Query Withdrawal Log GET /v1/public/user/withdrawal_log */
export async function getV1PublicUserWithdrawalLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1PublicUserWithdrawalLogParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryWithdrawalLogListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/withdrawal_log`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get subscription configuration GET /v1/subscribe/config */
export async function getV1SubscribeConfig(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV1SubscribeConfigParams,
  options?: { [key: string]: any }
) {
  return request<string>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/subscribe/config`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create an order and initiate checkout POST /v2/public/orders */
export async function postV2PublicOrders(
  body: API.V2CreateOrderRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.V2OrderResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v2/public/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get a V2 order state snapshot GET /v2/public/orders/${param0} */
export async function getV2PublicOrdersOrderNo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV2PublicOrdersOrderNoParams,
  options?: { [key: string]: any }
) {
  const { orderNo: param0, ...queryParams } = params;
  return request<API.ResponseSuccessBean & { data?: API.V2OrderResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v2/public/orders/${param0}`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** Re-initiate checkout for a pending V2 order POST /v2/public/orders/${param0}/checkout */
export async function postV2PublicOrdersOrderNoCheckout(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postV2PublicOrdersOrderNoCheckoutParams,
  body: API.V2CheckoutOrderRequest,
  options?: { [key: string]: any }
) {
  const { orderNo: param0, ...queryParams } = params;
  return request<API.ResponseSuccessBean & { data?: API.V2OrderResponse }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v2/public/orders/${param0}/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** Refresh a V2 order event stream ticket POST /v2/public/orders/${param0}/event-ticket */
export async function postV2PublicOrdersOrderNoEventTicket(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postV2PublicOrdersOrderNoEventTicketParams,
  body: API.V2EventTicketRequest,
  options?: { [key: string]: any }
) {
  const { orderNo: param0, ...queryParams } = params;
  return request<
    API.ResponseSuccessBean & { data?: API.V2EventTicketResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v2/public/orders/${param0}/event-ticket`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** Stream V2 order events GET /v2/public/orders/${param0}/events */
export async function getV2PublicOrdersOrderNoEvents(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getV2PublicOrdersOrderNoEventsParams,
  options?: { [key: string]: any }
) {
  const { orderNo: param0, ...queryParams } = params;
  return request<string>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v2/public/orders/${param0}/events`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** Exchange a guest checkout capability for a V2 user session POST /v2/public/orders/${param0}/session */
export async function postV2PublicOrdersOrderNoSession(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postV2PublicOrdersOrderNoSessionParams,
  body: API.V2OrderSessionRequest,
  options?: { [key: string]: any }
) {
  const { orderNo: param0, ...queryParams } = params;
  return request<
    API.ResponseSuccessBean & { data?: API.V2OrderSessionResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v2/public/orders/${param0}/session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}
