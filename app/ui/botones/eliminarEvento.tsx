'use client';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export default function EliminarEventoButton({ onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:brightness-95 disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}