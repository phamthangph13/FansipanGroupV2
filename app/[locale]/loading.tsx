export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="bg-white">
      <div className="bg-brand-050">
        <div className="wrap pt-36 pb-14 lg:pt-44 lg:pb-16">
          <div className="h-3 w-24 animate-pulse bg-brand-100" />
          <div className="mt-6 h-10 w-full max-w-2xl animate-pulse bg-brand-100" />
          <div className="mt-4 h-3 w-full max-w-lg animate-pulse bg-brand-100/80" />
          <div className="mt-2 h-3 w-full max-w-md animate-pulse bg-brand-100/80" />
        </div>
      </div>
      <div className="wrap py-14 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item}>
              <div className="aspect-[4/3] animate-pulse bg-sky-2" />
              <div className="mt-5 h-3 w-24 animate-pulse bg-line" />
              <div className="mt-3 h-4 w-full animate-pulse bg-line" />
              <div className="mt-2 h-4 w-4/5 animate-pulse bg-line" />
            </div>
          ))}
        </div>
        <span className="sr-only">Đang tải nội dung…</span>
      </div>
    </div>
  );
}
