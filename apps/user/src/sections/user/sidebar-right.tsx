"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Sidebar, SidebarContent } from "@workspace/ui/components/sidebar";
import { Icon } from "@workspace/ui/composed/icon";
import { isBrowser } from "@workspace/ui/utils/index";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import Recharge from "@/sections/subscribe/recharge";
import { useGlobalStore } from "@/stores/global";

// V4.3 第二档改造:右侧栏建立主从关系
//   - 账户余额 = Hero 卡(主色背景 + 大字 + 充值 CTA)
//   - 赠送金额 + 佣金 = 2 列辅助小卡(信息 secondary,不抢焦点)
//   - 邀请码 = 单独卡 + 文案改"邀请好友赚返利"(给行动动机)
export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useGlobalStore();
  const { t } = useTranslation("layout");

  return (
    <Sidebar collapsible="none" side="right" {...props}>
      <SidebarContent className="gap-3 *:gap-0 *:py-0">
        {/* Hero 卡:账户余额 — 主色渐变背景 + 32px 大字 + 充值 CTA */}
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
            <CardTitle className="flex items-center gap-1.5 font-medium text-sm">
              <Icon className="size-4 text-primary" icon="uil:wallet" />
              {t("accountBalance", "Account Balance")}
            </CardTitle>
            <Recharge className="h-7 px-2 text-xs" variant="default" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="font-bold text-3xl text-primary tabular-nums">
              <Display type="currency" value={user?.balance} />
            </div>
          </CardContent>
        </Card>

        {/* 辅助卡:赠送 + 佣金 — 2 列小卡,字号缩到 base,不抢主体 */}
        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="space-y-0.5 p-3">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Icon className="size-3" icon="uil:gift" />
                {t("giftAmount", "Gift")}
              </div>
              <div className="font-semibold text-base tabular-nums">
                <Display type="currency" value={user?.gift_amount} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-0.5 p-3">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Icon className="size-3" icon="uil:money-bill" />
                {t("commission", "Commission")}
              </div>
              <div className="font-semibold text-base tabular-nums">
                <Display type="currency" value={user?.commission} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 邀请码:单独卡 + "邀请好友赚返利"文案给行动动机 + 一键复制 CTA */}
        {user?.refer_code && (
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
            <CardHeader className="space-y-0 p-3 pb-1.5">
              <CardTitle className="flex items-center gap-1.5 font-medium text-sm">
                <Icon
                  className="size-4 text-amber-600 dark:text-amber-400"
                  icon="uil:gift"
                />
                {t("inviteEarnTitle", "邀请好友赚返利")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <div className="rounded-md border border-amber-500/20 bg-background/60 p-1.5 font-mono font-semibold text-sm">
                {user.refer_code}
              </div>
              <CopyToClipboard
                onCopy={(_text: string, result: boolean) => {
                  if (result) {
                    toast.success(t("copySuccess", "邀请链接已复制"));
                  }
                }}
                text={`${isBrowser() && location?.origin}/#/auth?invite=${user?.refer_code}`}
              >
                <Button
                  className="h-8 w-full gap-1.5 bg-amber-500 hover:bg-amber-600"
                  size="sm"
                >
                  <Icon className="size-3.5" icon="mdi:content-copy" />
                  {t("copyInviteLink", "复制邀请链接")}
                </Button>
              </CopyToClipboard>
            </CardContent>
          </Card>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
