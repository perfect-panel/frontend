import { z } from "zod";

export const emailSettingsSchema = z.object({
  id: z.number(),
  method: z.string(),
  enabled: z.boolean(),
  config: z
    .object({
      enable_verify: z.boolean(),
      enable_domain_suffix: z.boolean(),
      enable_notify: z.boolean().optional(),
      domain_suffix_list: z.string().optional(),
      verify_email_subject: z.string().optional(),
      verify_email_template: z.string().optional(),
      expiration_email_subject: z.string().optional(),
      expiration_email_template: z.string().optional(),
      maintenance_email_subject: z.string().optional(),
      maintenance_email_template: z.string().optional(),
      traffic_exceed_email_subject: z.string().optional(),
      traffic_exceed_email_template: z.string().optional(),
      platform: z.string(),
      platform_config: z
        .object({
          host: z.string().optional(),
          port: z.number().optional(),
          ssl: z.boolean().optional(),
          api_key: z.string().optional(),
          account_id: z.string().optional(),
          api_token: z.string().optional(),
          user: z.string().optional(),
          pass: z.string().optional(),
          from: z.string().optional(),
          reply_to: z.string().optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough()
    .optional(),
});

export type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

type EmailPlatformConfig = NonNullable<
  EmailSettingsFormData["config"]
>["platform_config"];

export function initialEmailPlatformConfig(
  platform: string,
  previous?: EmailPlatformConfig
) {
  const addresses = {
    from: previous?.from ?? "",
    reply_to: previous?.reply_to ?? "",
  };
  switch (platform) {
    case "resend":
      return { ...addresses, api_key: "" };
    case "cloudflare":
      return { ...addresses, account_id: "", api_token: "" };
    default:
      return {
        ...addresses,
        host: "",
        port: 587,
        ssl: false,
        user: "",
        pass: "",
      };
  }
}
