// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Update Ads PUT /v1/admin/ads/ */
export async function putAds(
  body: API.UpdateAdsRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ads/`,
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

/** Create Ads POST /v1/admin/ads/ */
export async function postAds(
  body: API.CreateAdsRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ads/`,
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

/** Delete Ads DELETE /v1/admin/ads/ */
export async function deleteAds(
  body: API.DeleteAdsRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ads/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get Ads Detail GET /v1/admin/ads/detail */
export async function getAdsDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdsDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Ads }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ads/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get Ads List GET /v1/admin/ads/list */
export async function getAdsList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdsListParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.GetAdsListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ads/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update announcement PUT /v1/admin/announcement/ */
export async function putAnnouncement(
  body: API.UpdateAnnouncementRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/announcement/`,
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

/** Create announcement POST /v1/admin/announcement/ */
export async function postAnnouncement(
  body: API.CreateAnnouncementRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/announcement/`,
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

/** Delete announcement DELETE /v1/admin/announcement/ */
export async function deleteAnnouncement(
  body: API.DeleteAnnouncementRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/announcement/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get announcement GET /v1/admin/announcement/detail */
export async function getAnnouncementDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAnnouncementDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Announcement }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/announcement/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get announcement list GET /v1/admin/announcement/list */
export async function getAnnouncementList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAnnouncementListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetAnnouncementListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/announcement/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Create subscribe application POST /v1/admin/application/ */
export async function postApplication(
  body: API.CreateSubscribeApplicationRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.SubscribeApplication }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/application/`,
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

/** Preview Template GET /v1/admin/application/preview */
export async function getApplicationPreview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApplicationPreviewParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.PreviewSubscribeTemplateResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/application/preview`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update subscribe application PUT /v1/admin/application/subscribe_application */
export async function putApplicationSubscribeApplication(
  body: API.UpdateSubscribeApplicationRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.SubscribeApplication }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/application/subscribe_application`,
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

/** Delete subscribe application DELETE /v1/admin/application/subscribe_application */
export async function deleteApplicationSubscribeApplication(
  body: API.DeleteSubscribeApplicationRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/application/subscribe_application`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get subscribe application list GET /v1/admin/application/subscribe_application_list */
export async function getApplicationSubscribeApplicationList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApplicationSubscribeApplicationListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetSubscribeApplicationListResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/application/subscribe_application_list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get auth method config GET /v1/admin/auth-method/config */
export async function getAuthMethodConfig(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuthMethodConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.AuthMethodConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/auth-method/config`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update auth method config PUT /v1/admin/auth-method/config */
export async function putAuthMethodConfig(
  body: API.UpdateAuthMethodConfigRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.AuthMethodConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/auth-method/config`,
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

/** Get email support platform GET /v1/admin/auth-method/email_platform */
export async function getAuthMethodEmailPlatform(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.PlatformResponse }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/auth-method/email_platform`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get auth method list GET /v1/admin/auth-method/list */
export async function getAuthMethodList(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetAuthMethodListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/auth-method/list`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Get sms support platform GET /v1/admin/auth-method/sms_platform */
export async function getAuthMethodSmsPlatform(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.PlatformResponse }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/auth-method/sms_platform`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Test email send POST /v1/admin/auth-method/test_email_send */
export async function postAuthMethodTestEmailSend(
  body: API.TestEmailSendRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/auth-method/test_email_send`,
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

/** Test sms send POST /v1/admin/auth-method/test_sms_send */
export async function postAuthMethodTestSmsSend(
  body: API.TestSmsSendRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/auth-method/test_sms_send`,
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

/** Query revenue statistics GET /v1/admin/console/revenue */
export async function getConsoleRevenue(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.RevenueStatisticsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/console/revenue`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Query server total data GET /v1/admin/console/server */
export async function getConsoleServer(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.ServerTotalDataResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/console/server`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Query ticket wait reply GET /v1/admin/console/ticket */
export async function getConsoleTicket(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.TicketWaitRelpyResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/console/ticket`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Query user statistics GET /v1/admin/console/user */
export async function getConsoleUser(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.UserStatisticsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/console/user`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Update coupon PUT /v1/admin/coupon/ */
export async function putCoupon(
  body: API.UpdateCouponRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/coupon/`,
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

/** Create coupon POST /v1/admin/coupon/ */
export async function postCoupon(
  body: API.CreateCouponRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/coupon/`,
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

/** Delete coupon DELETE /v1/admin/coupon/ */
export async function deleteCoupon(
  body: API.DeleteCouponRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/coupon/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Batch delete coupon DELETE /v1/admin/coupon/batch */
export async function deleteCouponBatch(
  body: API.BatchDeleteCouponRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/coupon/batch`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get coupon list GET /v1/admin/coupon/list */
export async function getCouponList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCouponListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetCouponListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/coupon/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update document PUT /v1/admin/document/ */
export async function putDocument(
  body: API.UpdateDocumentRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/document/`,
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

/** Create document POST /v1/admin/document/ */
export async function postDocument(
  body: API.CreateDocumentRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/document/`,
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

/** Delete document DELETE /v1/admin/document/ */
export async function deleteDocument(
  body: API.DeleteDocumentRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/document/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Batch delete document DELETE /v1/admin/document/batch */
export async function deleteDocumentBatch(
  body: API.BatchDeleteDocumentRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/document/batch`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get document detail GET /v1/admin/document/detail */
export async function getDocumentDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDocumentDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Document }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/document/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get document list GET /v1/admin/document/list */
export async function getDocumentList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDocumentListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetDocumentListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/document/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter balance log GET /v1/admin/log/balance/list */
export async function getLogBalanceList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogBalanceListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterBalanceLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/balance/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter commission log GET /v1/admin/log/commission/list */
export async function getLogCommissionList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogCommissionListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterCommissionLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/commission/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter email log GET /v1/admin/log/email/list */
export async function getLogEmailList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogEmailListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterEmailLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/email/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter gift log GET /v1/admin/log/gift/list */
export async function getLogGiftList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogGiftListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterGiftLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/gift/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter login log GET /v1/admin/log/login/list */
export async function getLogLoginList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogLoginListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterLoginLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/login/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get message log list GET /v1/admin/log/message/list */
export async function getLogMessageList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogMessageListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetMessageLogListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/message/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter mobile log GET /v1/admin/log/mobile/list */
export async function getLogMobileList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogMobileListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterMobileLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/mobile/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter order creation logs GET /v1/admin/log/order/list */
export async function getLogOrderList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogOrderListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterOrderLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/order/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter register log GET /v1/admin/log/register/list */
export async function getLogRegisterList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogRegisterListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterRegisterLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/register/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter server traffic log GET /v1/admin/log/server/traffic/list */
export async function getLogServerTrafficList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogServerTrafficListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterServerTrafficLogResponse }
  >(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/server/traffic/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get log setting GET /v1/admin/log/setting */
export async function getLogSetting(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.LogSetting }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/setting`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update log setting POST /v1/admin/log/setting */
export async function postLogSetting(
  body: API.LogSetting,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/setting`,
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

/** Filter subscribe log GET /v1/admin/log/subscribe/list */
export async function getLogSubscribeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogSubscribeListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterSubscribeLogResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/subscribe/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Filter reset subscribe log GET /v1/admin/log/subscribe/reset/list */
export async function getLogSubscribeResetList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogSubscribeResetListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterResetSubscribeLogResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/log/subscribe/reset/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Filter user subscribe traffic log GET /v1/admin/log/subscribe/traffic/list */
export async function getLogSubscribeTrafficList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogSubscribeTrafficListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterSubscribeTrafficResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/log/subscribe/traffic/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Filter traffic log details GET /v1/admin/log/traffic/details */
export async function getLogTrafficDetails(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLogTrafficDetailsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterTrafficLogDetailsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/log/traffic/details`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get batch send email task list GET /v1/admin/marketing/email/batch/list */
export async function getMarketingEmailBatchList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMarketingEmailBatchListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetBatchSendEmailTaskListResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/marketing/email/batch/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get pre-send email count POST /v1/admin/marketing/email/batch/pre-send-count */
export async function postMarketingEmailBatchPreSendCount(
  body: API.GetPreSendEmailCountRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetPreSendEmailCountResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/marketing/email/batch/pre-send-count`,
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

/** Create a batch send email task POST /v1/admin/marketing/email/batch/send */
export async function postMarketingEmailBatchSend(
  body: API.CreateBatchSendEmailTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/marketing/email/batch/send`,
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

/** Get batch send email task status POST /v1/admin/marketing/email/batch/status */
export async function postMarketingEmailBatchStatus(
  body: API.GetBatchSendEmailTaskStatusRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetBatchSendEmailTaskStatusResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/marketing/email/batch/status`,
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

/** Stop a batch send email task POST /v1/admin/marketing/email/batch/stop */
export async function postMarketingEmailBatchStop(
  body: API.StopBatchSendEmailTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/marketing/email/batch/stop`,
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

/** Create a quota task POST /v1/admin/marketing/quota/create */
export async function postMarketingQuotaCreate(
  body: API.CreateQuotaTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/marketing/quota/create`,
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

/** Query quota task list GET /v1/admin/marketing/quota/list */
export async function getMarketingQuotaList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMarketingQuotaListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryQuotaTaskListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/marketing/quota/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query quota task pre-count POST /v1/admin/marketing/quota/pre-count */
export async function postMarketingQuotaPreCount(
  body: API.QueryQuotaTaskPreCountRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryQuotaTaskPreCountResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/marketing/quota/pre-count`,
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

/** Create order POST /v1/admin/order/ */
export async function postOrder(
  body: API.CreateOrderRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/order/`,
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

/** Get order list GET /v1/admin/order/list */
export async function getOrderList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderListParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.GetOrderListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/order/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update order status PUT /v1/admin/order/status */
export async function putOrderStatus(
  body: API.UpdateOrderStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/order/status`,
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

/** Update Payment Method PUT /v1/admin/payment/ */
export async function putPayment(
  body: API.UpdatePaymentMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.PaymentConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/payment/`,
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

/** Create Payment Method POST /v1/admin/payment/ */
export async function postPayment(
  body: API.CreatePaymentMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.PaymentConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/payment/`,
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

/** Delete Payment Method DELETE /v1/admin/payment/ */
export async function deletePayment(
  body: API.DeletePaymentMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/payment/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get Payment Method List GET /v1/admin/payment/list */
export async function getPaymentList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPaymentListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetPaymentMethodListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/payment/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get supported payment platform GET /v1/admin/payment/platform */
export async function getPaymentPlatform(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.PlatformResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/payment/platform`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Create Server POST /v1/admin/server/create */
export async function postServerCreate(
  body: API.CreateServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/create`,
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

/** Delete Server POST /v1/admin/server/delete */
export async function postServerOpenApiDelete(
  body: API.DeleteServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/delete`,
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

/** Filter Server List GET /v1/admin/server/list */
export async function getServerList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServerListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterServerListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Server Node Config GET /v1/admin/server/node_config */
export async function getServerNodeConfig(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServerNodeConfigParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetServerNodeConfigResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node_config`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update Server Node Config POST /v1/admin/server/node_config/update */
export async function postServerNodeConfigUpdate(
  body: API.UpdateServerNodeConfigRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/server/node_config/update`,
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

/** Create Node POST /v1/admin/server/node/create */
export async function postServerNodeCreate(
  body: API.CreateNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/create`,
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

/** Delete Node POST /v1/admin/server/node/delete */
export async function postServerNodeOpenApiDelete(
  body: API.DeleteNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/delete`,
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

/** Filter Node List GET /v1/admin/server/node/list */
export async function getServerNodeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServerNodeListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.FilterNodeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Reset node sort POST /v1/admin/server/node/sort */
export async function postServerNodeSort(
  body: API.ResetSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/sort`,
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

/** Toggle Node Status POST /v1/admin/server/node/status/toggle */
export async function postServerNodeStatusToggle(
  body: API.ToggleNodeStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/server/node/status/toggle`,
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

/** Query all node tags GET /v1/admin/server/node/tags */
export async function getServerNodeTags(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.QueryNodeTagResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/tags`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Node POST /v1/admin/server/node/update */
export async function postServerNodeUpdate(
  body: API.UpdateNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/node/update`,
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

/** Get Server Protocols GET /v1/admin/server/protocols */
export async function getServerProtocols(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServerProtocolsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetServerProtocolsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/protocols`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Reset server sort POST /v1/admin/server/server/sort */
export async function postServerServerSort(
  body: API.ResetSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/server/sort`,
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

/** Update Server POST /v1/admin/server/update */
export async function postServerUpdate(
  body: API.UpdateServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/server/update`,
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

/** Update subscribe PUT /v1/admin/subscribe/ */
export async function putSubscribe(
  body: API.UpdateSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/`,
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

/** Create subscribe POST /v1/admin/subscribe/ */
export async function postSubscribe(
  body: API.CreateSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/`,
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

/** Delete subscribe DELETE /v1/admin/subscribe/ */
export async function deleteSubscribe(
  body: API.DeleteSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Batch delete subscribe DELETE /v1/admin/subscribe/batch */
export async function deleteSubscribeBatch(
  body: API.BatchDeleteSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/batch`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get subscribe details GET /v1/admin/subscribe/details */
export async function getSubscribeDetails(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSubscribeDetailsParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Subscribe }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/details`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update subscribe group PUT /v1/admin/subscribe/group */
export async function putSubscribeGroup(
  body: API.UpdateSubscribeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/group`,
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

/** Create subscribe group POST /v1/admin/subscribe/group */
export async function postSubscribeGroup(
  body: API.CreateSubscribeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/group`,
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

/** Delete subscribe group DELETE /v1/admin/subscribe/group */
export async function deleteSubscribeGroup(
  body: API.DeleteSubscribeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/group`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Batch delete subscribe group DELETE /v1/admin/subscribe/group/batch */
export async function deleteSubscribeGroupBatch(
  body: API.BatchDeleteSubscribeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/group/batch`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get subscribe group list GET /v1/admin/subscribe/group/list */
export async function getSubscribeGroupList(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetSubscribeGroupListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/group/list`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Get subscribe list GET /v1/admin/subscribe/list */
export async function getSubscribeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSubscribeListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetSubscribeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Reset all subscribe tokens POST /v1/admin/subscribe/reset_all_token */
export async function postSubscribeResetAllToken(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.ResetAllSubscribeTokenResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/subscribe/reset_all_token`,
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** Subscribe sort POST /v1/admin/subscribe/sort */
export async function postSubscribeSort(
  body: API.SubscribeSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/subscribe/sort`,
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

/** Get Currency Config GET /v1/admin/system/currency_config */
export async function getSystemCurrencyConfig(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.CurrencyConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/currency_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Currency Config PUT /v1/admin/system/currency_config */
export async function putSystemCurrencyConfig(
  body: API.CurrencyConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/currency_config`,
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

/** Get Node Multiplier GET /v1/admin/system/get_node_multiplier */
export async function getSystemGetNodeMultiplier(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetNodeMultiplierResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/system/get_node_multiplier`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get invite config GET /v1/admin/system/invite_config */
export async function getSystemInviteConfig(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.InviteConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/invite_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update invite config PUT /v1/admin/system/invite_config */
export async function putSystemInviteConfig(
  body: API.InviteConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/invite_config`,
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

/** Get Module Config GET /v1/admin/system/module */
export async function getSystemModule(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.ModuleConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/module`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get node config GET /v1/admin/system/node_config */
export async function getSystemNodeConfig(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.NodeConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/node_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update node config PUT /v1/admin/system/node_config */
export async function putSystemNodeConfig(
  body: API.NodeConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/node_config`,
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

/** PreView Node Multiplier GET /v1/admin/system/node_multiplier/preview */
export async function getSystemNodeMultiplierPreview(options?: {
  [key: string]: any;
}) {
  return request<
    API.ResponseSuccessBean & { data?: API.PreViewNodeMultiplierResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/system/node_multiplier/preview`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** get Privacy Policy Config GET /v1/admin/system/privacy */
export async function getSystemPrivacy(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.PrivacyPolicyConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/privacy`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Privacy Policy Config PUT /v1/admin/system/privacy */
export async function putSystemPrivacy(
  body: API.PrivacyPolicyConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/privacy`,
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

/** Get register config GET /v1/admin/system/register_config */
export async function getSystemRegisterConfig(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.RegisterConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/register_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update register config PUT /v1/admin/system/register_config */
export async function putSystemRegisterConfig(
  body: API.RegisterConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/register_config`,
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

/** Set Node Multiplier POST /v1/admin/system/set_node_multiplier */
export async function postSystemSetNodeMultiplier(
  body: API.SetNodeMultiplierRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/system/set_node_multiplier`,
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

/** setting telegram bot POST /v1/admin/system/setting_telegram_bot */
export async function postSystemSettingTelegramBot(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/system/setting_telegram_bot`,
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** Get site config GET /v1/admin/system/site_config */
export async function getSystemSiteConfig(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.SiteConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/site_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update site config PUT /v1/admin/system/site_config */
export async function putSystemSiteConfig(
  body: API.SiteConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/site_config`,
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

/** Get subscribe config GET /v1/admin/system/subscribe_config */
export async function getSystemSubscribeConfig(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.SubscribeConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/subscribe_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update subscribe config PUT /v1/admin/system/subscribe_config */
export async function putSystemSubscribeConfig(
  body: API.SubscribeConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/subscribe_config`,
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

/** Get Team of Service Config GET /v1/admin/system/tos_config */
export async function getSystemTosConfig(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.TosConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/tos_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Team of Service Config PUT /v1/admin/system/tos_config */
export async function putSystemTosConfig(
  body: API.TosConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/tos_config`,
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

/** Get Verify Code Config GET /v1/admin/system/verify_code_config */
export async function getSystemVerifyCodeConfig(options?: {
  [key: string]: any;
}) {
  return request<API.ResponseSuccessBean & { data?: API.VerifyCodeConfig }>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/system/verify_code_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Verify Code Config PUT /v1/admin/system/verify_code_config */
export async function putSystemVerifyCodeConfig(
  body: API.VerifyCodeConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/system/verify_code_config`,
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

/** Get verify config GET /v1/admin/system/verify_config */
export async function getSystemVerifyConfig(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.VerifyConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/verify_config`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update verify config PUT /v1/admin/system/verify_config */
export async function putSystemVerifyConfig(
  body: API.VerifyConfig,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/system/verify_config`,
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

/** Update ticket status PUT /v1/admin/ticket/ */
export async function putTicket(
  body: API.UpdateTicketStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ticket/`,
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

/** Get ticket detail GET /v1/admin/ticket/detail */
export async function getTicketDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTicketDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.Ticket }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ticket/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create ticket follow POST /v1/admin/ticket/follow */
export async function postTicketFollow(
  body: API.CreateTicketFollowRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ticket/follow`,
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

/** Get ticket list GET /v1/admin/ticket/list */
export async function getTicketList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTicketListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetTicketListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/ticket/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query IP Location GET /v1/admin/tool/ip/location */
export async function getToolIpLocation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getToolIpLocationParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.QueryIPLocationResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/tool/ip/location`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get System Log GET /v1/admin/tool/log */
export async function getToolLog(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.LogResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/tool/log`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Restart System GET /v1/admin/tool/restart */
export async function getToolRestart(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/tool/restart`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get Version GET /v1/admin/tool/version */
export async function getToolVersion(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.VersionResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/tool/version`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Create user POST /v1/admin/user/ */
export async function postUser(
  body: API.CreateUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/`,
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

/** Delete user DELETE /v1/admin/user/ */
export async function deleteUser(
  body: API.GetDetailRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get user auth method GET /v1/admin/user/auth_method */
export async function getUserAuthMethod(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAuthMethodParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserAuthMethodResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/auth_method`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update user auth method PUT /v1/admin/user/auth_method */
export async function putUserAuthMethod(
  body: API.UpdateUserAuthMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/auth_method`,
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

/** Create user auth method POST /v1/admin/user/auth_method */
export async function postUserAuthMethod(
  body: API.CreateUserAuthMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/auth_method`,
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

/** Delete user auth method DELETE /v1/admin/user/auth_method */
export async function deleteUserAuthMethod(
  body: API.DeleteUserAuthMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/auth_method`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Update user basic info PUT /v1/admin/user/basic */
export async function putUserBasic(
  body: API.UpdateUserBasiceInfoRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/basic`,
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

/** Batch delete user DELETE /v1/admin/user/batch */
export async function deleteUserBatch(
  body: API.BatchDeleteUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/batch`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Current user GET /v1/admin/user/current */
export async function getUserCurrent(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.User }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/current`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get user detail GET /v1/admin/user/detail */
export async function getUserDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.User }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** User device PUT /v1/admin/user/device */
export async function putUserDevice(
  body: API.UserDevice,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/device`,
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

/** Delete user device DELETE /v1/admin/user/device */
export async function deleteUserDevice(
  body: API.DeleteUserDeivceRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/device`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** kick offline user device PUT /v1/admin/user/device/kick_offline */
export async function putUserDeviceKickOffline(
  body: API.KickOfflineRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/user/device/kick_offline`,
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

/** Get user list GET /v1/admin/user/list */
export async function getUserList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserListParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.GetUserListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user login logs GET /v1/admin/user/login/logs */
export async function getUserLoginLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserLoginLogsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserLoginLogsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/login/logs`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update user notify setting PUT /v1/admin/user/notify */
export async function putUserNotify(
  body: API.UpdateUserNotifySettingRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/notify`,
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

/** Get user subcribe GET /v1/admin/user/subscribe */
export async function getUserSubscribe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscribeParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserSubscribeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Update user subcribe PUT /v1/admin/user/subscribe */
export async function putUserSubscribe(
  body: API.UpdateUserSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe`,
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

/** Create user subcribe POST /v1/admin/user/subscribe */
export async function postUserSubscribe(
  body: API.CreateUserSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe`,
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

/** Delete user subcribe DELETE /v1/admin/user/subscribe */
export async function deleteUserSubscribe(
  body: API.DeleteUserSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get user subcribe by id GET /v1/admin/user/subscribe/detail */
export async function getUserSubscribeDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscribeDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.UserSubscribeDetail }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe/detail`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user subcribe devices GET /v1/admin/user/subscribe/device */
export async function getUserSubscribeDevice(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscribeDeviceParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserSubscribeDevicesResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe/device`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get user subcribe logs GET /v1/admin/user/subscribe/logs */
export async function getUserSubscribeLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscribeLogsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserSubscribeLogsResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe/logs`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get user subcribe reset traffic logs GET /v1/admin/user/subscribe/reset/logs */
export async function getUserSubscribeResetLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscribeResetLogsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & {
      data?: API.GetUserSubscribeResetTrafficLogsResponse;
    }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/user/subscribe/reset/logs`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Reset user subscribe token POST /v1/admin/user/subscribe/reset/token */
export async function postUserSubscribeResetToken(
  body: API.ResetUserSubscribeTokenRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/user/subscribe/reset/token`,
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

/** Reset user subscribe traffic POST /v1/admin/user/subscribe/reset/traffic */
export async function postUserSubscribeResetTraffic(
  body: API.ResetUserSubscribeTrafficRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/user/subscribe/reset/traffic`,
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

/** Stop user subscribe POST /v1/admin/user/subscribe/toggle */
export async function postUserSubscribeToggle(
  body: API.ToggleUserSubscribeStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/subscribe/toggle`,
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

/** Get user subcribe traffic logs GET /v1/admin/user/subscribe/traffic_logs */
export async function getUserSubscribeTrafficLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscribeTrafficLogsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetUserSubscribeTrafficLogsResponse }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/user/subscribe/traffic_logs`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get withdrawal list GET /v1/admin/withdrawal/list */
export async function getWithdrawalList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getWithdrawalListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetWithdrawalListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/withdrawal/list`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Review withdrawal PUT /v1/admin/withdrawal/status */
export async function putWithdrawalStatus(
  body: API.ReviewWithdrawalRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/withdrawal/status`,
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
