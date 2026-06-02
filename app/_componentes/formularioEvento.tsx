'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import CargaImagenes from './cargaImagenes';
import { Calendar as LucideCalendar, Clock, MapPin, FileText, Ticket, Image } from 'lucide-react';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIAS } from '@/app/lib/constants';

// El mapa se carga dinámicamente para evitar errores de SSR con Leaflet
const MapaEvento = dynamic(() => import('./mapaEvento'), { ssr: false });

export type FormValues = {
  nombreEvento: string;
  descripcion: string;
  fecha: string;
  hora: string;
  direccion: string;
  ciudad: string;
  stock: number;
  precio: number;
  categoria: string;
};

type Props = {
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  onImagenesChange: (urls: string[]) => void;
  initialImagenes?: string[];
  idEvento?: number | null;
  watchFecha?: string;
  watchCategoria?: string;
  watchDireccion?: string;
  watchCiudad?: string;
};

// Clases compartidas entre los campos del formulario
const LABEL = 'font-label block text-[12px] font-bold uppercase tracking-[0.14em] text-[#6f5a50]';
const INPUT = 'h-12 w-full rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:h-14 sm:text-[16px]';
const INPUT_ICON = 'h-12 w-full rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] pl-11 pr-4 text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:h-14 sm:text-[16px]';
const SECTION = 'space-y-4 rounded-[24px] border border-[#eadfd2] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:space-y-5 sm:p-5';

function SectionHeader({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#eadfd2] pb-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#ff9aa0] text-[#7b0b0b]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-label text-[18px] font-extrabold tracking-[-0.01em] text-[#222222] sm:text-[20px]">{title}</h2>
    </div>
  );
}

