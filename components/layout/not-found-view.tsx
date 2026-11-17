import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/i18n";

const copy = {
  vi: {
    code: "Lỗi 404",
    title: "Không tìm thấy trang",
    body: "Đường dẫn có thể đã thay đổi, bị xoá hoặc không tồn tại. Bạn có thể quay về trang chủ hoặc tiếp tục xem các dự án và dịch vụ của Fansipan Group.",
    home: "Về trang chủ",
    projects: "Xem dự án",
    contact: "Liên hệ",
    hint: "Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ hotline để được hỗ trợ.",
    photo: "Đội ngũ kỹ thuật Fansipan Group tại công trình",
    gallery: [
      "Hệ thống tháp giải nhiệt và đường ống tại nhà máy",
      "Kỹ thuật viên vận hành thiết bị HVAC",
      "Tủ điện và hệ thống điều khiển tại công trình",
    ],
  },
  en: {
    code: "Error 404",
    title: "Page not found",
    body: "The link may have changed, been removed or never existed. You can return to the homepage or continue exploring Fansipan Group's projects and services.",
    home: "Back to home",
    projects: "View projects",
    contact: "Contact us",
    hint: "If you believe this is a mistake, please contact our hotline for assistance.",
    photo: "Fansipan Group engineering team on site",
    gallery: [
      "Cooling towers and pipework at an industrial plant",
      "HVAC technician operating equipment",
      "Switchgear and control systems on site",
    ],
  },
} as const;

const gallery = [
  "/images/about/cooling.jpg",
  "/images/careers/technicians.jpg",
  "/images/about/systems.jpg",
] as const;

export function NotFoundView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <section className="bg-brand-050">
      <div className="wrap pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="card-enter grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p
              aria-hidden
              className="num font-display text-[6rem] leading-none tracking-[-0.05em] text-brand-200 sm:text-[8rem]"
            >
              404
            </p>
            <h1 className="display-1 mt-3 text-ink">{c.title}</h1>
            <p className="lead mt-6 max-w-xl">{c.body}</p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <Link href={`/${locale}`} className="btn btn-primary card-enter">
                <ArrowLeft className="size-4" />
                {c.home}
              </Link>
              <Link href={`/${locale}/du-an`} className="btn btn-outline card-enter">
                {c.projects}
                <ArrowRight className="size-4" />
              </Link>
              <Link href={`/${locale}/lien-he`} className="btn btn-outline card-enter">
                {c.contact}
              </Link>
            </div>

            <p className="card-enter mt-10 max-w-lg text-[0.8125rem] leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">{c.code}.</span> {c.hint}{" "}
              {ui[locale].labels.hotline} · 0913 339 190
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="card-enter photo-drift relative aspect-[4/5] overflow-hidden bg-sky">
              <Image
                src="/images/about/team.jpg"
                alt={c.photo}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {gallery.map((src, index) => (
            <div
              key={src}
              className="card-enter photo-drift relative aspect-[4/3] overflow-hidden bg-sky-2"
            >
              <Image
                src={src}
                alt={c.gallery[index]}
                fill
                sizes="(min-width: 640px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
