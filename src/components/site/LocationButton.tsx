import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LocationButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 1500);
    const hideTimer = setTimeout(() => setShowTooltip(false), 6500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <div
        className="fixed z-50 group"
        style={{
          bottom: "calc(6rem + env(safe-area-inset-bottom))",
          right: "calc(1.5rem + env(safe-area-inset-right))",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("location.tooltip")}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent cursor-pointer"
        >
          <MapPin className="w-7 h-7" aria-hidden="true" />
        </button>

        <span
          className={`
            absolute right-full mr-3 top-1/2 -translate-y-1/2
            px-3 py-1.5 bg-background text-foreground text-sm
            rounded-lg shadow-md border border-gold/20 whitespace-nowrap
            pointer-events-none transition-all duration-300 ease-out
            ${
              showTooltip
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0"
            }
          `}
        >
          {t("location.tooltip")}
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-background border-gold/20 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-display text-2xl text-foreground">
              {t("location.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/Vcc6yQxWQiY"
                title={t("location.title")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
