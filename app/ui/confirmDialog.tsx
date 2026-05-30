"use client";

import React from 'react';
import { ptSerif } from '@/app/ui/fonts';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = 'Confirmar',
  message = '¿Estás seguro? Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1713]/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[24px] border border-[#eadfd2] bg-[#fcf4e5] p-5 shadow-[0_20px_50px_rgba(55,32,20,0.18)] sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fde3d4] text-[#8B1010]">
            <span className="text-lg leading-none">!</span>
          </div>
          <div className="min-w-0">
            <h3 className={`${ptSerif.className} text-[22px] leading-tight tracking-[-0.01em] text-[#111111]`}>{title}</h3>
            <p className="mt-1 text-[13px] leading-[1.5] text-[#6e5549]">{message}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#d9cfc6] bg-transparent px-5 text-[13px] font-semibold text-[#2f241f] transition hover:bg-white"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#8B1010] bg-[#8B1010] px-5 text-[13px] font-semibold text-white transition hover:bg-[#701010]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
