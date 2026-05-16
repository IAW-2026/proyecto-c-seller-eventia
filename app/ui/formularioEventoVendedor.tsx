'use client';

import { useForm } from 'react-hook-form';
import NuevoEventoForm, { FormValues } from '@/app/ui/formularioEvento';
import { upsertEventoAction } from '@/app/lib/actions/eventos';

interface Props {
  eventoInicial?: any;
  idEvento?: number | null;
}

export default function FormularioEventoClient({ eventoInicial, idEvento }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // Aquí ocurre la magia: si eventoInicial existe, Next.js llena el form automáticamente
    defaultValues: {
      nombreEvento: eventoInicial?.nombreEvento ?? '',
      descripcion: eventoInicial?.descripcion ?? '',
      fecha: eventoInicial?.fecha ? new Date(eventoInicial.fecha).toISOString().slice(0, 16) : '',
      ubicacion: eventoInicial?.ubicacion ?? '',
      stock: eventoInicial?.stock?.toString() ?? '',
      precio: eventoInicial?.precio?.toString() ?? '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Llamamos a la Server Action directamente como una función
    const result = await upsertEventoAction(idEvento ?? null, data);
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
      idEvento={idEvento}
    />
  );
}
