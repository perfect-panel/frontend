import { formatDate } from "@/utils/common";

// 把 "2026/5/26 00:00:00" 拆成两行：日期 / 时间(灰色小字)
export function DateCell({ ts }: { ts?: number | null }) {
  if (!ts || ts <= 0) return null;
  const full = formatDate(ts) || "";
  const [date, time] = full.split(" ");
  return (
    <div className="flex flex-col leading-tight">
      <span>{date}</span>
      {time && <span className="text-muted-foreground text-xs">{time}</span>}
    </div>
  );
}
