// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Check user is exist GET /v1/auth/check */
export async function getAuthCheck(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuthCheckParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.CheckUserResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/check`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Check user telephone is exist GET /v1/auth/check/telephone */
export async function getAuthCheckTelephone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuthCheckTelephoneParams,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.TelephoneCheckUserResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/check/telephone`, {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** User login POST /v1/auth/login */
export async function postAuthLogin(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/login`,
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

/** Device Login POST /v1/auth/login/device */
export async function postAuthLoginDevice(
  body: API.DeviceLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/login/device`,
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

/** User Telephone login POST /v1/auth/login/telephone */
export async function postAuthLoginTelephone(
  body: API.TelephoneLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/login/telephone`,
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

/** Apple Login Callback POST /v1/auth/oauth/callback/apple */
export async function postAuthOauthCallbackApple(
  body: {
    /** Authorization code */
    code: string;
    /** Apple identity token */
    id_token?: string;
    /** OAuth state */
    state?: string;
  },
  options?: { [key: string]: any }
) {
  return request<any>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/oauth/callback/apple`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** OAuth login POST /v1/auth/oauth/login */
export async function postAuthOauthLogin(
  body: API.OAthLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.OAuthLoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/oauth/login`,
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

/** OAuth login get token POST /v1/auth/oauth/login/token */
export async function postAuthOauthLoginToken(
  body: API.OAuthLoginGetTokenRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/oauth/login/token`,
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

/** registers a user. POST /v1/auth/register */
export async function postAuthRegister(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/register`,
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

/** User Telephone register POST /v1/auth/register/telephone */
export async function postAuthRegisterTelephone(
  body: API.TelephoneRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/register/telephone`,
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

/** Reset password POST /v1/auth/reset */
export async function postAuthReset(
  body: API.ResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/reset`,
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

/** Reset password POST /v1/auth/reset/telephone */
export async function postAuthResetTelephone(
  body: API.TelephoneResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/reset/telephone`,
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

/** Get Ads GET /v1/common/ads */
export async function getCommonAds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommonAdsParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.GetAdsResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/ads`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Check verification code POST /v1/common/check_verification_code */
export async function postCommonCheckVerificationCode(
  body: API.CheckVerificationCodeRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.ResponseSuccessBean & { data?: API.CheckVerificationCodeRespone }
  >(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/common/check_verification_code`,
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

/** Get Client GET /v1/common/client */
export async function getCommonClient(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetSubscribeClientResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/common/client`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Heartbeat GET /v1/common/heartbeat */
export async function getCommonHeartbeat(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.HeartbeatResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/heartbeat`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get verification code POST /v1/common/send_code */
export async function postCommonSendCode(
  body: API.SendCodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.SendCodeResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/send_code`,
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

/** Get sms verification code POST /v1/common/send_sms_code */
export async function postCommonSendSmsCode(
  body: API.SendSmsCodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean & { data?: API.SendCodeResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/send_sms_code`,
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

/** Get global config GET /v1/common/site/config */
export async function getCommonSiteConfig(options?: { [key: string]: any }) {
  return request<
    API.ResponseSuccessBean & { data?: API.GetGlobalConfigResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/common/site/config`, {
    method: "GET",
    ...(options || {}),
  });
}

/** Get Privacy Policy GET /v1/common/site/privacy */
export async function getCommonSitePrivacy(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.PrivacyPolicyConfig }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/site/privacy`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get stat GET /v1/common/site/stat */
export async function getCommonSiteStat(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.GetStatResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/site/stat`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get Tos Content GET /v1/common/site/tos */
export async function getCommonSiteTos(options?: { [key: string]: any }) {
  return request<API.ResponseSuccessBean & { data?: API.GetTosResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/common/site/tos`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Payment Notify GET /v1/notify/${param0}/${param1} */
export async function getNotifyPlatformToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotifyPlatformTokenParams,
  options?: { [key: string]: any }
) {
  const { platform: param0, token: param1, ...queryParams } = params;
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/notify/${param0}/${param1}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Payment Notify PUT /v1/notify/${param0}/${param1} */
export async function putNotifyPlatformToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putNotifyPlatformTokenParams,
  options?: { [key: string]: any }
) {
  const { platform: param0, token: param1, ...queryParams } = params;
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/notify/${param0}/${param1}`,
    {
      method: "PUT",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Payment Notify POST /v1/notify/${param0}/${param1} */
export async function postNotifyPlatformToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postNotifyPlatformTokenParams,
  options?: { [key: string]: any }
) {
  const { platform: param0, token: param1, ...queryParams } = params;
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/notify/${param0}/${param1}`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Payment Notify DELETE /v1/notify/${param0}/${param1} */
export async function deleteNotifyPlatformToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteNotifyPlatformTokenParams,
  options?: { [key: string]: any }
) {
  const { platform: param0, token: param1, ...queryParams } = params;
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/notify/${param0}/${param1}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Payment Notify PATCH /v1/notify/${param0}/${param1} */
export async function patchNotifyPlatformToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchNotifyPlatformTokenParams,
  options?: { [key: string]: any }
) {
  const { platform: param0, token: param1, ...queryParams } = params;
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/notify/${param0}/${param1}`,
    {
      method: "PATCH",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Telegram POST /v1/telegram/webhook */
export async function postTelegramWebhook(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<API.ResponseSuccessBean>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/telegram/webhook`,
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
