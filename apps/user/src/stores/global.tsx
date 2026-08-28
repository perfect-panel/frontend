import { getV1PublicUserInfo as queryUserInfo } from "@workspace/ui/services/user/user";
import { isBrowser } from "@workspace/ui/utils/index";
import { create } from "zustand";
import { buildUserSubscribeUrls } from "@/utils/subscription";

export { extractDomain } from "@/utils/subscription";

export interface GlobalStore {
  common: API.GetGlobalConfigResponse;
  commonError?: string;
  user?: API.User;
  isLoadingCommon: boolean;
  isLoadingUser: boolean;
  setCommon: (common: Partial<API.GetGlobalConfigResponse>) => void;
  setCommonError: (error: string) => void;
  setUser: (user?: API.User) => void;
  getUserInfo: () => Promise<void>;
  clearUserLoading: () => void;
  getUserSubscribe: (short: string, token: string, type?: string) => string[];
  getAppSubLink: (url: string, schema?: string) => string;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  common: {
    site: {
      host: "",
      site_name: "",
      site_desc: "",
      site_logo: "",
      keywords: "",
      custom_html: "",
      custom_data: "",
    },
    verify: {
      turnstile_site_key: "",
      enable_login_verify: false,
      enable_register_verify: false,
      enable_reset_password_verify: false,
    },
    auth: {
      mobile: {
        enable: false,
        enable_whitelist: false,
        whitelist: [],
      },
      email: {
        enable: false,
        enable_verify: false,
        enable_domain_suffix: false,
        domain_suffix_list: "",
      },
      register: {
        stop_register: false,
        enable_ip_register_limit: false,
        ip_register_limit: 0,
        ip_register_limit_duration: 0,
      },
      device: {
        enable: false,
        show_ads: false,
        enable_security: false,
        only_real_device: false,
      },
    },
    invite: {
      forced_invite: false,
      referral_percentage: 0,
      only_first_purchase: false,
      withdrawal_method: "",
    },
    currency: {
      currency_unit: "USD",
      currency_symbol: "$",
    },
    subscribe: {
      single_model: false,
      subscribe_path: "",
      subscribe_domain: "",
      pan_domain: false,
      user_agent_limit: false,
      user_agent_list: "",
      profile_update_interval: 0,
      profile_web_page_url: "",
      show_tutorial: false,
    },
    verify_code: {
      verify_code_expire_time: 5,
      verify_code_limit: 15,
      verify_code_interval: 60,
    },
    oauth_methods: [],
    web_ad: false,
  },
  commonError: undefined,
  user: undefined,
  isLoadingCommon: true,
  isLoadingUser: true,
  setCommon: (common) =>
    set((state) => ({
      common: {
        ...state.common,
        ...common,
      },
      commonError: undefined,
      isLoadingCommon: false,
    })),
  setCommonError: (commonError) => set({ commonError, isLoadingCommon: false }),
  setUser: (user) => set({ user }),
  getUserInfo: async () => {
    set({ isLoadingUser: true });
    try {
      const { data } = await queryUserInfo();
      set({ user: data.data });
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      set({ isLoadingUser: false });
    }
  },
  clearUserLoading: () => {
    set({ isLoadingUser: false });
  },
  getUserSubscribe: (short: string, token: string, type?: string) =>
    buildUserSubscribeUrls({
      origin: window.location.origin,
      short,
      subscribe: get().common.subscribe || {},
      token,
      type,
    }),
  getAppSubLink: (url: string, schema?: string) => {
    const name = get().common?.site?.site_name || "";

    if (!schema) return "url";
    try {
      let result = schema.replace(/\${url}/g, url).replace(/\${name}/g, name);

      const maxLoop = 10;
      let prev: string;
      let loop = 0;
      do {
        prev = result;
        result = result.replace(
          /\${encodeURIComponent\(JSON\.stringify\(([^)]+)\)\)}/g,
          (match, expr) => {
            try {
              const processedExpr = expr
                .replace(/url/g, `"${url}"`)
                .replace(/name/g, `"${name}"`);
              if (processedExpr.includes("server_remote")) {
                const serverRemoteValue = `${url}, tag=${name}`;
                return encodeURIComponent(
                  JSON.stringify({ server_remote: [serverRemoteValue] })
                );
              }
              const obj = eval(`(${processedExpr})`);
              return encodeURIComponent(JSON.stringify(obj));
            } catch {
              return match;
            }
          }
        );

        result = result.replace(
          /\${encodeURIComponent\(([^)]+)\)}/g,
          (match, expr) => {
            if (expr === "url") return encodeURIComponent(url);
            if (expr === "name") return encodeURIComponent(name);
            try {
              return encodeURIComponent(expr);
            } catch {
              return match;
            }
          }
        );

        result = result.replace(
          /\${window\.btoa\(([^)]+)\)}/g,
          (match, expr) => {
            const btoa = isBrowser() ? window.btoa : (str: string) => str;
            if (expr === "url") return btoa(url);
            if (expr === "name") return btoa(name);
            try {
              return btoa(expr);
            } catch {
              return match;
            }
          }
        );

        result = result.replace(
          /\${JSON\.stringify\(([^}]+)\)}/g,
          (match, expr) => {
            try {
              const processedExpr = expr
                .replace(/url/g, `"${url}"`)
                .replace(/name/g, `"${name}"`);
              if (processedExpr.includes("server_remote")) {
                const serverRemoteValue = `${url}, tag=${name}`;
                return JSON.stringify({ server_remote: [serverRemoteValue] });
              }
              const result = eval(`(${processedExpr})`);
              return JSON.stringify(result);
            } catch {
              return match;
            }
          }
        );
        loop++;
      } while (result !== prev && loop < maxLoop);
      return result;
    } catch (_error) {
      return "";
    }
  },
}));
