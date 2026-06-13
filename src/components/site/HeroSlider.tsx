import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface HeroSliderProps {
  slides: HeroSlide[];
  videoSrc?: string;
  audioSrc?: string;
  children?: React.ReactNode;
}

export function HeroSlider({ slides, videoSrc, audioSrc, children }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [slides.length]);

  const toggleSound = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) {
      a.muted = false;
      a.volume = 0.45;
      try { await a.play(); } catch { /* user gesture required first */ }
      setMuted(false);
    } else {
      a.muted = true;
      setMuted(true);
    }
  };

  const current = slides[index];

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background: video preferred, image fallback per slide */}
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {slides.map((s, i) => (
        <div
          key={s.image + i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms]"
          style={{
            backgroundImage: `url(${s.image})`,
            opacity: i === index ? (videoSrc ? 0.35 : 1) : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />

      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} loop preload="auto" muted />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-32 pb-10 min-h-[100svh] flex flex-col lg:grid lg:grid-cols-[1.2fr_minmax(320px,440px)] gap-8 lg:gap-12 items-center">
        <div className="text-center lg:text-left max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-gold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">{current.eyebrow}</p>
              <h1 className="font-[family-name:var(--font-balk-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-5 text-gradient-gold">
                {current.title}
              </h1>
              <p className="text-base sm:text-lg text-foreground/85 max-w-xl mx-auto lg:mx-0">{current.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="w-full max-w-md lg:max-w-none">{children}</div>
      </div>

      {/* Sound toggle */}
      {audioSrc && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Dschungel-Sound einschalten" : "Ton stummschalten"}
          className="absolute top-24 right-4 sm:right-6 z-20 flex items-center gap-2 rounded-full border border-gold/40 bg-background/50 backdrop-blur-md px-3 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-gold-foreground transition"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="hidden sm:inline">{muted ? "Sound" : "Mute"}</span>
        </button>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}