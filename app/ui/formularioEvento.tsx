'use client';

import dynamic from 'next/dynamic';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import CargaImagenes from './cargaImagenes';
import { Calendar, Clock, MapPin, FileText, Ticket, Image } from 'lucide-react';
import { CATEGORIAS } from '@/app/lib/constants';

const MapaEvento = dynamic(() => import('./mapaEvento'), { ssr: false });

export type FormValues = {
  nombreEvento: string;
  descripcion: string;
  fecha: string;
  hora: string;
  direccion: string;
  ciudad: string;
  stock: string;
  precio: string;
  categoria: string;
};

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  onImagenesChange: (urls: string[]) => void;
  idEvento?: number | null;
  watchDireccion?: string;
  watchCiudad?: string;
};


export default function NuevoEventoForm({
  register,
  errors,
  isSubmitting,
  handleSubmit,
  onSubmit,
  onImagenesChange,
  idEvento,
  watchDireccion = '',
  watchCiudad = '',
}: Props) {
  const textoMapa = [watchDireccion, watchCiudad].filter(Boolean).join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {idEvento ? 'Editar Evento' : 'Crear Evento'}
        </h1>
        <p className="text-slate-500 mt-1">
          Completá los detalles para configurar tu evento.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>

        {/* Sección 1: Información General */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800 text-lg">Información General</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nombre del Evento
            </label>
            <input
              type="text"
              placeholder="Ej. Gala de Verano 2024"
              className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register('nombreEvento', { required: 'El nombre es obligatorio' })}
            />
            {errors.nombreEvento && (
              <p className="text-xs text-red-500">{errors.nombreEvento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Descripción
            </label>
            <textarea
              rows={5}
              placeholder="Describí los detalles de tu evento..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
            />
            {errors.descripcion && (
              <p className="text-xs text-red-500">{errors.descripcion.message}</p>
            )}
          </div>
        </section>

        {/* Sección 2: Fecha, Hora y Ubicación */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800 text-lg">Fecha, Hora y Ubicación</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  {...register('fecha', { required: 'La fecha es obligatoria' })}
                />
              </div>
              {errors.fecha && (
                <p className="text-xs text-red-500">{errors.fecha.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hora
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="time"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  {...register('hora', { required: 'La hora es obligatoria' })}
                />
              </div>
              {errors.hora && (
                <p className="text-xs text-red-500">{errors.hora.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ej. Av. Corrientes 1234"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  {...register('direccion', { required: 'La dirección es obligatoria' })}
                />
              </div>
              {errors.direccion && (
                <p className="text-xs text-red-500">{errors.direccion.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ciudad
              </label>
              <input
                type="text"
                placeholder="Ej. Buenos Aires"
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register('ciudad', { required: 'La ciudad es obligatoria' })}
              />
              {errors.ciudad && (
                <p className="text-xs text-red-500">{errors.ciudad.message}</p>
              )}
            </div>
          </div>

          <MapaEvento texto={textoMapa} />
        </section>

        {/* Sección 3: Configuración y Entradas */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800 text-lg">Configuración y Entradas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Precio por Entrada
              </label>
              <div className="flex h-12">
                <div className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-slate-600 font-bold text-sm">
                  $
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="flex-1 px-3 rounded-r-lg border border-slate-200 bg-white text-slate-900 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  {...register('precio', { required: 'El precio es obligatorio', min: { value: 0, message: 'No puede ser negativo' } })}
                />
              </div>
              {errors.precio && (
                <p className="text-xs text-red-500">{errors.precio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Capacidad Total
              </label>
              <input
                type="number"
                placeholder="100"
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register('stock', { required: 'La capacidad es obligatoria', min: { value: 0, message: 'No puede ser negativo' } })}
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Categoría
              </label>
              <select
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register('categoria')}
              >
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Sección 4: Multimedia */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <Image className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800 text-lg">Multimedia</h2>
          </div>
          <CargaImagenes onChange={onImagenesChange} />
        </section>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          {!idEvento && (
            <button
              type="button"
              className="px-8 h-12 rounded-xl border-2 border-slate-800 text-slate-800 font-semibold hover:bg-slate-50 transition"
            >
              Guardar Borrador
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 h-12 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : idEvento ? 'Guardar Cambios' : 'Publicar Evento'}
          </button>
        </div>

      </form>
    </div>
  );
}
