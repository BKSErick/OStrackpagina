import { Brandmark } from "@/components/Brandmark";

// Ported 1:1 from the OStrack app (src/components/Wordmark.jsx).
export function Wordmark({ size = 16, sub }) {
  return (
    <div className="flex items-center gap-[9px]">
      <span className="text-brand">
        <Brandmark size={size + 6} />
      </span>
      <div className="leading-[1.05]">
        <div
          className="font-semibold text-ink"
          style={{ fontSize: size, letterSpacing: "-0.3px" }}
        >
          OStrack
        </div>
        {sub && (
          <div
            className="mono text-mute"
            style={{ fontSize: 9, letterSpacing: "0.5px", marginTop: 2 }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
