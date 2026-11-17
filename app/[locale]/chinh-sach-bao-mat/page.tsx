import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/page-hero";
import { getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type Section = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

const copy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    updated: string;
    sections: Section[];
    contactTitle: string;
    contactBody: string;
  }
> = {
  vi: {
    eyebrow: "Chính sách bảo mật",
    title: "Chính sách bảo mật.",
    intro:
      "Trang này giải thích cách Fansipan Group thu thập, sử dụng và bảo vệ thông tin bạn gửi qua website, bao gồm yêu cầu báo giá và hồ sơ ứng tuyển.",
    updated: "Cập nhật lần cuối",
    sections: [
      {
        title: "1. Đơn vị xử lý dữ liệu",
        paragraphs: [
          "Dữ liệu cá nhân gửi qua website được xử lý bởi Công ty cổ phần Fansipan Group (FANSIPAN GROUP.,JSC), văn phòng tại C02-L18 An Vượng Villa, Dương Nội, Hà Nội.",
          "Mọi câu hỏi hoặc yêu cầu liên quan đến dữ liệu cá nhân có thể gửi đến email sales.fansipan@gmail.com hoặc hotline 0913 339 190.",
        ],
      },
      {
        title: "2. Phạm vi áp dụng",
        paragraphs: [
          "Chính sách này áp dụng cho dữ liệu được thu thập qua website fansipan-group.vn, bao gồm form yêu cầu báo giá, form ứng tuyển và các thông tin kỹ thuật phục vụ vận hành, bảo mật website.",
          "Chính sách không áp dụng cho website của bên thứ ba được liên kết từ website này.",
        ],
      },
      {
        title: "3. Thông tin chúng tôi thu thập",
        paragraphs: ["Tùy theo mục đích, chúng tôi có thể thu thập:"],
        items: [
          "Thông tin liên hệ và yêu cầu: họ tên, số điện thoại, email, tên công ty, lĩnh vực quan tâm và nội dung yêu cầu.",
          "Thông tin ứng tuyển: họ tên, số điện thoại, email, vị trí ứng tuyển, thư giới thiệu và tệp CV đính kèm.",
          "Thông tin kỹ thuật: địa chỉ IP được băm, thời điểm gửi và trạng thái xử lý, phục vụ kiểm soát spam và bảo mật hệ thống.",
        ],
      },
      {
        title: "4. Mục đích sử dụng",
        paragraphs: ["Thông tin được sử dụng để:"],
        items: [
          "Phản hồi yêu cầu báo giá, khảo sát hoặc tư vấn kỹ thuật.",
          "Liên hệ làm rõ phạm vi công việc và đề xuất bước tiếp theo.",
          "Xem xét hồ sơ ứng tuyển và liên hệ với ứng viên khi cần.",
          "Ngăn chặn spam, lạm dụng form và bảo vệ hệ thống website.",
        ],
      },
      {
        title: "5. Căn cứ xử lý và sự đồng ý",
        paragraphs: [
          "Khi gửi form, bạn chủ động cung cấp thông tin và đồng ý để Fansipan Group xử lý dữ liệu cho các mục đích nêu trên. Bạn có thể rút lại sự đồng ý bất kỳ lúc nào bằng cách liên hệ với chúng tôi.",
          "Việc rút lại sự đồng ý không ảnh hưởng đến tính hợp pháp của việc xử lý đã thực hiện trước thời điểm rút lại.",
        ],
      },
      {
        title: "6. Thời gian lưu trữ",
        paragraphs: [
          "Dữ liệu yêu cầu báo giá được lưu tối đa 24 tháng kể từ lần liên hệ gần nhất, trừ khi cần lưu lâu hơn để thực hiện hợp đồng hoặc theo yêu cầu của pháp luật.",
          "Dữ liệu ứng tuyển được lưu tối đa 12 tháng kể từ ngày nhận hồ sơ, trừ khi ứng viên đồng ý lưu lâu hơn cho các đợt tuyển dụng tiếp theo hoặc pháp luật có quy định khác.",
          "Khi hết thời hạn, dữ liệu được xóa hoặc ẩn danh hóa theo quy trình nội bộ.",
        ],
      },
      {
        title: "7. Chia sẻ dữ liệu",
        paragraphs: [
          "Fansipan Group không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ trong phạm vi cần thiết với nhà cung cấp dịch vụ email, lưu trữ hoặc hạ tầng website, hoặc khi có yêu cầu hợp pháp từ cơ quan có thẩm quyền.",
          "Các bên cung cấp dịch vụ chỉ được xử lý dữ liệu theo phạm vi cần thiết để cung cấp dịch vụ cho Fansipan Group.",
        ],
      },
      {
        title: "8. Bảo mật dữ liệu",
        paragraphs: [
          "Chúng tôi áp dụng các biện pháp phù hợp để hạn chế truy cập trái phép, mất mát hoặc thay đổi dữ liệu, bao gồm kiểm soát quyền truy cập khu vực quản trị và lưu trữ tệp CV trong thư mục nội bộ.",
          "Không có hệ thống nào an toàn tuyệt đối. Nếu phát hiện sự cố ảnh hưởng đến dữ liệu cá nhân, chúng tôi sẽ xử lý và thông báo theo quy định áp dụng.",
        ],
      },
      {
        title: "9. Quyền của bạn",
        paragraphs: ["Bạn có quyền:"],
        items: [
          "Yêu cầu truy cập, xem lại hoặc nhận bản sao dữ liệu cá nhân của mình.",
          "Yêu cầu chỉnh sửa thông tin không chính xác.",
          "Yêu cầu xóa dữ liệu hoặc hạn chế xử lý trong phạm vi pháp luật cho phép.",
          "Rút lại sự đồng ý hoặc phản đối việc xử lý dữ liệu.",
          "Khiếu nại với cơ quan có thẩm quyền về bảo vệ dữ liệu cá nhân.",
        ],
      },
      {
        title: "10. Cookie và công nghệ tương tự",
        paragraphs: [
          "Website sử dụng cookie cần thiết cho phiên quản trị và các chức năng vận hành cơ bản. Hiện tại website không sử dụng cookie quảng cáo hoặc theo dõi hành vi của bên thứ ba.",
          "Bạn có thể điều chỉnh cài đặt cookie trong trình duyệt; một số chức năng có thể không hoạt động đầy đủ nếu cookie cần thiết bị chặn.",
        ],
      },
      {
        title: "11. Thay đổi chính sách",
        paragraphs: [
          "Chính sách có thể được cập nhật khi quy trình vận hành hoặc quy định pháp luật thay đổi. Phiên bản mới sẽ được đăng trên trang này kèm ngày cập nhật.",
        ],
      },
    ],
    contactTitle: "Câu hỏi về dữ liệu cá nhân",
    contactBody:
      "Gửi yêu cầu đến email hoặc hotline của Fansipan Group. Chúng tôi sẽ phản hồi trong thời gian phù hợp theo quy định.",
  },
  en: {
    eyebrow: "Privacy policy",
    title: "Privacy policy.",
    intro:
      "This page explains how Fansipan Group collects, uses and protects the information you submit through this website, including quote requests and job applications.",
    updated: "Last updated",
    sections: [
      {
        title: "1. Data controller",
        paragraphs: [
          "Personal data submitted through this website is processed by Fansipan Group Joint Stock Company (FANSIPAN GROUP.,JSC), with its office at C02-L18 An Vuong Villa, Duong Noi, Hanoi.",
          "Questions or requests relating to personal data can be sent to sales.fansipan@gmail.com or our hotline 0913 339 190.",
        ],
      },
      {
        title: "2. Scope",
        paragraphs: [
          "This policy applies to data collected through fansipan-group.vn, including the quote request form, the job application form and technical information used for website security and operation.",
          "It does not apply to third-party websites linked from this site.",
        ],
      },
      {
        title: "3. Information we collect",
        paragraphs: ["Depending on the purpose, we may collect:"],
        items: [
          "Contact and enquiry information: name, phone number, email, company name, area of interest and message.",
          "Application information: name, phone number, email, position applied for, cover letter and attached CV.",
          "Technical information: hashed IP address, submission time and processing status, used for spam control and system security.",
        ],
      },
      {
        title: "4. How we use information",
        paragraphs: ["Information is used to:"],
        items: [
          "Respond to quote, survey or technical consultation requests.",
          "Clarify the scope of work and propose the next step.",
          "Review job applications and contact candidates when required.",
          "Prevent spam, form abuse and protect the website.",
        ],
      },
      {
        title: "5. Legal basis and consent",
        paragraphs: [
          "When you submit a form, you provide information voluntarily and agree that Fansipan Group may process it for the purposes described above. You can withdraw your consent at any time by contacting us.",
          "Withdrawal does not affect the lawfulness of processing carried out before the withdrawal.",
        ],
      },
      {
        title: "6. Retention",
        paragraphs: [
          "Enquiry data is kept for up to 24 months from the most recent contact, unless a longer period is required to perform a contract or by law.",
          "Application data is kept for up to 12 months from receipt, unless the candidate agrees to a longer period for future recruitment rounds or the law requires otherwise.",
          "At the end of the retention period, data is deleted or anonymised under our internal process.",
        ],
      },
      {
        title: "7. Sharing",
        paragraphs: [
          "Fansipan Group does not sell personal data. Data is shared only as necessary with email, storage or website infrastructure providers, or where required by a competent authority.",
          "Service providers may process data only to the extent needed to provide services to Fansipan Group.",
        ],
      },
      {
        title: "8. Security",
        paragraphs: [
          "We apply appropriate measures to limit unauthorised access, loss or alteration of data, including access control for the administration area and internal storage of CV files.",
          "No system is completely secure. If an incident affecting personal data is detected, we will handle and notify it in accordance with applicable rules.",
        ],
      },
      {
        title: "9. Your rights",
        paragraphs: ["You have the right to:"],
        items: [
          "Request access to, or a copy of, your personal data.",
          "Request correction of inaccurate information.",
          "Request deletion or restriction of processing to the extent permitted by law.",
          "Withdraw consent or object to processing.",
          "Complain to a competent data protection authority.",
        ],
      },
      {
        title: "10. Cookies and similar technologies",
        paragraphs: [
          "The website uses cookies necessary for the administration session and basic operation. We do not currently use advertising cookies or third-party behavioural tracking.",
          "You can adjust cookie settings in your browser; some functions may not work fully if necessary cookies are blocked.",
        ],
      },
      {
        title: "11. Changes to this policy",
        paragraphs: [
          "This policy may be updated when operational processes or legal requirements change. The new version will be published on this page with its update date.",
        ],
      },
    ],
    contactTitle: "Questions about personal data",
    contactBody:
      "Send your request to the Fansipan Group email or hotline. We will respond within a reasonable period in line with applicable rules.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.privacy,
    title: lang === "vi" ? "Chính sách bảo mật" : "Privacy policy",
    description:
      lang === "vi"
        ? "Chính sách bảo mật và xử lý dữ liệu cá nhân của Fansipan Group: thông tin thu thập, mục đích sử dụng, thời gian lưu trữ và quyền của bạn."
        : "Fansipan Group privacy and personal data policy: information collected, purposes, retention and your rights.",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const site = await getSite();
  const c = copy[locale];
  const updated = locale === "vi" ? "07/11/2026" : "07 Nov 2026";

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: locale === "vi" ? "Trang chủ" : "Home", href: `/${locale}` },
          { label: c.eyebrow },
        ]}
      >
        <p className="text-[0.8125rem] text-ink-soft">
          {c.updated}: {updated}
        </p>
      </PageHero>

      <section className="bg-white">
        <div className="wrap">
          <div className="card-enter relative aspect-[21/8] overflow-hidden bg-sky">
            <Image
              src="/images/about/plant.jpg"
              alt={
                locale === "vi"
                  ? "Công trình công nghiệp của Fansipan Group"
                  : "Fansipan Group industrial facility"
              }
              fill
              sizes="100vw"
              priority
              className="photo-drift object-cover"
            />
          </div>
        </div>
      </section>

      <article className="bg-white py-20 lg:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="space-y-12">
              {c.sections.map((section, index) => (
                <Fragment key={section.title}>
                  <section className="card-enter">
                    <h2 className="display-4 text-ink">{section.title}</h2>
                    <div className="mt-4 space-y-4">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 40)}
                          className="max-w-[68ch] text-[1rem] leading-[1.8] text-ink-soft"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {section.items ? (
                        <ul className="space-y-3 pt-1">
                          {section.items.map((item) => (
                            <li
                              key={item.slice(0, 40)}
                              className="flex max-w-[68ch] gap-3 text-[1rem] leading-[1.8] text-ink-soft"
                            >
                              <span aria-hidden className="mt-[0.72rem] h-px w-4 shrink-0 bg-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </section>
                  {index === 4 ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-sky">
                      <Image
                        src="/images/about/systems.jpg"
                        alt={
                          locale === "vi"
                            ? "Hệ thống kỹ thuật đang vận hành"
                            : "Technical systems in operation"
                        }
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="photo-drift object-cover"
                      />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-10 lg:sticky lg:top-32">
              <div className="card-enter">
                <p className="text-[1rem] font-semibold text-ink">{c.contactTitle}</p>
                <p className="mt-2 max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
                  {c.contactBody}
                </p>
                <div className="mt-5 space-y-2">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="block break-all text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {site.contact.email}
                  </a>
                  <a
                    href={`tel:${site.contact.hotline}`}
                    className="block text-[1rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {site.contact.hotlineDisplay}
                  </a>
                </div>
              </div>

              <div className="card-enter">
                <p className="text-[0.8125rem] text-ink-soft">{site.company.legalName[locale]}</p>
                <p className="mt-2 max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
                  {site.offices[0]?.address[locale]}
                </p>
                <Link href={`/${locale}${paths.contact}`} className="link-arrow mt-4">
                  {locale === "vi" ? "Trang liên hệ" : "Contact page"}
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="card-enter space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                  <Image
                    src="/images/about/team.jpg"
                    alt={
                      locale === "vi"
                        ? "Đội ngũ Fansipan Group"
                        : "The Fansipan Group team"
                    }
                    fill
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    className="photo-drift object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                  <Image
                    src="/images/about/cooling.jpg"
                    alt={
                      locale === "vi"
                        ? "Hệ thống tháp giải nhiệt"
                        : "Cooling tower system"
                    }
                    fill
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    className="photo-drift object-cover"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
