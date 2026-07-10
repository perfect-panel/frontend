"use client";

import { useNavigate } from "@tanstack/react-router";
import {
  resetPassword,
  userLogin,
  userRegister,
} from "@workspace/ui/services/common/auth";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
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
  const [type, setType] = useState<"login" | "register" | "reset">("login");
  const [loading, startTransition] = useTransition();
  const [initialValues, setInitialValues] = useState<{
    email?: string;
    password?: string;
  }>({
    email: USER_EMAIL,
    password: USER_PASSWORD,
  });

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

  return (
    <>
      <div className="mb-11 text-center">
        <h1 className="mb-3 font-bold text-2xl">
          {type === "login"
            ? t("login.title", "Login")
            : type === "register"
              ? t("register.title", "Register")
              : type === "reset"
                ? t("reset.title", "Reset Password")
                : t("check.title", "Verify")}
        </h1>
        <div className="font-medium text-muted-foreground">
          {type === "login"
            ? t("login.description", "Enter your credentials to continue")
            : type === "register"
              ? t("register.description", "Create a new account")
              : type === "reset"
                ? t("reset.description", "Reset your password")
                : t("check.description", "Verify your identity")}
        </div>
      </div>
      {UserForm}
    </>
  );
}
