'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ImageOff, MapPin, CalendarDays, Ticket } from 'lucide-react';
// Image de next/image optimiza tamaño, convierte a WebP y hace preload del LCP
import Image from 'next/image';
import ModificarEventoButton from '@/app/ui/botones/modificarEvento';
import EliminarEventoButton from '@/app/ui/botones/eliminarEvento';
import { ptSerif } from '@/app/ui/fonts';


export type Evento = {
  idEvento: number;
  nombreEvento: string;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  precio: number;
  categoria: string;
  imagenes: string[];
};

type Props = {
  evento: Evento;
  onModificar: (idEvento: number) => void;
  onEliminar: (idEvento: number) => void;
};

function ImagenCarousel({ imagenes }: { imagenes: string[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [current, setCurrent] = useState(0);

  // Cada vez que embla cambia de slide, actualizamos el índice activo
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  if (imagenes.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center bg-slate-100 text-slate-400">
        <ImageOff className="w-8 h-8" />
      </div>
    );
  }

  if (imagenes.length === 1) {
    return (
      // relative necesario para que Image con fill se posicione correctamente
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* priority = preload en el navegador, mejora el LCP */}
        {/* sizes refleja el grid de tablaEventos: 1 col mobile, 2 col sm, 3 col lg */}
        <Image src={imagenes[0]} alt="Imagen del evento" fill className="object-cover object-center" priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden group">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {imagenes.map((url, i) => (
            // relative necesario para que Image con fill ocupe el slide correctamente
            <div key={i} className="relative flex-none w-full h-full">
              {/* priority solo en la portada (i=0) para preload del LCP */}
              {/* sizes refleja el grid de tablaEventos: 1 col mobile, 2 col sm, 3 col lg */}
              <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover object-center" priority={i === 0} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </div>
          ))}
        </div>
      </div>
        {/* Puntitos indicadores: uno por imagen, el actual relleno al 100%, el resto al 40% */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {imagenes.map((_, i) => (
          <span
            key={i}
            className={`block w-1.5 h-1.5 rounded-full transition-opacity ${
              i === current ? 'bg-white opacity-100' : 'bg-white opacity-40'
            }`}
          />
        ))}
      </div>
            {/* Botón anterior: solo se muestra si no estamos en la primera imagen */}
      {current > 0 && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 hidden sm:flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Botón siguiente: solo se muestra si no estamos en la última imagen */}
      {current < imagenes.length - 1 && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 hidden sm:flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}


export default function EventoCard({ evento, onModificar, onEliminar }: Props) {
  return (
    <div className="w-full max-w-none overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm sm:max-w-[21rem]">
      <ImagenCarousel imagenes={evento.imagenes ?? []} />

      <div className="p-3">
        <span
          className="mb-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-accent-foreground)',
          }}
        >
          {evento.categoria}
        </span>

        <h3 className={`mb-2 text-lg font-bold ${ptSerif.className}`} style={{ color: 'var(--color-primary)' }}>
          {evento.nombreEvento}
        </h3>

        <p className="text-sm text-slate-600">
          {evento.descripcion}
        </p>
      </div>

      <ul className="border-t border-slate-200">
  <li className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm text-slate-700">
    <MapPin className="h-4 w-4 flex-none text-[var(--color-primary)]" />
    <span>{evento.ubicacion}</span>
  </li>

  <li className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm text-slate-700">
    <CalendarDays className="h-4 w-4 flex-none text-[var(--color-primary)]" />
    <span>
      {new Date(evento.fecha).toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}
    </span>
  </li>

  <li className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm text-slate-700">
    <Ticket className="h-4 w-4 flex-none text-[var(--color-primary)]" />
    <span>Entrada: ${evento.precio.toLocaleString('es-AR')}</span>
  </li>
</ul>

      <div className="flex justify-center gap-2 p-3">
        <ModificarEventoButton onClick={() => onModificar(evento.idEvento)} />
        <EliminarEventoButton onClick={() => onEliminar(evento.idEvento)} />
      </div>
    </div>
  );

}