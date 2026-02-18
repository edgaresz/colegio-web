import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  autoPlay?: boolean;
  intervalMs?: number;
};

export default function GalleryCarousel3D({
  images,
  autoPlay = true,
  intervalMs = 4200,
}: Props) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  const safeImages = useMemo(() => {
    if (images.length >= 5) return images;
    const doubled: string[] = [];
    while (doubled.length < 7) doubled.push(...images);
    return doubled.slice(0, 7);
  }, [images]);

  const n = safeImages.length;

  const go = (dir: number) => setActive((p) => (p + dir + n) % n);
  const goTo = (idx: number) => setActive(idx);

  useEffect(() => {
    if (!autoPlay || n <= 1) return;
    timerRef.current = window.setInterval(() => go(1), intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, intervalMs, n]);

  const pause = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  };
  const resume = () => {
    if (!autoPlay || n <= 1) return;
    timerRef.current = window.setInterval(() => go(1), intervalMs);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (!safeImages.length) return null;

  const rel = (i: number) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  return (
    <div className="w-full" onMouseEnter={pause} onMouseLeave={resume}>
      {/* ESCENA (altura fija, NO afecta header, NO deja huecos impredecibles) */}
      <div
        className="relative w-full h-[320px] sm:h-[360px] md:h-[400px] overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* sombra */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto h-10 w-[70%] rounded-full opacity-20 blur-2xl"
          style={{ background: "#7FB6E8" }}
        />

        {safeImages.map((src, i) => {
          const d = rel(i);
          if (Math.abs(d) > 3) return null;

          const x = d * 210;
          const z = Math.abs(d) === 0 ? 0 : -Math.min(420, 150 + Math.abs(d) * 120);
          const rotateY = d * -18;
          const scale = d === 0 ? 1 : 0.86 - Math.min(0.12, Math.abs(d) * 0.03);
          const opacity = d === 0 ? 1 : 0.72 - Math.min(0.35, Math.abs(d) * 0.12);

          const isActive = d === 0;

          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              className="absolute left-1/2 top-[80%] -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate3d(${x}px, -50%, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                transition: "transform 520ms cubic-bezier(.2,.9,.2,1), opacity 520ms",
                opacity,
                zIndex: 1000 - Math.abs(d),
              }}
              aria-label={isActive ? "Imagen activa" : "Ver imagen"}
            >
              <div
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm ${
                  isActive ? "border-[#7FB6E8]/45" : "border-[#F4A777]/20"
                }`}
                style={{
                  width: "min(520px, 78vw)",
                  height: "min(260px, 42vw)",
                  maxWidth: "520px",
                  maxHeight: "260px",
                }}
              >
                <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
              </div>
            </button>
          );
        })}
      </div>

      {/* CONTROLES (fuera de la escena, sin empujar nada raro) */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex items-center justify-center rounded-xl border border-[#7FB6E8]/30 bg-white/80 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-white transition"
          aria-label="Anterior"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          {safeImages.slice(0, Math.min(7, n)).map((_, i) => {
            const isOn = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  isOn ? "bg-[#7FB6E8]" : "bg-slate-300/70 hover:bg-slate-300"
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex items-center justify-center rounded-xl border border-[#7FB6E8]/30 bg-white/80 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-white transition"
          aria-label="Siguiente"
        >
          →
        </button>
      </div>
    </div>
  );
}