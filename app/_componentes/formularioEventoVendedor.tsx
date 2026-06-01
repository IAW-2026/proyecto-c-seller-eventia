'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import NuevoEventoForm, { FormValues } from '@/app/_componentes/formularioEvento';
import { upsertEventoAction } from '@/app/lib/actions/eventos';
import { type eventos } from '@prisma/client';
import { CATEGORIAS, TZ_OFFSET_MS } from '@/app/lib/constants';

interface Props {
  eventoInicial?: eventos | null;
}

export default function FormularioEventoClient({ eventoInicial }: Props) {
  // URLs de imágenes subidas a Uploadthing, se envían junto con el formulario
  const [imagenes, setImagenes] = useState<string[]>(eventoInicial?.imagenes ?? []);

  // La ubicación se guarda como "dirección, ciudad" — la separamos para los campos del form
  const ubicacion = eventoInicial?.ubicacion ?? '';
  const partes = ubicacion.split(',');
  const ciudadInicial = partes.length > 1 ? partes.pop()?.trim() ?? '' : '';
  const direccionInicial = partes.join(',').trim();

  // La DB guarda en UTC. Para mostrar en el form hay que aplicar el offset local
  const fechaArg = eventoInicial?.fecha
    ? new Date(new Date(eventoInicial.fecha).getTime() + TZ_OFFSET_MS)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      nombreEvento: eventoInicial?.nombreEvento ?? '',
      descripcion: eventoInicial?.descripcion ?? '',
      fecha: fechaArg ? fechaArg.toISOString().slice(0, 10) : '',
      hora: fechaArg ? fechaArg.toISOString().slice(11, 16) : '',
      direccion: direccionInicial,
      ciudad: ciudadInicial,
      stock: eventoInicial?.stock ?? ('' as unknown as number),
      precio: eventoInicial?.precio ?? ('' as unknown as number),
      categoria: eventoInicial?.categoria ?? CATEGORIAS[0],
    },
  });

  const watchFecha = watch('fecha');
  const watchCategoria = watch('categoria');
  const watchDireccion = watch('direccion');
  const watchCiudad = watch('ciudad');

  const onSubmit = async (data: FormValues) => {
    const result = await upsertEventoAction(eventoInicial?.idEvento ?? null, data, imagenes);
    if (result?.error) alert(result.error);
  };

  return (
    <NuevoEventoForm
      register={register}
      setValue={setValue}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      onImagenesChange={setImagenes}
      initialImagenes={eventoInicial?.imagenes ?? []}
      idEvento={eventoInicial?.idEvento}
      watchFecha={watchFecha}
      watchCategoria={watchCategoria}
      watchDireccion={watchDireccion}
      watchCiudad={watchCiudad}
    />
  );
}
