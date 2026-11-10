"use client";

function Icon({ children, size = 16, strokeWidth = 2, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}
export const Bell = (p) => <Icon {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></Icon>;
export const Check = (p) => <Icon {...p}><path d="m5 12 4 4L19 6" /></Icon>;
export const ChevronLeft = (p) => <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>;
export const FileText = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8" /></Icon>;
export const MessageCircle = (p) => <Icon {...p}><path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" /></Icon>;
export const QrCode = (p) => <Icon {...p}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM20 14v3h-2v3h-4" /></Icon>;
export const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>;
