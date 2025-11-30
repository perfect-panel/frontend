import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  type PaymentIntentResult,
  type StripeCardNumberElementOptions,
  type StripeElementStyle,
} from "@stripe/stripe-js";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useTheme } from "@workspace/ui/integrations/theme";
import { CheckCircle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface StripePaymentProps {
  method: string;
  client_secret: string;
  publishable_key: string;
}

interface CardPaymentFormProps {
  clientSecret: string;
  onError: (message: string) => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  clientSecret,
  onError,
}) => {
  const stripe = useStripe();
  const { resolvedTheme } = useTheme();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
    name?: string;
  }>({});
  const [cardholderName, setCardholderName] = useState("");
  const { t } = useTranslation("payment");

  const currentTheme = resolvedTheme;
  const elementStyle: StripeElementStyle = {
    base: {
      fontSize: "16px",
      color: currentTheme === "dark" ? "#fff" : "#000",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  };

  const elementOptions: StripeCardNumberElementOptions = {
    style: elementStyle,
    showIcon: true,
  };

  const handleChange = (event: any, field: keyof typeof errors) => {
    if (event.error) {
      setErrors((prev) => ({ ...prev, [field]: event.error.message }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!(stripe && elements)) {
      onError(t("stripe.loading", "Loading Stripe..."));
      return;
    }

    if (!cardholderName.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: t("stripe.name_required", "Cardholder name is required"),
      }));
      return;
    }

    setProcessing(true);

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    if (!(cardNumber && cardExpiry && cardCvc)) {
      onError(t("stripe.element_error", "Please fill in all card details"));
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: cardholderName,
          },
        },
      }
    );

    if (error) {
      onError(error.message || t("stripe.payment_failed", "Payment failed"));
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setSucceeded(true);
      setProcessing(false);
    } else {
      onError(t("stripe.processing", "Processing payment..."));
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {succeeded ? (
        <div className="py-6 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <p className="font-medium text-xl">
            {t("stripe.success_title", "Payment Successful")}
          </p>
          <p className="mt-2 text-muted-foreground">
            {t(
              "stripe.success_message",
              "Thank you for your purchase. Your order has been processed."
            )}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div className="space-y-1">
              <Label className="font-medium text-sm" htmlFor="cardholderName">
                {t("stripe.card_name", "Cardholder Name")}
              </Label>
              <Input
                className={errors.name ? "border-destructive" : ""}
                id="cardholderName"
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder={t("stripe.name_placeholder", "Full Name on Card")}
                type="text"
                value={cardholderName}
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name}</p>
              )}
            </div>

            {/* Card Number */}
            <div className="space-y-1">
              <Label className="font-medium text-sm" htmlFor="cardNumber">
                {t("stripe.card_number", "Card Number")}
              </Label>
              <div className="relative">
                <div
                  className={`rounded-md border p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${errors.cardNumber ? "border-red-500" : ""}`}
                >
                  <CardNumberElement
                    id="cardNumber"
                    onChange={(e: any) => handleChange(e, "cardNumber")}
                    options={elementOptions}
                  />
                </div>
              </div>
              {errors.cardNumber && (
                <p className="text-destructive text-xs">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div className="space-y-1">
                <Label className="font-medium text-sm" htmlFor="cardExpiry">
                  {t("stripe.expiry_date", "Expiry Date")}
                </Label>
                <div
                  className={`rounded-md border p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${errors.cardExpiry ? "border-red-500" : ""}`}
                >
                  <CardExpiryElement
                    id="cardExpiry"
                    onChange={(e: any) => handleChange(e, "cardExpiry")}
                    options={{ style: elementStyle }}
                  />
                </div>
                {errors.cardExpiry && (
                  <p className="text-destructive text-xs">
                    {errors.cardExpiry}
                  </p>
                )}
              </div>

              {/* Security Code */}
              <div className="space-y-1">
                <Label className="font-medium text-sm" htmlFor="cardCvc">
                  {t("stripe.security_code", "CVC")}
                </Label>
                <div
                  className={`rounded-md border p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${errors.cardCvc ? "border-red-500" : ""}`}
                >
                  <CardCvcElement
                    id="cardCvc"
                    onChange={(e: any) => handleChange(e, "cardCvc")}
                    options={{ style: elementStyle }}
                  />
                </div>
                {errors.cardCvc && (
                  <p className="text-destructive text-xs">{errors.cardCvc}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col space-y-4">
            <Button
              className="w-full"
              disabled={processing || !stripe || !elements}
              type="submit"
            >
              {processing
                ? t("stripe.processing_button", "Processing...")
                : t("stripe.pay_button", "Pay Now")}
            </Button>
            <p className="text-center text-muted-foreground text-xs">
              {t("stripe.secure_notice", "Payments are secure and encrypted")}
            </p>
          </div>
        </>
      )}
    </form>
  );
};

