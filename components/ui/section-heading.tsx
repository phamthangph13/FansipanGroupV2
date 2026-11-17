import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  intro,
  action,
  light = false,
  align = "left",
  stacked = false,
  className,
}: {
  index?: string;
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  light?: boolean;
  align?: "left" | "center";
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "gap-x-12 gap-y-6",
          intro && !stacked
            ? "lg:grid lg:grid-cols-12 lg:items-end"
            : "",
          align === "center" && "text-center",
        )}
      >
        <h2
          className={cn(
            "display-2",
            intro && !stacked ? "lg:col-span-7" : "max-w-3xl",
            light ? "text-white" : "text-ink",
            align === "center" && "mx-auto max-w-3xl",
          )}
        >
          {title}
        </h2>
        {intro ? (
          <div
            className={cn(
              "mt-6 lg:mt-0",
              !stacked && "lg:col-span-5",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            <p className={cn("lead", light ? "text-white/70" : "text-ink-soft")}>{intro}</p>
            {action ? <div className="mt-7">{action}</div> : null}
          </div>
        ) : action ? (
          <div className={cn("mt-7", align === "center" && "flex justify-center")}>{action}</div>
        ) : null}
      </div>
    </div>
  );
}
