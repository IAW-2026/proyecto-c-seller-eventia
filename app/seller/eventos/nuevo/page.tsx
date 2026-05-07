'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import NuevoEventoForm, { FormValues } from '@/app/ui/formularioEvento';

export default function NuevoEventoPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      nombreEvento: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      stock: '',
      precio: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      fecha: data.fecha || null,
      ubicacion: data.ubicacion || null,
      stock: data.stock ? Number(data.stock) : null,
      precio: data.precio ? Number(data.precio) : null,
    };

    try {
      const res = await fetch('/api/seller/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al crear evento');
      router.push('/seller/eventos');
    } catch (error) {
      console.error(error);
      alert('No se pudo crear el evento');
    }
  };

  return (
    <NuevoEventoForm
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    />
  );
}