import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  createUser,
  deleteUser,
  getUserDetail,
  getUserList,
  updateUserBasicInfo,
} from "@workspace/ui/services/admin/user";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import { formatDate } from "@/utils/common";
import { UserDetail } from "./user-detail";
import UserForm from "./user-form";
import { AuthMethodsForm } from "./user-profile/auth-methods-form";
import { BasicInfoForm } from "./user-profile/basic-info-form";
import { NotifySettingsForm } from "./user-profile/notify-settings-form";
import UserSubscription from "./user-subscription";

export default function User() {
  const { t } = useTranslation("user");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;

  const { subscribes } = useSubscribe();

  const initialFilters = {
    search: sp.search || undefined,
    user_id: sp.user_id || undefined,
    subscribe_id: sp.subscribe_id || undefined,
    user_subscribe_id: sp.user_subscribe_id || undefined,
  };

  return (
    <ProTable<API.User, API.GetUserListParams>
      action={ref}
      actions={{
        render: (row) => [
          <ProfileSheet
            key="profile"
            onUpdated={() => ref.current?.refresh()}
            userId={row.id}
          />,
          <SubscriptionSheet key="subscription" userId={row.id} />,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteDescription",
              "This action cannot be undone."
            )}
            key="edit"
            onConfirm={async () => {
              await deleteUser({ id: row.id });
              toast.success(t("deleteSuccess", "Deleted successfully"));
              ref.current?.refresh();
            }}
            title={t("confirmDelete", "Confirm Delete")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
          <DropdownMenu key="more" modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{t("more", "More")}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  search={{ user_id: String(row.id) }}
                  to="/dashboard/order"
                >
                  {t("orderList", "Order List")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  search={{ user_id: String(row.id) }}
                  to="/dashboard/log/login"
                >
                  {t("loginLogs", "Login Logs")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  search={{ user_id: String(row.id) }}
                  to="/dashboard/log/balance"
                >
                  {t("balanceLogs", "Balance Logs")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  search={{ user_id: String(row.id) }}
                  to="/dashboard/log/commission"
                >
                  {t("commissionLogs", "Commission Logs")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  search={{ user_id: String(row.id) }}
                  to="/dashboard/log/gift"
                >
                  {t("giftLogs", "Gift Logs")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
        ],
      }}
      columns={[
        {
          accessorKey: "enable",
          header: t("enable", "Enable"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("enable")}
              onCheckedChange={async (checked) => {
                const {
                  auth_methods: _auth_methods,
                  user_devices: _user_devices,
                  enable_balance_notify: _enable_balance_notify,
                  enable_login_notify: _enable_login_notify,
                  enable_subscribe_notify: _enable_subscribe_notify,
                  enable_trade_notify: _enable_trade_notify,
                  updated_at: _updated_at,
                  created_at: _created_at,
                  id,
                  ...rest
                } = row.original;
                await updateUserBasicInfo({
                  user_id: id,
                  ...rest,
                  enable: checked,
                } as unknown as API.UpdateUserBasiceInfoRequest);
                toast.success(t("updateSuccess", "Updated successfully"));
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "id",
          header: "ID",
        },
        {
          accessorKey: "deleted_at",
          header: t("isDeleted", "Deleted"),
          cell: ({ row }) => {
            const deletedAt = row.getValue("deleted_at") as number | undefined;
            return deletedAt ? (
              <Badge variant="destructive">{t("deleted", "Deleted")}</Badge>
            ) : (
              <Badge variant="outline">{t("normal", "Normal")}</Badge>
            );
          },
        },
        {
          accessorKey: "auth_methods",
          header: t("userName", "Username"),
          cell: ({ row }) => {
            const method = row.original.auth_methods?.[0];
            return (
              <div>
                <Badge
                  className="mr-1 uppercase"
                  title={method?.verified ? t("verified", "Verified") : ""}
                >
                  {method?.auth_type}
                </Badge>
                {method?.auth_identifier}
              </div>
            );
          },
        },
        {
          accessorKey: "balance",
          header: t("balance", "Balance"),
          cell: ({ row }) => (
            <Display type="currency" value={row.getValue("balance")} />
          ),
        },
        {
          accessorKey: "gift_amount",
          header: t("giftAmount", "Gift Amount"),
          cell: ({ row }) => (
            <Display type="currency" value={row.getValue("gift_amount")} />
          ),
        },
        {
          accessorKey: "commission",
          header: t("commission", "Commission"),
          cell: ({ row }) => (
            <Display type="currency" value={row.getValue("commission")} />
          ),
        },
        {
          accessorKey: "refer_code",
          header: t("inviteCode", "Invite Code"),
          cell: ({ row }) => row.getValue("refer_code") || "--",
        },
        {
          accessorKey: "referer_id",
          header: t("referer", "Referer"),
          cell: ({ row }) => <UserDetail id={row.original.referer_id} />,
        },
        {
          accessorKey: "created_at",
          header: t("createdAt", "Created At"),
          cell: ({ row }) => formatDate(row.getValue("created_at")),
        },
      ]}
      header={{
        title: t("userList", "User List"),
        toolbar: (
          <UserForm<API.CreateUserRequest>
            key="create"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createUser(values);
                toast.success(t("createSuccess", "Created successfully"));
                ref.current?.refresh();
                setLoading(false);

                return true;
              } catch {
                setLoading(false);

                return false;
              }
            }}
            title={t("createUser", "Create User")}
            trigger={t("create", "Create")}
          />
        ),
      }}
      initialFilters={initialFilters}
      key={initialFilters.user_id}
      params={[
        {
          key: "subscribe_id",
          placeholder: t("subscription", "Subscription"),
          options: subscribes?.map((item) => ({
            label: item.name!,
            value: String(item.id!),
          })),
        },
        {
          key: "search",
          placeholder: "Search",
        },
        {
          key: "user_id",
          placeholder: t("userId", "User ID"),
        },
        {
          key: "user_subscribe_id",
          placeholder: t("subscriptionId", "Subscription ID"),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getUserList({
          ...pagination,
          ...filter,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}

function ProfileSheet({
  userId,
  onUpdated,
}: {
  userId: number;
  onUpdated?: () => void;
}) {
  const { t } = useTranslation("user");
  const [open, setOpen] = useState(false);
  const { data: user, refetch } = useQuery({
    enabled: open,
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await getUserDetail({ id: userId });
      return data.data as API.User;
    },
  });

  const refetchAll = async () => {
    await refetch();
    onUpdated?.();
    return Promise.resolve();
  };
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="default">{t("edit", "Edit")}</Button>
      </SheetTrigger>
      <SheetContent
        className="w-[700px] max-w-full md:max-w-screen-lg"
        side="right"
      >
        <SheetHeader>
          <SheetTitle>
            {t("userProfile", "User Profile")} · ID: {userId}
          </SheetTitle>
        </SheetHeader>
        {user && (
          <ScrollArea className="h-[calc(100dvh-140px)] p-2">
            <Tabs defaultValue="basic">
              <TabsList className="mb-3">
                <TabsTrigger value="basic">
                  {t("basicInfoTitle", "Basic Info")}
                </TabsTrigger>
                <TabsTrigger value="notify">
                  {t("notifySettingsTitle", "Notify Settings")}
                </TabsTrigger>
                <TabsTrigger value="auth">
                  {t("authMethodsTitle", "Auth Methods")}
                </TabsTrigger>
              </TabsList>
              <TabsContent className="mt-0" value="basic">
                <BasicInfoForm refetch={refetchAll} user={user} />
              </TabsContent>
              <TabsContent className="mt-0" value="notify">
                <NotifySettingsForm refetch={refetchAll} user={user} />
              </TabsContent>
              <TabsContent className="mt-0" value="auth">
                <AuthMethodsForm refetch={refetchAll} user={user} />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SubscriptionSheet({ userId }: { userId: number }) {
  const { t } = useTranslation("user");
  const [open, setOpen] = useState(false);
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="secondary">{t("subscription", "Subscription")}</Button>
      </SheetTrigger>
      <SheetContent className="w-[1000px] max-w-full md:max-w-7xl" side="right">
        <SheetHeader>
          <SheetTitle>
            {t("subscriptionList", "Subscription List")} · ID: {userId}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-2 px-4">
          <UserSubscription userId={userId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
