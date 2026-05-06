export default function NuevoEventoPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Nuevo Evento</h1>
        <p className="text-slate-600">
          Completa los detalles a continuación para configurar su próximo gran evento.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-blue-50 p-4 mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0 text-blue-600 text-xl">ℹ️</div>
          <div>
            <h2 className="font-semibold text-blue-700 mb-1">Información General</h2>
            <p className="text-sm text-blue-600">
              Define el nombre y el propósito de tu evento.
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Título del Evento
          </label>
          <input
            type="text"
            placeholder="Ej. Conferencia de Innovación Tech 2024"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <textarea
            placeholder="Describe los puntos clave del evento, ponentes destacados y qué esperar..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
            disabled
          />
        </div>
      </form>
    </div>
  );
}