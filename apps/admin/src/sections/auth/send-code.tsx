import { Button } from "@workspace/ui/components/button";
import {
  postCommonSendCode as sendEmailCode,
  postCommonSendSmsCode as sendSmsCode,
} from "@workspace/ui/services/common/common";
import { useCountDown } from "ahooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SendCodeProps {
  type: "email" | "phone";
  params: {
    email?: string;
    type?: 1 | 2;
    telephone_area_code?: string;
    telephone?: string;
  };
}
export default function SendCode({ type, params }: SendCodeProps) {
  const { t } = useTranslation("auth");
  const [targetDate, setTargetDate] = useState<number>();

  const [, { seconds }] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  const getEmailCode = async () => {
    if (params.email && params.type) {
      await sendEmailCode({
        email: params.email,
        type: params.type,
      });
      setTargetDate(Date.now() + 60_000);
    }
  };

  const getPhoneCode = async () => {
    if (params.telephone && params.telephone_area_code && params.type) {
      await sendSmsCode({
        telephone: params.telephone,
        telephone_area_code: params.telephone_area_code,
        type: params.type,
      });
      setTargetDate(Date.now() + 60_000);
    }
  };

  const handleSendCode = async () => {
    if (type === "email") {
      getEmailCode();
    } else {
      getPhoneCode();
    }
  };
  const disabled =
    seconds > 0 ||
    (type === "email"
      ? !params.email
      : !(params.telephone && params.telephone_area_code));

  return (
    <Button disabled={disabled} onClick={handleSendCode} type="button">
      {seconds > 0 ? `${seconds}s` : t("get", "Get Code")}
    </Button>
  );
}
