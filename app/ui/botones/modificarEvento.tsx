'use client';

type Props = {
  onClick: () => void;
};

export default function ModificarEventoButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-black bg-white px-3 py-1 text-sm"
    >
      Modificar
    </button>
  );
}