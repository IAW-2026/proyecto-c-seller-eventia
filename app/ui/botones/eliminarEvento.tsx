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
      className="border border-black bg-white px-3 py-1 text-sm disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}