import {
  closeOrder as closeOrderGenerated,
  preCreateOrder as preCreateOrderGenerated,
  purchase as purchaseGenerated,
  queryOrderDetail as queryOrderDetailGenerated,
} from "@workspace/ui/services/user/order";

/**
 * Order service wrappers (P0 critical path).
 *
 * Notes:
 * - This package intentionally does not modify any OpenAPI-generated files.
 * - These functions currently forward to the generated `@workspace/ui/services/*` calls.
 * - UI can migrate imports from `@workspace/ui/services/user/order` → `@workspace/services/order`.
 */

// Keep request/response types minimal to avoid coupling to generated `API` namespace typings.
export type OrderNo = string;

export type PreCreateOrderInput = {
  subscribe_id: number;
  quantity: number;
  payment?: number;
  coupon?: string;
};

export type PurchaseOrderInput = PreCreateOrderInput;

export type QueryOrderDetailInput = {
  order_no: string;
};

export type CloseOrderInput = {
  orderNo: string;
};

export const preCreateOrder = preCreateOrderGenerated as (
  body: PreCreateOrderInput,
  options?: Record<string, unknown>
) => ReturnType<typeof preCreateOrderGenerated>;

export const purchase = purchaseGenerated as (
  body: PurchaseOrderInput,
  options?: Record<string, unknown>
) => ReturnType<typeof purchaseGenerated>;

export const queryOrderDetail = queryOrderDetailGenerated as (
  params: QueryOrderDetailInput,
  options?: Record<string, unknown>
) => ReturnType<typeof queryOrderDetailGenerated>;

export const closeOrder = closeOrderGenerated as (
  body: CloseOrderInput,
  options?: Record<string, unknown>
) => ReturnType<typeof closeOrderGenerated>;
