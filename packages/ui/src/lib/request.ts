/// <reference path="../typings.d.ts" />
import { getCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

function handleError(response: {
  data?: { code?: number; msg?: string; message?: string };
  config?: { skipErrorHandler?: boolean };
  message?: string;
}): string | undefined {
  const code = response.data?.code;
  if (code && [40_002, 40_003, 40_004, 40_005].includes(code)) {
    window.logout();
    return;
  }
  const serverMessage = response.data?.msg || response.data?.message;
  if (!isBrowser()) return serverMessage || response.message;

  const t = window.i18n.t;

  const ERROR_MESSAGES: Record<number, string> = {
    400: t(
      "components:error.400",
      "The request parameters are incorrect, please check and resubmit."
    ),
    401: t(
      "components:error.401",
      "Request is too frequent, please try again later."
    ),
    500: t(
      "components:error.500",
      "The server is having some issues, please try again later."
    ),
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
      "This account already exists. Please log in or reset your password."
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
    20007: t(
      "components:error.20007",
      "Telegram is not linked to this account."
    ),
    20008: t(
      "components:error.20008",
      "User information is incorrect, please check and try again."
    ),
    20009: t(
      "components:error.20009",
      "Invalid invitation code. Please check it, or leave it blank if it is optional."
    ),
    20010: t("components:error.20010", "Insufficient commission balance."),
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
    40006: t(
      "components:error.40006",
      "Request decryption failed. Please refresh the page and try again."
    ),
    40007: t(
      "components:error.40007",
      "The secret is not configured. Please contact the administrator."
    ),
    50001: t(
      "components:error.50001",
      "Corresponding coupon information not found, please check and try again."
    ),
    50002: t(
      "components:error.50002",
      "The coupon has been used, cannot be used again."
    ),
    50003: t(
      "components:error.50003",
      "This coupon does not apply to the current plan or order."
    ),
    50004: t("components:error.50004", "This coupon has no remaining uses."),
    50005: t("components:error.50005", "This coupon has expired."),
    50006: t("components:error.50006", "This coupon has been disabled."),
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
    61001: t(
      "components:error.61001",
      "Order not found. Please refresh and try again."
    ),
    61002: t(
      "components:error.61002",
      "Payment method not found. Please choose another one."
    ),
    61003: t(
      "components:error.61003",
      "The order status has changed. Please refresh and try again."
    ),
    61004: t(
      "components:error.61004",
      "The purchase period is not sufficient for this operation."
    ),
    61005: t(
      "components:error.61005",
      "There is still available traffic, so this operation is not needed."
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
    90002: t(
      "components:error.90002",
      "Failed to send the SMS. Please try again later."
    ),
    90003: t("components:error.90003", "Phone login is not enabled."),
    90004: t("components:error.90004", "Email is not enabled."),
    90005: t("components:error.90005", "This login method is not supported."),
    90006: t(
      "components:error.90006",
      "This authenticator does not support the method."
    ),
    90007: t("components:error.90007", "Please select a phone area code."),
    90008: t("components:error.90008", "Please enter a password."),
    90009: t("components:error.90009", "Please select an area code."),
    90010: t(
      "components:error.90010",
      "Please enter a password or verification code."
    ),
    90011: t("components:error.90011", "This email is already registered."),
    90012: t(
      "components:error.90012",
      "This phone number is already registered."
    ),
    90013: t("components:error.90013", "This device already exists."),
    90014: t(
      "components:error.90014",
      "Invalid phone number. Please check and try again."
    ),
    90015: t(
      "components:error.90015",
      "This account has reached the limit of sending times today, please try again tomorrow."
    ),
    90017: t("components:error.90017", "Device not found."),
    90018: t(
      "components:error.90018",
      "The user does not match. Please log in again."
    ),
    110001: t(
      "components:error.110001",
      "The login session is invalid or has expired. Please try again."
    ),
    110002: t(
      "components:error.110002",
      "The login provider request failed. Please try again later."
    ),
    110003: t(
      "components:error.110003",
      "The login callback is invalid. Please try again."
    ),
    110004: t(
      "components:error.110004",
      "The login callback has expired. Please try again."
    ),
    110005: t(
      "components:error.110005",
      "This login callback has already been used. Please try again."
    ),
    110006: t(
      "components:error.110006",
      "This login provider is not configured correctly. Please contact the administrator."
    ),
    110007: t("components:error.110007", "The Telegram bot is not configured."),
    110008: t(
      "components:error.110008",
      "This operation is not allowed in demo mode."
    ),
    110009: t(
      "components:error.110009",
      "The test message could not be sent. Please check the configuration."
    ),
    110010: t(
      "components:error.110010",
      "This email matches more than one account. Please contact the administrator."
    ),
    120001: t(
      "components:error.120001",
      "The payment notification URL is not configured."
    ),
    120002: t(
      "components:error.120002",
      "This payment platform is not supported."
    ),
    120003: t(
      "components:error.120003",
      "The payment configuration is invalid. Please check and try again."
    ),
    120004: t(
      "components:error.120004",
      "The platform of an existing payment method cannot be changed."
    ),
    120005: t(
      "components:error.120005",
      "This payment method still has pending orders."
    ),
    120006: t(
      "components:error.120006",
      "This is a built-in payment method and cannot be changed."
    ),
    120007: t("components:error.120007", "The payment fee setting is invalid."),
    120008: t(
      "components:error.120008",
      "The payment result is still being confirmed. Please refresh later."
    ),
    120009: t(
      "components:error.120009",
      "The initial order status is invalid."
    ),
    120010: t(
      "components:error.120010",
      "The order cannot move to this status."
    ),
    120011: t("components:error.120011", "A transaction number is required."),
    120012: t("components:error.120012", "This order cannot be closed."),
    120013: t(
      "components:error.120013",
      "The used count of a coupon cannot be changed."
    ),
    120014: t("components:error.120014", "The coupon is invalid."),
    120015: t("components:error.120015", "The coupon discount is invalid."),
    120016: t("components:error.120016", "The coupon type is invalid."),
    120017: t(
      "components:error.120017",
      "This withdrawal has already been reviewed."
    ),
    130001: t(
      "components:error.130001",
      "The subscription status has changed. Please refresh and try again."
    ),
    130002: t(
      "components:error.130002",
      "This subscription status cannot be toggled."
    ),
    160001: t(
      "components:error.160001",
      "Settings were saved but could not be applied. Please reload or restart the service."
    ),
  };

  const message =
    (code ? ERROR_MESSAGES[code] : undefined) ||
    serverMessage ||
    t(
      "components:error.unknown",
      "An error occurred in the system, please try again later."
    );

  if (response?.config?.skipErrorHandler) return message;

  toast.error(message);
  return message;
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
      const message = handleError({
        data: response.data,
        config: {
          skipErrorHandler: (response.config as { skipErrorHandler?: boolean })
            .skipErrorHandler,
        },
        message: response.statusText,
      });
      throw Object.assign(new Error(message ?? "Request failed"), {
        code,
        data: response.data,
        response,
      });
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
