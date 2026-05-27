'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

export default function CargaImagenes() {
  const [imagenes, setImagenes] = useState<{ url: string; nombre: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const procesarArchivos = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      setImagenes((prev) => [...prev, { url, nombre: file.name }]);
    });
  };

  const eliminar = (idx: number) => {
    setImagenes((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    procesarArchivos(e.dataTransfer.files);
  }, []);

  return (
    <div className="space-y-4">
      {/* Zona de drop */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-semibold text-gray-700">Cargar Imágenes del Evento</p>
        <p className="text-sm text-gray-500 mt-1">
          Arrastrá y soltá archivos aquí o hacé clic para explorar
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => procesarArchivos(e.target.files)}
        />
      </div>

      {/* Previews */}
      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {imagenes.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group shadow-sm"
            >
              <img src={img.url} alt={img.nombre} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); eliminar(idx); }}
                  className="text-white hover:scale-125 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
