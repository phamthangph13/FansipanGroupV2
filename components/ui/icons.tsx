import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "square",
    strokeLinejoin: "miter",
    "aria-hidden": true,
    ...props,
  };
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15" />
      <path d="M13.5 6.5L19 12l-5.5 5.5" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 12H5" />
      <path d="M10.5 6.5L5 12l5.5 5.5" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17L17.5 6.5" />
      <path d="M8.5 6.5h9v9" />
    </svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v15" />
      <path d="M6.5 13.5L12 19l5.5-5.5" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function AlertTriangle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4L2.5 20h19L12 4z" />
      <path d="M12 10.2v4.6" />
      <path d="M12 17.6h.01" />
    </svg>
  );
}

export function BookOpen(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 5.5c2.9 0 5.6.6 8.5 2 2.9-1.4 5.6-2 8.5-2v13c-2.9 0-5.6.6-8.5 2-2.9-1.4-5.6-2-8.5-2v-13z" />
      <path d="M12 7.5v13" />
    </svg>
  );
}

export function LayoutGrid(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="6.5" height="6.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" />
    </svg>
  );
}

export function RotateCcw(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5v5h5" />
      <path d="M4.6 10a8 8 0 102.1-5.4" />
    </svg>
  );
}

export function Minimize2(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4v5H4" />
      <path d="M15 4v5h5" />
      <path d="M9 20v-5H4" />
      <path d="M15 20v-5h5" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 6.5h18" />
      <path d="M3 12h18" />
      <path d="M3 17.5h18" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.5 3.5h-2A2 2 0 003.6 6.2 16.5 16.5 0 0017.8 20.4a2 2 0 002.7-1.9v-2.2a1.5 1.5 0 00-1.2-1.5l-3-.6a1.5 1.5 0 00-1.4.5l-1 1.1a12.5 12.5 0 01-4.7-4.7l1.1-1a1.5 1.5 0 00.5-1.4l-.6-3a1.5 1.5 0 00-1.5-1.2z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21.5S5 15.7 5 10a7 7 0 0114 0c0 5.7-7 11.5-7 11.5z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function Chat(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 4.5h14a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-8.5L5 20.5v-4a1.5 1.5 0 01-1.5-1.5V6A1.5 1.5 0 015 4.5z" />
    </svg>
  );
}

export function Send(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.7 18-3.8-7.2L3 10 21 3z" />
    </svg>
  );
}

export function FileText(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 3H6.5v18h11V8L14 3z" />
      <path d="M14 3v5h3.5" />
      <path d="M9.5 12.5h5" />
      <path d="M9.5 16h5" />
    </svg>
  );
}

export function Download(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5v11" />
      <path d="M7.5 10.5L12 15l4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

export function Upload(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 15.5V4.5" />
      <path d="M7.5 9L12 4.5 16.5 9" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

export function ExternalLink(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 6H5.5v12.5H18V13" />
      <path d="M14.5 3.5H20.5v6" />
      <path d="M20.5 3.5L11.5 12.5" />
    </svg>
  );
}

export function Maximize2(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9V4h5" />
      <path d="M20 9V4h-5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </svg>
  );
}

export function CheckCircle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.5l2.7 2.7 5.3-5.7" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Calendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5.5" width="16" height="15" />
      <path d="M4 10.5h16" />
      <path d="M8.5 3.5v4" />
      <path d="M15.5 3.5v4" />
    </svg>
  );
}

export function Briefcase(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="7.5" width="17" height="12.5" />
      <path d="M8.5 7.5V6a2 2 0 012-2h3a2 2 0 012 2v1.5" />
      <path d="M3.5 12.5h17" />
    </svg>
  );
}

export function User(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0113 0" />
    </svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 7.6-7.5 9.5-4.3-1.9-7.5-4.9-7.5-9.5V6L12 3z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function Award(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="9" r="5" />
      <path d="M9.2 13.4L7.5 21l4.5-2.5L16.5 21l-1.7-7.6" />
    </svg>
  );
}

export function Users(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0111 0" />
      <path d="M16.5 11a3 3 0 10-2.4-4.8" />
      <path d="M15.5 14.2c2.9.4 5 2 5 4.3" />
    </svg>
  );
}

export function Lightbulb(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3a6 6 0 00-3.5 10.9c.8.6 1.3 1.3 1.5 2.1h4c.2-.8.7-1.5 1.5-2.1A6 6 0 0012 3z" />
      <path d="M9.5 19h5" />
      <path d="M10.5 21.5h3" />
    </svg>
  );
}

export function Layers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 9L12 4.5 20.5 9 12 13.5 3.5 9z" />
      <path d="M3.5 14.5L12 19l8.5-4.5" />
    </svg>
  );
}

export function GraduationCap(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 9.5L12 4.5l9.5 5-9.5 5-9.5-5z" />
      <path d="M6.5 12v4c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4" />
      <path d="M21.5 9.5V15" />
    </svg>
  );
}

export function HardHat(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 17a7.5 7.5 0 0115 0" />
      <path d="M3 17.5h18" />
      <path d="M9.5 10V7.5a2.5 2.5 0 015 0V10" />
      <path d="M12 6.5V10" />
    </svg>
  );
}

export function Loader(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3a9 9 0 109 9" />
    </svg>
  );
}

export function ZoomIn(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
      <path d="M11 8.5v5" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

export function ZoomOut(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

export function FirstPage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M17 5l-7 7 7 7" />
      <path d="M7 5v14" />
    </svg>
  );
}

export function LastPage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 5l7 7-7 7" />
      <path d="M17 5v14" />
    </svg>
  );
}

export function Compass(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1z" />
    </svg>
  );
}

export function Home(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11.5L12 4.5l8 7" />
      <path d="M6.5 10v10h11V10" />
      <path d="M10.5 20v-5.5h3V20" />
    </svg>
  );
}

/* ── filled social glyphs (brand marks) ───────────────────── */

export function Facebook(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.3-1.4 1.5-1.4h1.4V5.5c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.3H8.5V14H11v7h2.5z" />
    </svg>
  );
}

export function LinkedIn(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M4.5 9h3.2v11H4.5V9zm1.6-4.5a1.85 1.85 0 110 3.7 1.85 1.85 0 010-3.7zM10 9h3v1.6c.5-.9 1.7-1.9 3.4-1.9 2.5 0 3.6 1.6 3.6 4.3V20h-3.2v-6c0-1.5-.5-2.5-1.8-2.5-1.4 0-2 1-2 2.5v6H10V9z" />
    </svg>
  );
}

export function YouTube(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden
      {...props}
    >
      <path d="M21 8.2a2.4 2.4 0 00-1.7-1.7C17.8 6 12 6 12 6s-5.8 0-7.3.5A2.4 2.4 0 003 8.2 25 25 0 002.6 12 25 25 0 003 15.8a2.4 2.4 0 001.7 1.7c1.5.5 7.3.5 7.3.5s5.8 0 7.3-.5a2.4 2.4 0 001.7-1.7A25 25 0 0021.4 12 25 25 0 0021 8.2zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}
