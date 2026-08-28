import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import {
  postUserAuthMethod as createUserAuthMethod,
  deleteUserAuthMethod,
  putUserAuthMethod as updateUserAuthMethod,
} from "@workspace/ui/services/admin/admin";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function AuthMethodsForm({
  user,
  refetch,
}: {
  user: API.User;
  refetch: () => Promise<unknown>;
}) {
  const { t } = useTranslation("user");

  const [emailChanges, setEmailChanges] = useState<Record<string, string>>({});

  const handleRemoveAuth = async (authType: string) => {
    await deleteUserAuthMethod({
      user_id: user.id,
      auth_type: authType,
    });
    toast.success(t("deleteSuccess", "Deleted successfully"));
  };

  const handleUpdateEmail = async (email: string) => {
    await updateUserAuthMethod({
      user_id: user.id,
      auth_type: "email",
      auth_identifier: email,
    });
    toast.success(t("updateSuccess", "Updated successfully"));
    refetch();
  };

  const handleCreateEmail = async (email: string) => {
    await createUserAuthMethod({
      user_id: user.id,
      auth_type: "email",
      auth_identifier: email,
    });
    toast.success(t("createSuccess", "Created successfully"));
    refetch();
  };

  const handleEmailChange = (authType: string, value: string) => {
    setEmailChanges((prev) => ({
      ...prev,
      [authType]: value,
    }));
  };

  const emailMethod = user.auth_methods.find(
    (method) => method.auth_type === "email"
  );
  const otherMethods = user.auth_methods.filter(
    (method) => method.auth_type !== "email"
  );

  const defaultEmailMethod = {
    auth_type: "email",
    auth_identifier: "",
    verified: false,
    ...emailMethod,
  };

  const isEmailExists = !!emailMethod;
  const handleEmailAction = () => {
    const email = emailChanges.email;
    if (isEmailExists) {
      handleUpdateEmail(email as string);
    } else {
      handleCreateEmail(email as string);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("authMethodsTitle", "Auth Methods")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <Card className="border-none shadow-none">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-center justify-between">
                <div className="font-medium uppercase">email</div>
                <Badge
                  variant={
                    defaultEmailMethod.verified ? "default" : "destructive"
                  }
                >
                  {defaultEmailMethod.verified
                    ? t("verified", "Verified")
                    : t("unverified", "Unverified")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <EnhancedInput
                    onValueChange={(value) =>
                      handleEmailChange("email", value as string)
                    }
                    placeholder={t("pleaseEnterEmail", "Enter email")}
                    value={defaultEmailMethod.auth_identifier}
                  />
                </div>
                <Button
                  disabled={
                    !emailChanges.email ||
                    (isEmailExists &&
                      emailChanges.email === defaultEmailMethod.auth_identifier)
                  }
                  onClick={handleEmailAction}
                >
                  {isEmailExists ? t("update", "Update") : t("add", "Add")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {otherMethods.map((method) => (
            <Card className="border-none shadow-none" key={method.auth_type}>
              <CardContent className="space-y-3 p-0">
                <div className="flex items-center justify-between">
                  <div className="font-medium uppercase">
                    {method.auth_type}
                  </div>
                  <Badge variant={method.verified ? "default" : "destructive"}>
                    {method.verified
                      ? t("verified", "Verified")
                      : t("unverified", "Unverified")}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-muted-foreground text-sm">
                      {method.auth_identifier}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveAuth(method.auth_type)}
                    size="sm"
                    variant="destructive"
                  >
                    {t("remove", "Remove")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
