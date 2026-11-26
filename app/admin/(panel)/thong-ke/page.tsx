import { BarChart3, Eye, MonitorSmartphone, MousePointerClick, Users } from "lucide-react";
import { getAnalyticsSummary } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Thống kê truy cập" };

const deviceLabels: Record<string, string> = {
  mobile: "Điện thoại",
  tablet: "Máy tính bảng",
  desktop: "Máy tính",
  unknown: "Không xác định",
};

function Stat({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="flex size-8 items-center justify-center bg-brand-050 text-brand">
          {icon}
        </span>
      </div>
      <p className="num mt-4 text-[1.8rem] font-semibold leading-none tracking-[-0.04em] text-ink">
        {value}
      </p>
      <p className="mt-1.5 text-[0.78rem] font-medium text-ink-soft">{label}</p>
      <p className="mt-0.5 text-[0.68rem] text-muted">{note}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();
  const maxViews = Math.max(1, ...summary.days.map((day) => day.views));
  const topPageMax = Math.max(1, ...summary.topPages.map((page) => page.views));

  return (
    <div>
      <div>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
          Thống kê
        </p>
        <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
          Lượt truy cập website
        </h1>
        <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
          Số liệu được ghi nhận trực tiếp từ website, không dùng cookie và không lưu thông tin cá
          nhân. Mỗi phiên trình duyệt chỉ tính một lượt cho mỗi trang.
        </p>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Lượt xem hôm nay"
          value={summary.todayViews}
          note={`${summary.todayVisitors} khách trong ngày`}
          icon={<Eye className="size-4" strokeWidth={1.7} />}
        />
        <Stat
          label="Lượt xem 7 ngày"
          value={summary.last7Views}
          note="Tổng số trang đã mở"
          icon={<MousePointerClick className="size-4" strokeWidth={1.7} />}
        />
        <Stat
          label="Lượt xem 30 ngày"
          value={summary.last30Views}
          note="Tổng số trang đã mở"
          icon={<BarChart3 className="size-4" strokeWidth={1.7} />}
        />
        <Stat
          label="Khách truy cập"
          value={summary.totalVisitors}
          note={`${summary.totalViews} lượt xem tích luỹ`}
          icon={<Users className="size-4" strokeWidth={1.7} />}
        />
      </div>

      <section className="mt-6 border border-line bg-white">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[0.95rem] font-semibold text-ink">Lượt xem theo ngày</h2>
            <p className="mt-0.5 text-[0.7rem] text-muted">30 ngày gần nhất</p>
          </div>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted/60">
            Cao nhất {maxViews} lượt/ngày
          </p>
        </div>
        {summary.days.length ? (
          <div className="px-5 pb-5 pt-6">
            <div className="flex h-44 items-end gap-[3px]">
              {summary.days.map((day) => (
                <div key={day.date} className="group relative flex h-full flex-1 items-end">
                  <div
                    className="w-full bg-brand/75 transition-colors group-hover:bg-accent"
                    style={{
                      height: `${Math.max(day.views ? 4 : 1, (day.views / maxViews) * 100)}%`,
                    }}
                    title={`${formatDate(day.date, "vi")}: ${day.views} lượt xem · ${day.visitors.length} khách`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[0.56rem] text-muted/60">
              <span>{summary.days[0] ? formatDate(summary.days[0].date, "vi", "short") : ""}</span>
              <span>
                {summary.days.at(-1)
                  ? formatDate(summary.days.at(-1)!.date, "vi", "short")
                  : ""}
              </span>
            </div>
          </div>
        ) : (
          <p className="px-5 py-10 text-center text-[0.8rem] text-muted">
            Chưa có dữ liệu. Số liệu sẽ xuất hiện sau lượt truy cập đầu tiên.
          </p>
        )}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        <section className="border border-line bg-white xl:col-span-7">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[0.95rem] font-semibold text-ink">Trang được xem nhiều</h2>
            <p className="mt-0.5 text-[0.7rem] text-muted">Tích luỹ trong 30 ngày gần nhất</p>
          </div>
          {summary.topPages.length ? (
            <ul className="divide-y divide-line">
              {summary.topPages.map((page) => (
                <li key={page.path} className="px-5 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-mono text-[0.72rem] text-ink">{page.path}</p>
                    <span className="shrink-0 font-mono text-[0.66rem] text-muted">
                      {page.views}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 bg-cloud">
                    <div
                      className="h-full bg-brand/70"
                      style={{ width: `${(page.views / topPageMax) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-[0.8rem] text-muted">Chưa có dữ liệu.</p>
          )}
        </section>

        <div className="space-y-5 xl:col-span-5">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[0.95rem] font-semibold text-ink">Nguồn truy cập</h2>
            </div>
            {summary.topReferrers.length ? (
              <ul className="divide-y divide-line">
                {summary.topReferrers.map((item) => (
                  <li key={item.source} className="flex items-center justify-between gap-3 px-5 py-2.5">
                    <span className="truncate text-[0.76rem] text-ink-soft">
                      {item.source === "direct"
                        ? "Truy cập trực tiếp"
                        : item.source === "internal"
                          ? "Điều hướng nội bộ"
                          : item.source}
                    </span>
                    <span className="font-mono text-[0.66rem] text-muted">{item.views}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-8 text-center text-[0.78rem] text-muted">Chưa có dữ liệu.</p>
            )}
          </section>

          <section className="border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              <MonitorSmartphone className="size-4 text-brand" strokeWidth={1.7} />
              <h2 className="text-[0.95rem] font-semibold text-ink">Thiết bị &amp; ngôn ngữ</h2>
            </div>
            <div className="grid grid-cols-2 divide-x divide-line">
              <div className="p-5">
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted/60">
                  Thiết bị
                </p>
                <ul className="mt-2 space-y-1.5">
                  {summary.devices.length ? (
                    summary.devices.map((item) => (
                      <li key={item.device} className="flex justify-between gap-2 text-[0.74rem]">
                        <span className="text-ink-soft">
                          {deviceLabels[item.device] ?? item.device}
                        </span>
                        <span className="font-mono text-[0.66rem] text-muted">{item.views}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[0.74rem] text-muted">—</li>
                  )}
                </ul>
              </div>
              <div className="p-5">
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted/60">
                  Ngôn ngữ
                </p>
                <ul className="mt-2 space-y-1.5">
                  {summary.locales.length ? (
                    summary.locales.map((item) => (
                      <li key={item.locale} className="flex justify-between gap-2 text-[0.74rem]">
                        <span className="text-ink-soft">
                          {item.locale === "en" ? "English" : "Tiếng Việt"}
                        </span>
                        <span className="font-mono text-[0.66rem] text-muted">{item.views}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[0.74rem] text-muted">—</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
