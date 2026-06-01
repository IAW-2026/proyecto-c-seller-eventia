"use client";

import { useMemo } from "react";

type Opcion = {
  id: number;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  opciones: Opcion[];
  placeholder: string;
  emptyLabel?: string;
  className?: string;
};

export default function BuscadorOpcion({
  value,
  onChange,
  opciones,
  placeholder,
  emptyLabel = "No hay resultados",
  className = "",
}: Props) {
  const filtro = value.trim().toLowerCase();

  const opcionesFiltradas = useMemo(() => {
    if (!filtro) return opciones;
    return opciones.filter((opcion) => {
      return (
        String(opcion.id).includes(filtro) ||
        opcion.label.toLowerCase().includes(filtro)
      );
    });
  }, [filtro, opciones]);

  return (
    <div className={`flex-1 space-y-2 ${className}`.trim()}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[12px] border border-[#d7cfc6] bg-[#fbfaf8] px-3 text-sm text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white"
      />
      <div className="max-h-44 overflow-auto rounded-[12px] border border-[#eadfd2] bg-white p-1">
        {opcionesFiltradas.length === 0 ? (
          <p className="px-3 py-2 text-[12px] text-[#9a7a6e]">{emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-1">
            {opcionesFiltradas.map((opcion) => (
              <button
                key={opcion.id}
                type="button"
                onClick={() => onChange(String(opcion.id))}
                className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[12px] text-[#5d4d45] transition hover:bg-[#f7efe7]"
              >
                <span className="font-semibold text-[#7b0b0b]">#{opcion.id}</span>
                <span className="ml-3 flex-1 truncate text-right">{opcion.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
