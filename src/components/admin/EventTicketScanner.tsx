import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, ScanLine } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { checkInEventTicket } from "@/lib/events.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { Btn, Input } from "@/components/admin/ui";

export function EventTicketScanner({ eventId, onCheckedIn }: { eventId?: string; onCheckedIn: () => void }) {
  const checkIn = useServerFn(checkInEventTicket);
  const [code, setCode] = useState("");
  const [camera, setCamera] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const video = useRef<HTMLVideoElement>(null);

  async function submit(value: string) {
    setBusy(true); setMessage("");
    try {
      const result = await checkIn({ data: { token: value, eventId, environment: getStripeEnvironment() } });
      if ("error" in result) throw new Error(result.error);
      setMessage(`Einlass bestätigt: ${result.name} · ${result.persons} Personen`);
      setCode(""); onCheckedIn();
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    if (!camera || !video.current) return;
    const element = video.current;
    let stopped = false;
    let controls: { stop: () => void } | undefined;
    void import("@zxing/browser").then(async ({ BrowserQRCodeReader }) => {
      if (stopped) return;
      controls = await new BrowserQRCodeReader().decodeFromVideoDevice(undefined, element, (result) => {
        if (!result || stopped) return;
        stopped = true;
        controls?.stop();
        setCamera(false);
        setCode(result.getText());
      });
      if (stopped) controls.stop();
    }).catch(() => { setMessage("Kamera nicht verfügbar. Ticket-Code eingeben."); setCamera(false); });
    return () => { stopped = true; controls?.stop(); };
  }, [camera]);

  return <div className="mt-4 border-y border-border py-4">
    <form className="flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); void submit(code); }}>
      <ScanLine size={20} aria-hidden="true" />
      <div className="min-w-48 flex-1"><Input aria-label="Ticket-Code oder Ticket-Link" placeholder="Ticket-Code oder Ticket-Link" value={code} onChange={(event) => setCode(event.target.value)} /></div>
      <Btn type="submit" disabled={!code.trim() || busy}>{busy ? "Prüft…" : "Einlass bestätigen"}</Btn>
      <Btn type="button" variant="ghost" onClick={() => setCamera(!camera)} title={camera ? "Kamera stoppen" : "QR-Ticket scannen"} aria-label={camera ? "Kamera stoppen" : "QR-Ticket scannen"}>{camera ? <CameraOff size={18} /> : <Camera size={18} />}</Btn>
    </form>
    {camera && <video ref={video} className="mt-3 aspect-video w-full max-w-sm object-cover" muted playsInline />}
    {message && <p role="status" className="mt-3 text-sm">{message}</p>}
  </div>;
}