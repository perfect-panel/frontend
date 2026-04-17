/// <reference types="vite/client" />

import type i18n from "i18next";

declare global {
  interface Window {
    logout: () => void;
    i18n: typeof i18n;
  }

  const __APP_GIT_VERSION__: {
    commit: string;
    tag: string | null;
    display_version: string;
  };
}

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
}

// openapi2ts 生成的 request 参数里可能会包含 requestType（umi-request 风格）。
// 我们的 request 基于 axios：这里做一个类型补丁，避免 TS 报错。
declare module "axios" {
  export interface AxiosRequestConfig<D = any> {
    requestType?: string;
  }
}
