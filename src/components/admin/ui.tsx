import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl text-[#0D2517]">{title}</h1>
        {subtitle && <p className="text-black/60 mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border border-black/10 p-6 shadow-sm ${className}`}>{children}</div>;
}

export function Btn({ children, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-[#0D2517] text-[#F3E7D7] hover:bg-[#143020]",
    ghost: "bg-transparent text-[#0D2517] border border-[#0D2517]/20 hover:bg-[#0D2517]/5",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];
  return <button {...props} className={`px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50 ${styles} ${props.className ?? ""}`}>{children}</button>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-white border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0D2517] ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-white border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0D2517] ${props.className ?? ""}`} />;
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs tracking-[0.25em] uppercase text-black/60 mb-1.5">{children}</label>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}
