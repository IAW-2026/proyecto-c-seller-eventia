'use client';

type Props = {
  onClick: () => void;
};

export default function ModificarEventoButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-full border border-[rgba(101,0,3,0.18)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[rgba(101,0,3,0.04)]"
    >
      Modificar
    </button>
  );
}