import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "de";
  const setLang = (l: "de" | "en") => {
    i18n.changeLanguage(l);
    if (typeof window !== "undefined") localStorage.setItem("amaya-lang", l);
  };
  return (
    <div className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase">
      <button
        onClick={() => setLang("de")}
        className={current === "de" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
        aria-pressed={current === "de"}
      >
        DE
      </button>
      <span className="text-muted-foreground/50">/</span>
      <button
        onClick={() => setLang("en")}
        className={current === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
        aria-pressed={current === "en"}
      >
        EN
      </button>
    </div>
  );
}