const StripePayment: React.FC<StripePaymentProps> = ({
  method,
  client_secret,
  publishable_key,
}) => {
  const stripePromise = useMemo(
    () => loadStripe(publishable_key),
    [publishable_key]
  );

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm client_secret={client_secret} method={method} />
    </Elements>
  );
};

const CheckoutForm: React.FC<Omit<StripePaymentProps, "publishable_key">> = ({
  client_secret,
  method,
}) => {
  const stripe = useStripe();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation("payment");
  const qrCodeMap: Record<string, string> = {
    alipay: t("stripe.qrcode.alipay", "Scan with Alipay to pay"),
    wechat_pay: t("stripe.qrcode.wechat_pay", "Scan with WeChat to pay"),
  };

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setIsSubmitted(false);
  }, []);

  const confirmPayment =
    useCallback(async (): Promise<PaymentIntentResult | null> => {
      if (!stripe) {
        handleError(t("stripe.card.loading", "Loading Stripe..."));
        return null;
      }

      if (method === "alipay") {
        return await stripe.confirmAlipayPayment(
          client_secret,
          { return_url: window.location.href },
          { handleActions: false }
        );
      }
      if (method === "wechat_pay") {
        return await stripe.confirmWechatPayPayment(
          client_secret,
          {
            payment_method_options: { wechat_pay: { client: "web" } },
          },
          { handleActions: false }
        );
      }
      return null;
    }, [client_secret, method, stripe, handleError, t]);

  const autoSubmit = useCallback(async () => {
    if (isSubmitted || method === "card") return;

    setIsSubmitted(true);

    try {
      const result = await confirmPayment();
      if (!result) return;

      const { error, paymentIntent } = result;
      if (error) return handleError(error.message!);

      if (paymentIntent?.status === "requires_action") {
        const nextAction = paymentIntent.next_action as any;
        const qrUrl =
          method === "alipay"
            ? nextAction?.alipay_handle_redirect?.url
            : nextAction?.wechat_pay_display_qr_code?.image_url_svg;

        setQrCodeUrl(qrUrl || null);
      }
    } catch (_error) {
      handleError(t("stripe.error", "An error occurred"));
    }
  }, [confirmPayment, isSubmitted, handleError, method, t]);

  useEffect(() => {
    autoSubmit();
  }, [autoSubmit]);

  return method === "card" ? (
    <div className="min-w-80 text-left">
      <CardPaymentForm clientSecret={client_secret} onError={handleError} />
    </div>
  ) : qrCodeUrl ? (
    <>
      <QRCodeCanvas
        imageSettings={{
          src: `./assets/payment/${method}.svg`,
          width: 24,
          height: 24,
          excavate: true,
        }}
        size={208}
        value={qrCodeUrl}
      />
      <p className="mt-4 text-center text-muted-foreground">
        {qrCodeMap[method] || t(`qrcode.${method}`, `Scan with ${method}`)}
      </p>
    </>
  ) : (
    errorMessage
  );
};

export default StripePayment;
