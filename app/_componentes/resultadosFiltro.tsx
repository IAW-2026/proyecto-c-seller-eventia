interface Props {
  total: number;
  hayFiltros: boolean;
}

// Muestra cuántos resultados hay cuando hay filtros activos
export default function ResultadosFiltro({ total, hayFiltros }: Props) {
  if (!hayFiltros) return null;

  return (
    <p className="text-sm text-slate-500">
      {total === 0
        ? 'Sin resultados para los filtros aplicados'
        : `${total} resultado${total !== 1 ? 's' : ''} encontrados`}
    </p>
  );
}
