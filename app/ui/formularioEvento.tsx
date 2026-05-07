import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import CrearEventoButton from '@/app/ui/botones/crearEvento';

export type FormValues = {
  nombreEvento: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  stock: string;
  precio: string;
};

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
};

export default function NuevoEventoForm({
  register,
  errors,
  isSubmitting,
  handleSubmit,
  onSubmit,
}: Props) {
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
          <div className="flex-shrink-0 text-blue-600 text-xl">i</div>
          <div>
            <h2 className="font-semibold text-blue-700 mb-1">Información General</h2>
            <p className="text-sm text-blue-600">Define el nombre y el propósito de tu evento.</p>
          </div>
        </div>
      </div>

      <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Título del Evento</label>
          <input
            type="text"
            placeholder="Ej. Conferencia de Innovación Tech 2024"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('nombreEvento', { required: 'El título es obligatorio' })}
          />
          {errors.nombreEvento && (
            <p className="text-sm text-red-600 mt-1">{errors.nombreEvento.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
          <textarea
            placeholder="Describe los puntos clave del evento, ponentes destacados y qué esperar..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
            {...register('descripcion', { required: 'La descripción es obligatoria' })}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('fecha')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación</label>
          <input
            type="text"
            placeholder="Ej. Salón Centro, Buenos Aires"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('ubicacion')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Stock de Entradas</label>
          <input
            type="number"
            placeholder="Ej. 100"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('stock', {
              min: { value: 0, message: 'No puede ser negativo' },
            })}
          />
          {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Precio</label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej. 50.00"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('precio', {
              min: { value: 0, message: 'No puede ser negativo' },
            })}
          />
          {errors.precio && <p className="text-sm text-red-600 mt-1">{errors.precio.message}</p>}
        </div>

        <CrearEventoButton loading={isSubmitting} />
      </form>
    </div>
  );
}