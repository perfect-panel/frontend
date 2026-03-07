import { purchaseCheckout as purchaseCheckoutGenerated } from "@workspace/ui/services/user/portal";

/**
 * Portal checkout wrapper (P0 critical path).
 *
 * Typical UI flow:
 * 1) create order (purchase/renewal/recharge...) -> get `order_no`
 * 2) call `purchaseCheckout({ orderNo: order_no, returnUrl: window.location.href })`
 * 3) if response type is `url`, redirect/open `checkout_url`; if `qr`, render QR; if `stripe`, mount Stripe widget.
 */

export type PurchaseCheckoutInput = {
  orderNo: string;
  returnUrl?: string;
};

export const purchaseCheckout = purchaseCheckoutGenerated as (
  body: PurchaseCheckoutInput,
  options?: Record<string, unknown>
) => ReturnType<typeof purchaseCheckoutGenerated>;
