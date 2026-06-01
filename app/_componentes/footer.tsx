import Link from 'next/link';

const links = [
  { label: 'Inicio', href: '/' },
  { label: 'Mis Eventos', href: '/organizador/eventos' },
];

export default function Footer() {
  return (
    <footer className="px-8 pb-[30px] pt-[54px] sm:px-14" style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}>
      <div
        className="grid grid-cols-1 gap-[40px] pb-[34px] lg:grid-cols-[1.4fr_1fr_1fr_auto]"
        style={{ borderBottom: '1px solid var(--color-footer-border)', alignItems: 'start' }}
      >
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full" style={{ background: 'var(--color-accent)' }}>
              <span className="font-display text-[22px] leading-none" style={{ color: 'var(--color-primary)' }}>E</span>
            </span>
            <span className="font-display text-[22px] tracking-[0.01em]" style={{ color: 'var(--color-primary-foreground)' }}>
              Eventia
            </span>
          </div>
          <p className="font-body max-w-[300px] text-[14.5px] leading-[1.6]" style={{ color: 'var(--color-footer-muted)' }}>
            Elevando la experiencia de tus eventos con un diseño audaz y funcional.
          </p>
        </div>

        <div>
          <h2 className="font-label mb-4 text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: 'var(--color-footer-accent)' }}>
            Plataforma
          </h2>
          <div className="flex flex-col">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-body py-[6px] text-[14.5px] no-underline transition hover:translate-x-0.5"
                style={{ color: 'var(--color-footer-link)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="font-label pt-[22px] text-[13px]" style={{ color: 'rgba(255, 249, 234, 0.6)' }}>
        © 2026 Eventia. Todos los derechos reservados.
      </p>
    </footer>
  );
}
