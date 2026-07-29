import { useTranslation } from "react-i18next";

export function WhatsAppButton() {
  const { t } = useTranslation();

  return (
    <div
      className="fixed z-50 group"
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        right: "calc(1.5rem + env(safe-area-inset-right))",
      }}
    >
      <a
        href="https://wa.me/41796902525"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Chat"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#25D366]"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.146.565 4.165 1.556 5.917L.054 23.5l6.02-1.576A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.137 16.323c-.25.705-1.449 1.385-1.997 1.466-.529.078-1.028.355-3.428-.737-2.9-1.285-4.727-4.49-4.872-4.702-.145-.212-1.16-1.547-1.16-2.95 0-1.403.732-2.09.993-2.375.261-.285.57-.37.76-.37.19 0 .38.002.546.01.166.01.388-.07.607.462.218.533.749 1.865.813 2.002.064.137.106.296.021.474-.085.178-.127.29-.254.445-.127.155-.268.324-.383.436-.127.124-.26.26-.113.51.147.25.65 1.07 1.395 1.732.958.85 1.767 1.113 2.02 1.238.252.125.4.106.547-.063.146-.168.632-.73.8-.98.168-.25.336-.208.566-.125.23.083 1.48.697 1.734.824.253.126.422.19.485.296.063.106.042.613-.208 1.318z" />
        </svg>
      </a>

      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background text-foreground text-sm rounded-lg shadow-md border border-gold/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
        {t("whatsapp.tooltip")}
      </span>
    </div>
  );
}
