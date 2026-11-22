# Auth Control

>`System → Auth Control` focuses on **how** users log in and verify their identity. Configure email, SMS, social sign-in, and device authentication in one place, with built-in testing tools so every change can be validated instantly.

## Module Overview

- **Communication methods**: Email + SMS login, complete with verification flows, whitelists, and message templates.
- **Social accounts**: Apple, Google, Facebook, GitHub, and Telegram can be toggled independently.
- **Device authentication**: Hardens device-based login with VM detection and communication keys.

The following sections mirror the cards you see in the admin panel—work through them in order, test, then save.

## Communication Methods

### Email authentication

1. **Basic switches**
   - `Enable email sign-in`: Controls whether the login form shows the email path.
   - `Email verification`: Forces new users or sensitive actions to complete email OTP first.
   - `Domain whitelist`: Only allow addresses from specific domains (one suffix per line, e.g. `gmail.com`).

2. **Email delivery**
   - Choose **SMTP**, **Resend**, or **Cloudflare Email Service**.
   - For SMTP, enter the host, port, encryption setting and relay credentials.
   - For Resend, enter an API key with sending access. For Cloudflare, enter the account ID and a token with **Email Sending Write** permission.
   - Enter the From address and an optional Reply-To address. With either API provider, verify the sending domain first.
   - Save, reopen Email Settings and use **Send Test Email** to check the selected account.

3. **Template tabs** (`Verify / Expiration / Maintenance / Traffic`)
   - Templates are HTML-capable and support variables:
     - <code v-pre>{{.Type}}</code>: Email type (1 register, 2 reset password); combine with <code v-pre>{{if eq .Type 1}}</code> for conditions.
     - <code v-pre>{{.SiteLogo}}</code> / <code v-pre>{{.SiteName}}</code>: Branding assets.
     - <code v-pre>{{.Expire}}</code>: OTP expiration; <code v-pre>{{.ExpireDate}}</code>: Subscription expiration.
     - <code v-pre>{{.Code}}</code>: Verification code.
     - <code v-pre>{{.MaintenanceDate}}</code>, <code v-pre>{{.MaintenanceTime}}</code>: Maintenance notice specifics.
   - The embedded editor is WYSIWYG—save to apply instantly to new outbound mail.

### SMS authentication

1. **Login policy**
   - `Enable SMS sign-in`: Turns the phone-number OTP entry on/off.
   - `Whitelist area codes`: When enabled, only listed codes (e.g. `1, 852, 886`) are accepted.

2. **Platform & dynamic fields**
   - Select an SMS provider; the form reveals the exact fields that provider requires and offers a shortcut link to apply for service.
   - Common fields include `Access Key`, `Secret Key`, `Endpoint`, `Template Code`, `Sign Name`, and dedicated sender numbers.
   - If the provider expects custom templates, paste the body that contains <code v-pre>{{code}}</code> (or its vendor-specific variable).

3. **Test SMS**
   - Choose an area code, enter a number, and click “Test SMS” to call the gateway immediately.
   - Most failures trace back to invalid credentials, pending template review, or a mismatched signature—verify inside the vendor console.

## Social Authentication

All social options share the same drawer layout: toggle the method, fill in the credentials, then save to expose the login button to end users.

### Apple Sign-In
- **Team ID / Key ID**: From Apple Developer.
- **Service ID (Client ID)**: Created under Apple Developer → Identifiers.
- **Private Key**: Contents of the `.p8` key file (keep the `BEGIN/END` markers).
- **Redirect URL**: API endpoint the user returns to after Apple auth; omit trailing `/`.

### Google Sign-In
- **Client ID / Client Secret**: OAuth credentials created in Google Cloud Console (Web application type).
- Add your site’s callback—for example `/api/auth/google/callback`—to the authorized redirect URIs.

### Facebook Login
- **App ID / App Secret**: From the Facebook Developer portal. Make sure your domain is listed under “Valid OAuth Redirect URIs”.

### GitHub Login
- **Client ID / Client Secret**: From GitHub Developer Settings → OAuth Apps.
- Set the callback to something like `https://your-domain.com/api/auth/github/callback` and require HTTPS.

### Telegram Login
- **Bot ID / Bot Token**: Generated via @BotFather (enable the Login Widget permission).
- Users authorize by interacting with your bot; once configured the official Telegram dialog will pop up automatically.

## Device Authentication

Best for client/TV apps that exchange a one-time device code.

- `Enable device sign-in`: Allows devices to authenticate via code or QR pairing.
- `Show ads`: Toggles advertising surfaces on the device experience.
- `Block virtual machine`: Rejects requests coming from emulators/VMs.
- `Enable security`: Forces every device request to include a shared communication key.
- `Communication key`: Paste your own or click the dice icon to auto-generate a 32-character GUID; create one per channel and keep it secret.

## Operational Tips

- Snapshot email and SMS credentials before switching providers so you can roll back quickly.
- Always use “Send test email” or “Test SMS” after editing settings—production users should never be the first to try a new config.
- Provider-specific SMS fields change dynamically; if a required field is missing, define it in the vendor console via template variables.
- For OAuth flows (Apple/Google/etc.), rehearse the entire login in a sandbox account to confirm the redirect URI and scopes are correct.
- Treat the communication key as a secret—share it only with trusted client apps and never commit it to version control.

## FAQs

### Email sends but users still see “verification failed”
- Confirm the domain whitelist includes the user’s email suffix.
- Some enterprise SMTP vendors require the From address to exactly match the authenticated account—otherwise the message is dropped.

### SMS keeps failing
- Ensure the template is approved and that the placeholder name (e.g., <code v-pre>{{code}}</code>) matches what the vendor expects.
- Verify the destination area code is whitelisted.
- Still failing? Inspect the API error code in DevTools and cross reference it with the SMS provider documentation.

### OAuth redirect mismatch errors
- Facebook, Google, and GitHub demand an exact match on the redirect URI, including protocol and trailing path—copy the admin value verbatim into the vendor console.

## Related Docs

- [System Config](/admin/system/config): Branding, SMTP defaults, and other site-wide settings.
- [Payment Config](/admin/system/payment): Configure gateways after your login flows are working.
- [Ads Config](/admin/system/ads): Pairs with the “Show ads” option in device authentication.
