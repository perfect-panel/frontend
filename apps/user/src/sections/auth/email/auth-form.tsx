"use client";

import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  resetPassword,
  userLogin,
  userRegister,
} from "@workspace/ui/services/common/auth";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { USER_EMAIL, USER_PASSWORD } from "@/config";
import { useGlobalStore } from "@/stores/global";
import { getRedirectUrl, setAuthorization } from "@/utils/common";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import ResetForm from "./reset-form";

export default function EmailAuthForm() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { getUserInfo } = useGlobalStore();
  const searchParams = useSearch({ strict: false }) as { invite?: string };
  const [type, setType] = useState<"login" | "register" | "reset">("login");
  const [loading, startTransition] = useTransition();
  const [initialValues, setInitialValues] = useState<{
    email?: string;
    password?: string;
    invite?: string;
  }>({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  });

  useEffect(() => {
    if (searchParams.invite) {
      localStorage.setItem("invite", searchParams.invite);
      setInitialValues((prev) => ({ ...prev, invite: searchParams.invite }));
    }
  }, [searchParams.invite]);

  const handleFormSubmit = async (params: any) => {
    const onLogin = async (token?: string) => {
      if (!token) return;
      setAuthorization(token);
      await getUserInfo();
      navigate({ to: getRedirectUrl() });
    };
    startTransition(async () => {
      try {
        switch (type) {
          case "login": {
            const login = await userLogin(params);
            toast.success(t("login.success", "Login successful!"));
            onLogin(login.data.data?.token);
            break;
          }
          case "register": {
            const create = await userRegister(params);
            toast.success(t("register.success", "Registration successful!"));
            onLogin(create.data.data?.token);
            break;
          }
          case "reset":
            await resetPassword(params);
            toast.success(t("reset.success", "Password reset successful!"));
            setType("login");
            break;
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "An error occurred"
        );
      }
    });
  };

  let UserForm: ReactNode = null;
  switch (type) {
    case "login":
      UserForm = (
        <LoginForm
          initialValues={initialValues}
          loading={loading}
          onSubmit={handleFormSubmit}
          onSwitchForm={setType}
          setInitialValues={setInitialValues}
        />
      );
      break;
    case "register":
      UserForm = (
        <RegisterForm
          initialValues={initialValues}
          loading={loading}
          onSubmit={handleFormSubmit}
          onSwitchForm={setType}
          setInitialValues={setInitialValues}
        />
      );
      break;
    case "reset":
      UserForm = (
        <ResetForm
          initialValues={initialValues}
          loading={loading}
          onSubmit={handleFormSubmit}
          onSwitchForm={setType}
          setInitialValues={setInitialValues}
        />
      );
      break;
  }

  return UserForm;
}
