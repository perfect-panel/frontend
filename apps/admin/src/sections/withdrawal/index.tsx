"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Textarea } from "@workspace/ui/components/textarea";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  getWithdrawalList,
  putWithdrawalStatus,
} from "@workspace/ui/services/admin/admin";
import { type FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { UserDetail } from "@/sections/user/user-detail";
import { formatDate } from "@/utils/common";

type WithdrawalFilters = {
  status?: number | string;
  user_id?: number | string;
};

type ReviewActionsProps = {
  onReviewed: () => void;
  withdrawal: API.WithdrawalLog;
};

function ReviewActions({ onReviewed, withdrawal }: ReviewActionsProps) {
  const { t } = useTranslation("withdrawal");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reviewing, setReviewing] = useState<1 | 2>();

  const review = async (status: 1 | 2, reviewReason?: string) => {
    setReviewing(status);
    try {
      await putWithdrawalStatus({
        id: withdrawal.id,
        status,
        ...(reviewReason ? { reason: reviewReason } : {}),
      });
      toast.success(
        status === 1
          ? t("approveSuccess", "Withdrawal approved")
          : t("rejectSuccess", "Withdrawal rejected")
      );
      setReason("");
      setRejectOpen(false);
      onReviewed();
    } catch {
      toast.error(t("reviewFailed", "Failed to review withdrawal"));
    } finally {
      setReviewing(undefined);
    }
  };

  const handleReject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reviewReason = reason.trim();
    if (!reviewReason) {
      toast.error(t("reasonRequired", "Please enter a rejection reason"));
      return;
    }
    await review(2, reviewReason);
  };

  return (
    <>
      <ConfirmButton
        cancelText={t("cancel", "Cancel")}
        confirmText={t("confirmApprove", "Approve")}
        description={t(
          "approveDescription",
          "Confirm that this withdrawal has been verified and can be approved."
        )}
        onConfirm={() => review(1)}
        title={t("approveTitle", "Approve this withdrawal?")}
        trigger={
          <Button disabled={reviewing !== undefined} size="sm">
            {reviewing === 1
              ? t("reviewing", "Reviewing...")
              : t("approve", "Approve")}
          </Button>
        }
      />
      <Dialog onOpenChange={setRejectOpen} open={rejectOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={reviewing !== undefined}
            size="sm"
            variant="destructive"
          >
            {t("reject", "Reject")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleReject}>
            <DialogHeader>
              <DialogTitle>
                {t("rejectTitle", "Reject this withdrawal?")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "rejectDescription",
                  "The rejection reason will be recorded for this request."
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <label className="font-medium text-sm" htmlFor="reject-reason">
                {t("rejectionReason", "Rejection Reason")}
              </label>
              <Textarea
                id="reject-reason"
                maxLength={500}
                onChange={(event) => setReason(event.target.value)}
                placeholder={t(
                  "reasonPlaceholder",
                  "Explain why this withdrawal cannot be approved"
                )}
                rows={4}
                value={reason}
              />
              <span className="text-right text-muted-foreground text-xs">
                {reason.length}/500
              </span>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setRejectOpen(false)}
                type="button"
                variant="outline"
              >
                {t("cancel", "Cancel")}
              </Button>
              <Button
                disabled={reviewing !== undefined || !reason.trim()}
                type="submit"
                variant="destructive"
              >
                {reviewing === 2
                  ? t("reviewing", "Reviewing...")
                  : t("confirmReject", "Confirm Reject")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function WithdrawalPage() {
  const { t } = useTranslation("withdrawal");
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const tableRef = useRef<ProTableActions>(null);

  const statusOptions = [
    { label: t("status.pending", "Pending"), value: "0" },
    { label: t("status.approved", "Approved"), value: "1" },
    { label: t("status.rejected", "Rejected"), value: "2" },
  ];

  const initialFilters = {
    status:
      search.status === "0" || search.status === "1" || search.status === "2"
        ? search.status
        : undefined,
    user_id: search.user_id ? Number(search.user_id) : undefined,
  };

  const renderStatus = (status: number) => {
    if (status === 1) {
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-600">
          {t("status.approved", "Approved")}
        </Badge>
      );
    }
    if (status === 2) {
      return (
        <Badge variant="destructive">{t("status.rejected", "Rejected")}</Badge>
      );
    }
    return (
      <Badge
        className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300"
        variant="secondary"
      >
        {t("status.pending", "Pending")}
      </Badge>
    );
  };

  return (
    <ProTable<API.WithdrawalLog, WithdrawalFilters>
      action={tableRef}
      actions={{
        render(withdrawal) {
          if (withdrawal.status !== 0) {
            return [];
          }
          return [
            <ReviewActions
              key={withdrawal.id}
              onReviewed={() => tableRef.current?.refresh()}
              withdrawal={withdrawal}
            />,
          ];
        },
      }}
      columns={[
        {
          accessorKey: "user_id",
          header: t("user", "User"),
          cell: ({ row }) => <UserDetail id={row.original.user_id} />,
        },
        {
          accessorKey: "amount",
          header: t("amount", "Amount"),
          cell: ({ row }) => (
            <span className="font-semibold">
              <Display type="currency" value={row.original.amount} />
            </span>
          ),
        },
        {
          accessorKey: "content",
          header: t("withdrawalInfo", "Withdrawal Info"),
          cell: ({ row }) => (
            <div className="max-w-80 whitespace-pre-wrap break-all">
              {row.original.content || "-"}
            </div>
          ),
        },
        {
          accessorKey: "status",
          header: t("status.label", "Status"),
          cell: ({ row }) => renderStatus(row.original.status),
        },
        {
          accessorKey: "reason",
          header: t("rejectionReason", "Rejection Reason"),
          cell: ({ row }) => (
            <div className="max-w-64 whitespace-pre-wrap break-words text-muted-foreground">
              {row.original.reason || "-"}
            </div>
          ),
        },
        {
          accessorKey: "created_at",
          header: t("submittedAt", "Submitted At"),
          cell: ({ row }) => formatDate(row.original.created_at),
        },
        {
          accessorKey: "updated_at",
          header: t("reviewedAt", "Reviewed At"),
          cell: ({ row }) =>
            row.original.status === 0
              ? "-"
              : formatDate(row.original.updated_at),
        },
      ]}
      header={{ title: t("title", "Commission Management") }}
      initialFilters={initialFilters}
      key={JSON.stringify(initialFilters)}
      params={[
        {
          key: "status",
          options: statusOptions,
          placeholder: t("status.label", "Status"),
        },
        {
          key: "user_id",
          placeholder: t("userId", "User ID"),
        },
      ]}
      request={async (pagination, filters) => {
        const status = Number(filters.status);
        const userId = Number(filters.user_id);
        const params: API.getWithdrawalListParams = {
          page: pagination.page,
          size: pagination.size,
        };

        if (status === 0 || status === 1 || status === 2) {
          params.status = status;
        }
        if (Number.isSafeInteger(userId) && userId > 0) {
          params.user_id = userId;
        }

        const { data } = await getWithdrawalList(params);
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      texts={{ actions: t("actions", "Actions") }}
    />
  );
}
