type CrearEventoButtonProps = {
  loading?: boolean;
  label?: string;
};

export default function CrearEventoButton({
  loading = false,
  label = 'Crear Evento',
}: CrearEventoButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200 text-lg disabled:opacity-50"
    >
      {loading ? 'Creando...' : label}
    </button>
  );
}