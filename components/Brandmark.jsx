// Concentric ring + checkpoint dot — represents tracking/orbit.
// Ported 1:1 from the OStrack app (src/components/Brandmark.jsx).
export function Brandmark({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <path
        d="M12 2.5 A 9.5 9.5 0 0 1 21.5 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="21.5" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}
