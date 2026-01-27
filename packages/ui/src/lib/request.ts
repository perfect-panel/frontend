/// <reference path="../typings.d.ts" />
import { getCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

function handleError(response: {
  data?: { code?: number; message?: string };
  config?: { skipErrorHandler?: boolean };
  message?: string;
}) {
  const code = response.data?.code;
  if (code && [40_002, 40_003, 40_004, 40_005].includes(code))
    return window.logout();
  if (response?.config?.skipErrorHandler) return;
  if (!isBrowser()) return;

  const t = window.i18n.t;

  const ERROR_MESSAGES: Record<number, string> = {
    10001: t(
      "components:error.10001",
      "Query was not successful, please try again later or check your conditions."
    ),
    10002: t(
      "components:error.10002",
      "Update operation was not successful, please try again later."
    ),
    10003: t(
      "components:error.10003",
      "Insert operation cannot be completed at the moment, please try again later."
    ),
    10004: t(
      "components:error.10004",
      "Deletion operation could not be completed, please try again later."
    ),
    20001: t(
      "components:error.20001",
      "The user information already exists, please retry with different information."
    ),
    20002: t(
      "components:error.20002",
      "User not found, please check the information and try again."
    ),
    20003: t("components:error.20003", "Incorrect password, please re-enter."),
    20004: t(
      "components:error.20004",
      "The user is disabled, please contact customer service if you have questions."
    ),
    20005: t(
      "components:error.20005",
      "Insufficient balance, please recharge and try again."
    ),
    20006: t(
      "components:error.20006",
      "The registration function is temporarily unavailable, please try again later."
    ),
    20008: t(
      "components:error.20008",
      "User information is incorrect, please check and try again."
    ),
    30001: t(
      "components:error.30001",
      "The node already exists, please do not add it again."
    ),
    30002: t(
      "components:error.30002",
      "Related node not found, please check and try again."
    ),
    30003: t(
      "components:error.30003",
      "Group already exists, please try using a different name."
    ),
    30004: t(
      "components:error.30004",
      "Group not found, please verify the information and try again."
    ),
    30005: t(
      "components:error.30005",
      "There is still content in the group, please clear it and try again."
    ),
    400: t(
      "components:error.400",
      "The request parameters are incorrect, please check and resubmit."
    ),
    40002: t(
      "components:error.40002",
      "Valid Token not found, please log in before retrying."
    ),
    40003: t(
      "components:error.40003",
      "Current Token is invalid, please reacquire before trying again."
    ),
    40004: t(
      "components:error.40004",
      "Token has expired, please log in again."
    ),
    40005: t(
      "components:error.40005",
      "You do not have access permission, please contact the administrator if you have any questions."
    ),
    401: t(
      "components:error.401",
      "Request is too frequent, please try again later."
    ),
    500: t(
      "components:error.500",
      "The server is having some issues, please try again later."
    ),
    50001: t(
      "components:error.50001",
      "Corresponding coupon information not found, please check and try again."
    ),
    50002: t(
      "components:error.50002",
      "The coupon has been used, cannot be used again."
    ),
    60001: t(
      "components:error.60001",
      "Subscription has expired, please renew before using."
    ),
    60002: t(
      "components:error.60002",
      "Unable to use the subscription at the moment, please try again later."
    ),
    60003: t(
      "components:error.60003",
      "An existing subscription is detected. Please cancel it before proceeding."
    ),
    60004: t(
      "components:error.60004",
      "Unable to delete at the moment as the subscription has active users."
    ),
    60005: t(
      "components:error.60005",
      "Single subscription mode has exceeded user limit"
    ),
    60006: t(
      "components:error.60006",
      "User quota limit has been reached, unable to continue."
    ),
    60007: t(
      "components:error.60007",
      "Insufficient inventory, please try again later or contact the administrator."
    ),
    70001: t(
      "components:error.70001",
      "Incorrect verification code, please re-enter."
    ),
    80001: t(
      "components:error.80001",
      "Task was not successfully queued, please try again later."
    ),
    90001: t(
      "components:error.90001",
      "Please disable DEBUG mode and try again."
    ),
    90015: t(
      "components:error.90015",
      "This account has reached the limit of sending times today, please try again tomorrow."
    ),
  };

  const message =
    response.data?.message ||
    (code ? ERROR_MESSAGES[code] : undefined) ||
    t(
      "components:error.unknown",
      "An error occurred in the system, please try again later."
    );

  toast.error(message);
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

request.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig & {
      Authorization?: string;
      skipErrorHandler?: boolean;
    }
  ) => {
    const Authorization = getCookie("Authorization");
    if (Authorization) config.headers.Authorization = Authorization;
    return config;
  },
  (error: Error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code !== 200 && code !== 0) {
      handleError({
        data: response.data,
        config: {
          skipErrorHandler: (response.config as { skipErrorHandler?: boolean })
            .skipErrorHandler,
        },
        message: response.statusText,
      });
      throw response;
    }
    return response;
  },
  (error: {
    response?: { data?: unknown; config?: unknown; statusText?: string };
    message?: string;
  }) => {
    handleError({
      data: error.response?.data as { code?: number },
      config: {
        skipErrorHandler: (
          error.response?.config as { skipErrorHandler?: boolean }
        )?.skipErrorHandler,
      },
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default request;
