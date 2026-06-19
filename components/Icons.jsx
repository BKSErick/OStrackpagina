// Minimal line-icons, 1.6 stroke — consistent with the OStrack app aesthetic.
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const Icons = {
  inbox: (p) => (
    <svg {...base} {...p}>
      <path d="M3 12h5l1.5 3h5L16 12h5" />
      <path d="M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  search: (p) => (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  check: (p) => (
    <svg {...base} {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  wrench: (p) => (
    <svg {...base} {...p}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L4 17v3h3l5.4-5.3a4 4 0 0 0 5.3-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />
    </svg>
  ),
  layers: (p) => (
    <svg {...base} {...p}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  truck: (p) => (
    <svg {...base} {...p}>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  ),
  kanban: (p) => (
    <svg {...base} {...p}>
      <path d="M5 4v16M12 4v10M19 4v6" />
    </svg>
  ),
  file: (p) => (
    <svg {...base} {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  ),
  handshake: (p) => (
    <svg {...base} {...p}>
      <path d="m11 17 2 2a1.5 1.5 0 0 0 2-2" />
      <path d="m13 17 2.5 2.5a1.5 1.5 0 0 0 2-2L14 14" />
      <path d="M3 11 8 6l3 1 3-1 5 5" />
      <path d="M3 11v3l5 5" />
    </svg>
  ),
  portal: (p) => (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M8 21h8M12 18v3" />
    </svg>
  ),
  chart: (p) => (
    <svg {...base} {...p}>
      <path d="M4 4v16h16" />
      <path d="M8 14l3-4 3 2 4-6" />
    </svg>
  ),
  users: (p) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 6a3 3 0 0 1 0 5M21 20a6 6 0 0 0-4-5.6" />
    </svg>
  ),
  clock: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg {...base} width={18} height={18} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  brain: (p) => (
    <svg {...base} {...p}>
      <path d="M12 5.5a3 3 0 0 0-3 3v.2a2.6 2.6 0 0 0-1.4 4.6A2.6 2.6 0 0 0 9 18.2a2.1 2.1 0 0 0 3 .4 2.1 2.1 0 0 0 3-.4 2.6 2.6 0 0 0 1.4-4.9A2.6 2.6 0 0 0 15 8.7v-.2a3 3 0 0 0-3-3Z" />
      <path d="M12 6v13M9 9.5h.01M15 12h.01M9.5 15h.01" />
    </svg>
  ),
};
