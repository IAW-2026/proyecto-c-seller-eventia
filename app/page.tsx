import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Rocket, BarChart2, QrCode, ArrowRight, MapPin, Ticket, CalendarDays } from 'lucide-react';
import RetroPattern from '@/app/_componentes/retroPattern';
import BarraInicio from './_componentes/barraInicio';
import Footer from '@/app/_componentes/footer';

export const metadata: Metadata = {
  title: 'Eventia - Descubrí y creá eventos',
  description: 'La plataforma para organizar eventos y vender entradas de manera fácil y segura.',
};

export default function HomePage() {
  const createEventHref = '/organizador/eventos/nuevo';
  const primaryActionHref = '/organizador/eventos';

  return (
    // Fondo: dos radiales suaves + crema base, igual al mockup
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(900px 600px at 85% -5%, rgba(254, 158, 162, 0.22), transparent 60%),
          radial-gradient(700px 500px at -5% 30%, rgba(101, 0, 3, 0.05), transparent 55%),
          var(--color-surface-alt)
        `,
      }}
    >
      <BarraInicio />
      <HeroSection createEventHref={createEventHref} />
      <FeaturesSection />
      <CTABand primaryActionHref={primaryActionHref} />
      <Footer />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────────── */

function HeroSection({ createEventHref }: { createEventHref: string }) {
  return (
    <section className="grid min-h-[calc(100svh-72px)] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Columna izquierda: copy + CTA */}
      <div className="flex flex-col items-start justify-center gap-[22px] px-8 py-12 sm:px-14">
        <span
          className="font-label inline-flex items-center gap-2 rounded-full px-[14px] py-[7px] text-[11px] font-extrabold uppercase tracking-[0.14em]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
        >
          Bienvenido a Eventia
        </span>

        <h1
          className="font-display leading-[0.92] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(40px,6.2vw,78px)', color: 'var(--color-ink)' }}
        >
          Descubrí,{' '}
          <span style={{ color: 'var(--color-primary)' }}>creá</span>{' '}
          y viví los mejores <span style={{ color: 'var(--color-primary)' }}>eventos</span>
        </h1>

        <p className="font-body max-w-[430px] text-[18px] leading-[1.6]" style={{ color: 'var(--color-text-muted)' }}>
          La plataforma para organizar eventos, vender entradas y gestionar
          pagos de manera simple, segura y confiable.
        </p>

        <Link
          href={createEventHref}
          className="font-label inline-flex items-center gap-2 rounded-[14px] px-[22px] py-[12px] text-[14px] font-bold transition hover:-translate-y-px"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          <Plus size={17} />
          Crear evento
        </Link>
      </div>

      {/* Columna derecha: patrón + velo + card flotante */}
      <div className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
        {/* Patrón retro a sangre */}
        <RetroPattern id="hero" tile={92} />

        {/* Velo oxblood en los bordes para contraste */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(101, 0, 3, 0.28) 100%)',
          }}
        />

        {/* Wrapper relativo para las dos cards superpuestas */}
        <div className="relative z-10">
          {/* Card de evento principal */}
          <div
            className="w-[290px] overflow-hidden rounded-[22px] bg-white"
            style={{
              transform: 'rotate(-3deg)',
              boxShadow: 'var(--color-shadow-strong), 0 4px 16px rgba(0,0,0,0.10)',
            }}
          >
            {/* Imagen: patrón chico + velo + chip */}
            <div className="relative h-[140px] overflow-hidden">
              <RetroPattern id="card" tile={58} />
              <div className="absolute inset-0" style={{ background: 'rgba(101, 0, 3, 0.15)' }} />
              <span
                className="font-label absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]"
                style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
              >
                Destacado
              </span>
            </div>

            {/* Cuerpo de la card */}
            <div className="p-5">
              <h3 className="font-display mb-3 text-[22px] leading-[1.05]" style={{ color: 'var(--color-ink)' }}>
                Festival de Jazz
              </h3>

              <div className="mb-4 flex flex-col gap-[7px]">
                <div className="font-body flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                  <CalendarDays size={14} style={{ color: 'var(--color-primary)' }} />
                  Sáb 14 Jun · 20:00 hs
                </div>
                <div className="font-body flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                  <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                  Teatro Colón, Buenos Aires
                </div>
              </div>

              {/* Footer: precio + botón */}
              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: '1px solid var(--color-border-strong)' }}
              >
                <div>
                  <span className="font-label block text-[10px] opacity-60" style={{ color: 'var(--color-text-muted)' }}>desde</span>
                  <span className="font-display text-[22px] leading-none" style={{ color: 'var(--color-primary)' }}>$4.500</span>
                </div>
                <div
                  className="font-label flex items-center gap-[6px] rounded-[11px] px-4 py-2 text-[13px] font-bold text-white"
                  style={{ background: 'var(--color-primary)' }}
                  aria-hidden="true"
                >
                  <Ticket size={14} />
                  Comprar
                </div>
              </div>
            </div>
          </div>

          {/* Card de estadísticas — solapada abajo-izquierda, rotación opuesta */}
          <div
            className="absolute -bottom-8 -left-20 w-[196px] rounded-[18px] bg-white px-4 py-4"
            style={{
              transform: 'rotate(2.5deg)',
              boxShadow: 'var(--color-shadow-soft), 0 2px 10px rgba(0,0,0,0.09)',
              border: '1px solid var(--color-border-strong)',
            }}
          >
            <span
              className="font-label mb-[2px] block text-[10px] font-extrabold uppercase tracking-[0.14em]"
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Recaudación
            </span>
            <p className="font-display text-[26px] leading-none" style={{ color: 'var(--color-primary)' }}>
              $48.500
            </p>

            {/* Mini barchart */}
            <div className="mt-3 flex items-end gap-[4px]" style={{ height: 36 }}>
              {[22, 38, 28, 55, 42, 68, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-[3px]"
                  style={{
                    height: `${h * 0.4}px`,
                    background: i === 6 ? 'var(--color-primary)' : i >= 4 ? 'var(--color-pattern-dot)' : 'var(--color-pattern-bg)',
                  }}
                />
              ))}
            </div>

            <p className="font-label mt-[7px] text-[11px] font-semibold" style={{ color: '#16a34a' }}>
              ↑ 12% este mes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ──────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Rocket,
    iconBg: 'var(--color-primary)',
    tint: false,
    title: 'lanzamiento rápido',
    desc: 'Configurá la landing de tu evento en minutos con plantillas personalizables, listas para compartir.',
  },
  {
    icon: BarChart2,
    iconBg: 'var(--color-pattern-dot)',
    tint: true, // card con gradiente rosa → blanco
    title: 'métricas reales',
    desc: 'Controlá tus ventas y registros en tiempo real con un dashboard intuitivo, pensado para la acción.',
  },
  {
    icon: QrCode,
    iconBg: 'var(--color-primary)',
    tint: false,
    title: 'check-in inteligente',
    desc: 'Agilizá la entrada con escaneo de QR integrado: seguro, sin filas y extremadamente rápido.',
  },
];

function FeaturesSection() {
  return (
    <section
      className="relative px-8 py-[72px] sm:px-14"
      style={{
        background: `
          radial-gradient(700px 380px at 12% 0%, rgba(254,158,162,.18), transparent 62%),
          linear-gradient(180deg, #f9f3e4, #f3eddf)
        `,
      }}
    >
      {/* Textura de puntitos a baja opacidad */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-primary) 1.4px, transparent 1.4px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Encabezado centrado */}
      <div className="relative mx-auto mb-[44px] max-w-[560px] text-center">
        <span
          className="font-label mb-4 inline-flex items-center rounded-full px-[14px] py-[7px] text-[11px] font-extrabold uppercase tracking-[0.14em]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
        >
          Por qué Eventia
        </span>
        <h2
          className="font-display mt-4 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px,3.8vw,44px)', color: 'var(--color-ink)' }}
        >
          todo lo que tu evento necesita
        </h2>
        <p className="font-body mt-[14px] text-[16px] leading-[1.6]" style={{ color: 'var(--color-text-muted)' }}>
          De la idea a la puerta: armás, vendés y controlás desde un solo lugar.
        </p>
      </div>

      {/* Grid de 3 cards */}
      <div className="relative mx-auto grid max-w-[1000px] grid-cols-1 gap-[22px] sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, iconBg, tint, title, desc }) => (
          <div
            key={title}
            className="rounded-[24px] border p-[30px] transition hover:-translate-y-1"
            style={{
              background: tint
                ? 'linear-gradient(180deg, rgba(254, 158, 162, 0.22), var(--color-surface))'
                : 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              boxShadow: 'var(--color-shadow)',
            }}
          >
            {/* Ícono con tile de color */}
            <div
              className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[15px] text-white"
              style={{ background: iconBg }}
            >
              <Icon size={26} strokeWidth={1.7} />
            </div>
            <h3 className="font-display mb-[10px] text-[24px] leading-[1.05]" style={{ color: 'var(--color-ink)' }}>
              {title}
            </h3>
            <p className="font-body text-[14.5px] leading-[1.6]" style={{ color: 'var(--color-text-muted)' }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── BANDA CTA ─────────────────────────────────────────────────────────────── */

function CTABand({ primaryActionHref }: { primaryActionHref: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Patrón retro de fondo (tile más grande para la banda) */}
      <RetroPattern id="cta" tile={120} />

      {/* Velo oxblood encima para dar contraste al texto blanco */}
      <div
        className="relative z-10 flex flex-col items-center gap-[20px] px-6 py-[76px] text-center"
        style={{ background: 'radial-gradient(120% 120% at 50% 50%, rgba(101, 0, 3, 0.04), rgba(101, 0, 3, 0.55))' }}
      >
        <h2
          className="font-display max-w-[680px] leading-[1] tracking-[-0.01em] text-white"
          style={{ fontSize: 'clamp(30px,4.4vw,52px)', textShadow: '0 2px 24px rgba(101,0,3,.4)' }}
        >
          creá tu próximo evento hoy
        </h2>
        <p className="font-body max-w-[460px] text-[17px] leading-[1.55]" style={{ color: 'rgba(255,249,234,0.92)' }}>
          Sumate a quienes ya gestionan sus entradas con Eventia. Gratis para empezar.
        </p>
        <Link
          href={primaryActionHref}
          className="font-label inline-flex items-center gap-2 rounded-[14px] px-[22px] py-[12px] text-[14px] font-bold transition hover:brightness-95 hover:-translate-y-px"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
        >
          <ArrowRight size={17} />
          Empezar ahora
        </Link>
      </div>
    </section>
  );
}