// Envuelve un campo con su label y mensaje de error
function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className={LABEL}>{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function NuevoEventoForm({
  register,
  setValue,
  errors,
  isSubmitting,
  handleSubmit,
  onSubmit,
  onImagenesChange,
  initialImagenes,
  idEvento,
  watchFecha = '',
  watchCategoria = '',
  watchDireccion = '',
  watchCiudad = '',
}: Props) {
  const textoMapa = [watchDireccion, watchCiudad].filter(Boolean).join(', ');

  const [fechaOpen, setFechaOpen] = useState(false);
  const [fechaSelected, setFechaSelected] = useState<Date | undefined>(
    () => watchFecha ? new Date(watchFecha + 'T00:00:00') : undefined
  );

  // Inicio del día actual para deshabilitar fechas pasadas en el calendario
  const hoyInicio = new Date();
  hoyInicio.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">

      <div className="mb-4 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          {idEvento ? 'Editar Evento' : 'Crear Evento'}
        </h1>
        <p className="font-label ml-1 mt-1 w-fit text-[12px] leading-[1.4] text-[#6e5549]">
          Completá los detalles para configurar tu evento.
        </p>
      </div>

      <div className="mx-auto max-w-[860px] space-y-4 sm:space-y-5">
        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>

          <section className={SECTION}>
            <SectionHeader icon={FileText} title="Información General" />

            <Field htmlFor="nombreEvento" label="Nombre del Evento" error={errors.nombreEvento?.message}>
              <input
                id="nombreEvento"
                type="text"
                placeholder="Ej. Gala de Verano 2026"
                className={INPUT}
                {...register('nombreEvento', { required: 'El nombre es obligatorio' })}
              />
            </Field>

            <Field htmlFor="descripcion" label="Descripción" error={errors.descripcion?.message}>
              <textarea
                id="descripcion"
                rows={5}
                placeholder="Describí los detalles de tu evento..."
                className="min-h-[96px] w-full resize-none rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 py-3 text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:min-h-[112px] sm:py-4 sm:text-[16px]"
                {...register('descripcion')}
              />
            </Field>
          </section>

          <section className={SECTION}>
            <SectionHeader icon={MapPin} title="Fecha, Hora y Ubicación" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Field htmlFor="fecha-picker" label="Fecha" error={errors.fecha?.message}>
                {/* Input oculto para registrar y validar la fecha en react-hook-form */}
                <input type="hidden" {...register('fecha', {
                  required: 'La fecha es obligatoria',
                  validate: (v) =>
                    new Date(v + 'T00:00:00') >= hoyInicio || 'La fecha no puede ser anterior a hoy',
                })} />
                <Popover open={fechaOpen} onOpenChange={setFechaOpen}>
                  <PopoverTrigger id="fecha-picker" className="flex h-12 w-full items-center gap-3 rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 text-left text-[15px] transition focus:border-[#d7b9a3] focus:bg-[#fffaf0] focus:outline-none sm:h-14 sm:text-[16px]">
                    <LucideCalendar className="h-4 w-4 flex-none text-[#ab6e6e]" />
                    <span className={fechaSelected ? 'text-[#5d4d45]' : 'text-[#8b7269]'}>
                      {fechaSelected
                        ? fechaSelected.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
                        : 'Seleccioná una fecha'}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-[#ecd9c8] bg-[#fffaf0] shadow-md rounded-[16px]" align="start">
                    <ShadCalendar
                      mode="single"
                      selected={fechaSelected}
                      disabled={{ before: hoyInicio }}
                      onSelect={(d) => {
                        setFechaSelected(d);
                        setValue('fecha', d ? d.toISOString().split('T')[0] : '', { shouldValidate: true });
                        setFechaOpen(false);
                      }}
                      defaultMonth={fechaSelected ?? new Date()}
                      classNames={{
                        day: 'rounded-[10px]',
                        today: 'bg-[#fde8d8] text-[#7b2d00] rounded-[10px]',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field htmlFor="hora" label="Hora" error={errors.hora?.message}>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ab6e6e]" />
                  <input
                    id="hora"
                    type="time"
                    className={INPUT_ICON}
                    {...register('hora', {
                      required: 'La hora es obligatoria',
                      validate: (v, { fecha }) => {
                        const ahora = new Date();
                        if (fecha !== ahora.toISOString().split('T')[0]) return true;
                        const [hh, mm] = v.split(':').map(Number);
                        return hh * 60 + mm >= ahora.getHours() * 60 + ahora.getMinutes() + 60
                          || 'Si el evento es hoy, debe comenzar con al menos 1 hora de anticipación';
                      },
                    })}
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Field htmlFor="direccion" label="Dirección" error={errors.direccion?.message}>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ab6e6e]" />
                  <input
                    id="direccion"
                    type="text"
                    placeholder="Ej. Av. Corrientes 1234"
                    className={INPUT_ICON}
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                  />
                </div>
              </Field>

              <Field htmlFor="ciudad" label="Ciudad" error={errors.ciudad?.message}>
                <input
                  id="ciudad"
                  type="text"
                  placeholder="Ej. Bahía Blanca"
                  className={INPUT}
                  {...register('ciudad', { required: 'La ciudad es obligatoria' })}
                />
              </Field>
            </div>

            {/* Previsualización del mapa según dirección + ciudad (cargado dinámicamente) */}
            <MapaEvento texto={textoMapa} />
          </section>

          <section className={SECTION}>
            <SectionHeader icon={Ticket} title="Configuración y Entradas" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              <Field htmlFor="precio" label="Precio por Entrada" error={errors.precio?.message}>
                <div className="flex h-14">
                  <div className="flex items-center rounded-l-[16px] border border-r-0 border-[#ecd9c8] bg-[#fbf3e3] px-4 text-[16px] font-bold text-[#7b0b0b] sm:text-[18px]">
                    $
                  </div>
                  <input
                    id="precio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="flex-1 rounded-r-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 text-right text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:text-[16px]"
                    {...register('precio', { required: 'El precio es obligatorio', validate: (v) => v > 0 || 'El precio debe ser mayor a $0', valueAsNumber: true })}
                  />
                </div>
              </Field>

              <Field htmlFor="stock" label="Capacidad Total" error={errors.stock?.message}>
                <input
                  id="stock"
                  type="number"
                  placeholder="100"
                  className={INPUT}
                  {...register('stock', { required: 'La capacidad es obligatoria', min: { value: 1, message: 'La capacidad debe ser al menos 1' }, valueAsNumber: true })}
                />
              </Field>

              <Field htmlFor="categoria-select" label="Categoría" error={errors.categoria?.message}>
                {/* Input oculto para registrar y validar la categoría en react-hook-form */}
                <input type="hidden" {...register('categoria', { required: 'La categoría es obligatoria' })} />
                <Select
                  value={watchCategoria}
                  onValueChange={(val) => val && setValue('categoria', val, { shouldValidate: true })}
                >
                  <SelectTrigger id="categoria-select" className="!h-12 w-full rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 text-[15px] text-[#5d4d45] transition focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:!h-14 sm:text-[16px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-[#ecd9c8] bg-[#fffaf0] rounded-[16px]">
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          {/* Imágenes del evento — se suben a través de cargaImagenes.tsx */}
          <section className={SECTION}>
            <SectionHeader icon={Image} title="Multimedia" />
            <CargaImagenes onChange={onImagenesChange} initialUrls={initialImagenes} />
          </section>

          <div className="flex justify-end border-t border-[#eadfd2] pt-4 sm:pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-[16px] bg-[var(--color-primary)] px-8 font-bold text-white shadow-[0_10px_20px_rgba(101,0,3,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-vivid)] active:translate-y-0 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? 'Guardando...' : idEvento ? 'Guardar Cambios' : 'Publicar Evento'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
