'use client';

import { useForm } from 'react-hook-form';
import NuevoEventoForm, { FormValues } from '@/app/ui/formularioEvento';
import { upsertEventoAction } from '@/app/lib/actions/eventos';
import { type eventos } from '@prisma/client';

interface Props {
  eventoInicial?: eventos | null;
}

export default function FormularioEventoClient({ eventoInicial }: Props) {
  // Para el modo editar, separamos ubicacion en dirección y ciudad
  const ubicacion = eventoInicial?.ubicacion ?? '';
  const partes = ubicacion.split(',');
  const ciudadInicial = partes.length > 1 ? partes.pop()?.trim() ?? '' : '';
  const direccionInicial = partes.join(',').trim();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      nombreEvento: eventoInicial?.nombreEvento ?? '',
      descripcion: eventoInicial?.descripcion ?? '',
      fecha: eventoInicial?.fecha
        ? new Date(eventoInicial.fecha).toISOString().slice(0, 10)
        : '',
      hora: eventoInicial?.fecha
        ? new Date(eventoInicial.fecha).toISOString().slice(11, 16)
        : '',
      direccion: direccionInicial,
      ciudad: ciudadInicial,
      stock: eventoInicial?.stock?.toString() ?? '',
      precio: eventoInicial?.precio?.toString() ?? '',
      categoria: eventoInicial?.categoria ?? 'Música y espectáculos',
    },
  });

  const watchDireccion = watch('direccion');
  const watchCiudad = watch('ciudad');

  const onSubmit = async (data: FormValues) => {
    const result = await upsertEventoAction(eventoInicial?.idEvento ?? null, data);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <NuevoEventoForm
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      idEvento={eventoInicial?.idEvento}
      watchDireccion={watchDireccion}
      watchCiudad={watchCiudad}
    />
  );
}
