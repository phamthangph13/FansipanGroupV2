"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Close, FileText, Loader } from "@/components/ui/icons";
import { submitApplication } from "@/app/actions/application";
import { initialActionState } from "@/lib/form-types";
import { paths, ui, type Locale } from "@/lib/i18n";
import { cn, humanFileSize } from "@/lib/utils";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[0.8125rem] leading-snug text-danger" role="alert">
      {message}
    </p>
  );
}

export function ApplicationForm({
  locale,
  jobSlug,
  jobTitle,
}: {
  locale: Locale;
  jobSlug: string;
  jobTitle: string;
}) {
  const t = ui[locale];
  const [state, formAction, pending] = useActionState(submitApplication, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const armTimer = () => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  };

  useEffect(() => {
    armTimer();
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      setFile(null);
      setFileError(null);
      formRef.current?.reset();
      armTimer();
    }
  }, [state.status]);

  const checkFile = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      setFileError(null);
      return;
    }
    const extension = selected.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
      setFile(null);
      setFileError(t.forms.errorFile);
      return;
    }
    if (selected.size > MAX_SIZE) {
      setFile(null);
      setFileError(t.forms.errorFile);
      return;
    }
    setFile(selected);
    setFileError(null);
  };

  if (state.status === "success") {
    return (
      <div className="bg-brand-050 p-7 sm:p-9">
        <h3 className="display-4 text-ink">
          {locale === "vi" ? "Hồ sơ đã được gửi." : "Application received."}
        </h3>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{state.message}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href={`/${locale}${paths.careers}`} className="btn btn-primary btn-sm">
            {t.actions.backToCareers}
            <ArrowRight className="size-4" />
          </Link>
          <Link href={`/${locale}`} className="link-arrow">
            {locale === "vi" ? "Về trang chủ" : "Back to home"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-brand-050 p-6 sm:p-8"
      noValidate
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="display-4 text-ink">
          {locale === "vi" ? "Gửi hồ sơ của bạn" : "Send your application"}
        </h3>
        <span className="text-[0.8125rem] text-ink">
          {locale === "vi" ? "* Bắt buộc" : "* Required"}
        </span>
      </div>

      {state.status === "error" ? (
        <div
          role="alert"
          aria-live="polite"
          className="mt-5 text-[1rem] leading-relaxed text-danger"
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="apply-name">
            {t.forms.name} <span className="req">*</span>
          </label>
          <input
            id="apply-name"
            name="name"
            className="input"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(state.errors.name)}
            aria-describedby={state.errors.name ? "apply-name-error" : undefined}
          />
          <span id="apply-name-error">
            <FieldError message={state.errors.name} />
          </span>
        </div>

        <div className="field">
          <label htmlFor="apply-phone">
            {t.forms.phone} <span className="req">*</span>
          </label>
          <input
            id="apply-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            autoComplete="tel"
            required
            pattern="[0-9+\s().-]{8,20}"
            aria-invalid={Boolean(state.errors.phone)}
            aria-describedby={state.errors.phone ? "apply-phone-error" : undefined}
          />
          <span id="apply-phone-error">
            <FieldError message={state.errors.phone} />
          </span>
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor="apply-email">
            {t.forms.email} <span className="req">*</span>
          </label>
          <input
            id="apply-email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            required
            aria-invalid={Boolean(state.errors.email)}
            aria-describedby={state.errors.email ? "apply-email-error" : undefined}
          />
          <span id="apply-email-error">
            <FieldError message={state.errors.email} />
          </span>
        </div>

        <div className="field sm:col-span-2">
          <span className="field-label">{t.forms.position}</span>
          <p className="text-[1rem] font-semibold text-ink">{jobTitle}</p>
          <input type="hidden" name="jobSlug" value={jobSlug} />
          <FieldError message={state.errors.jobSlug} />
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor="apply-cover">
            {t.forms.coverLetter}{" "}
            <span className="font-normal text-ink-soft">({t.labels.optional})</span>
          </label>
          <textarea
            id="apply-cover"
            name="coverLetter"
            className="textarea"
            placeholder={t.forms.coverLetterPlaceholder}
            maxLength={3000}
            aria-invalid={Boolean(state.errors.coverLetter)}
          />
          <FieldError message={state.errors.coverLetter} />
        </div>

        <div className="field sm:col-span-2">
          <span className="field-label">
            {t.forms.cv} <span className="req">*</span>
          </span>
          <div
            className={cn(
              "relative bg-white p-4 transition-colors",
              fileError || state.errors.cv ? "text-danger" : "hover:bg-sky",
            )}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <FileText className="size-5 shrink-0 text-muted" strokeWidth={1.6} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[1rem] text-ink">{file.name}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-soft">
                    {humanFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="flex size-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
                  aria-label={locale === "vi" ? "Bỏ tệp đã chọn" : "Remove selected file"}
                >
                  <Close className="size-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="apply-cv"
                className="flex cursor-pointer flex-col gap-1 py-2"
              >
                <span className="text-[1rem] text-ink">
                  {locale === "vi" ? "Chọn tệp CV để tải lên" : "Choose a CV file to upload"}
                </span>
                <span className="text-[0.8125rem] text-ink-soft">{t.forms.cvHint}</span>
              </label>
            )}
            <input
              ref={fileRef}
              id="apply-cv"
              name="cv"
              type="file"
              accept={ACCEPT}
              required
              onChange={(event) => checkFile(event.target.files?.[0] ?? null)}
              className={cn(
                "absolute inset-0 h-full w-full cursor-pointer opacity-0",
                file && "pointer-events-none",
              )}
              aria-invalid={Boolean(fileError || state.errors.cv)}
              aria-describedby={fileError || state.errors.cv ? "apply-cv-error" : undefined}
            />
          </div>
          <span id="apply-cv-error">
            <FieldError message={fileError ?? state.errors.cv} />
          </span>
        </div>
      </div>

      <div className="mt-5">
        <label className="checkbox-row">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(state.errors.consent)}
          />
          <span>
            {t.forms.consentApply}{" "}
            <Link
              href={`/${locale}${paths.privacy}`}
              className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {t.forms.privacy}
            </Link>
            .
          </span>
        </label>
        <FieldError message={state.errors.consent} />
      </div>

      <input type="hidden" name="locale" value={locale} />
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="" />
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="apply-website">Website</label>
        <input id="apply-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full">
        {pending ? (
          <>
            <Loader className="size-4 animate-spin" />
            {t.forms.sending}
          </>
        ) : (
          <>
            {t.actions.sendApplication}
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-[0.8125rem] leading-relaxed text-ink">
        {locale === "vi"
          ? "Hồ sơ được lưu trong hệ thống tuyển dụng nội bộ và chỉ sử dụng cho mục đích xem xét ứng tuyển."
          : "Your application is stored in our internal recruitment system and used only for recruitment purposes."}
      </p>
    </form>
  );
}
