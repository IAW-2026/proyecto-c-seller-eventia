'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import NuevoEventoForm, { FormValues } from '@/app/_componentes/formularioEvento';
import Toast from '@/app/_componentes/toast';
import { upsertEventoAction } from '@/app/lib/actions/eventos';
import { type eventos } from '@prisma/client';
import { CATEGORIAS } from '@/app/lib/constants';

interface Props {
  eventoInicial?: eventos | null;
}

export default function FormularioEventoClient({ eventoInicial }: Props) {
  const router = useRouter();
  const [imagenes, setImagenes] = useState<string[]>(eventoInicial?.imagenes ?? []);
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'error' } | null>(null);

  // La ubicación se guarda como "dirección, ciudad" — la separamos para los campos del form
  const ubicacion = eventoInicial?.ubicacion ?? '';
  const partes = ubicacion.split(',');
  const ciudadInicial = partes.length > 1 ? partes.pop()?.trim() ?? '' : '';
  const direccionInicial = partes.join(',').trim();

  // La DB guarda en UTC. El objeto Date del browser lo convierte automáticamente a la tz local.
  const fechaLocal = eventoInicial?.fecha ? new Date(eventoInicial.fecha) : null;
  const fechaDefault = fechaLocal
    ? `${fechaLocal.getFullYear()}-${String(fechaLocal.getMonth() + 1).padStart(2, '0')}-${String(fechaLocal.getDate()).padStart(2, '0')}`
    : '';
  const horaDefault = fechaLocal
    ? `${String(fechaLocal.getHours()).padStart(2, '0')}:${String(fechaLocal.getMinutes()).padStart(2, '0')}`
    : '';

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
      fecha: fechaDefault,
      hora: horaDefault,
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
    // new Date("YYYY-MMDDTHH:MM:00") en el browser interpreta la hora como local → .toISOString() da UTC
    const fechaHoraUtc = new Date(`${data.fecha}T${data.hora}:00`).toISOString();
    const result = await upsertEventoAction(eventoInicial?.idEvento ?? null, data, imagenes, fechaHoraUtc);
    if (result?.error) {
      setToast({ title: 'Algo salió mal', message: result.error, type: 'error' });
      return;
    }
    setToast(result?.isNew
      ? { title: '¡Evento creado!', message: 'Tu evento fue publicado con éxito.', type: 'success' }
      : { title: 'Cambios guardados', message: 'Los cambios se guardaron correctamente.', type: 'success' }
    );
  };

  return (
    <>
    {toast && (
      <Toast
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => {
          setToast(null);
          router.push('/organizador/eventos');
        }}
      />
    )}
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
    </>
  );
}
