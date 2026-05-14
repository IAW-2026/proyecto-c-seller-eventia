'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import NuevoEventoForm, { FormValues } from '@/app/ui/formularioEvento';

export default function NuevoEventoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idEvento = searchParams.get('idEvento');
  const modo = searchParams.get('modo');

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    const cargarEvento = async () => {
      if (modo !== 'editar' || !idEvento) return;

      try {
        const res = await fetch(`/api/seller/eventos/${idEvento}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('No se pudo cargar el evento');
        }

        const evento = await res.json();

        reset({
          nombreEvento: evento.nombreEvento ?? '',
          descripcion: evento.descripcion ?? '',
          fecha: evento.fecha ? new Date(evento.fecha).toISOString().slice(0, 16) : '',
          ubicacion: evento.ubicacion ?? '',
          stock: evento.stock?.toString() ?? '',
          precio: evento.precio?.toString() ?? '',
        });
      } catch (error) {
        console.error(error);
        alert('No se pudo cargar el evento');
      }
    };

    cargarEvento();
  }, [modo, idEvento, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      fecha: data.fecha || null,
      ubicacion: data.ubicacion || null,
      stock: data.stock ? Number(data.stock) : null,
      precio: data.precio ? Number(data.precio) : null,
    };

    try {
      const res = await fetch(
        modo === 'editar' && idEvento
          ? `/api/seller/eventos/${idEvento}`
          : '/api/seller/eventos',
        {
          method: modo === 'editar' && idEvento ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Error al guardar evento');

      router.push('/seller/eventos');
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el evento');
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