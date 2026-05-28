'use client';

import { useCallback, useState } from 'react';
import { useUploadThing } from '@/app/lib/uploadthing';
import { Upload, X, Loader2 } from 'lucide-react';

// El padre pasa onChange para recibir las URLs reales una vez que terminó la subida
type Props = {
  onChange: (urls: string[]) => void;
};

export default function CargaImagenes({ onChange }: Props) {
  // previews: URLs temporales locales para mostrar mientras se sube
  const [previews, setPreviews] = useState<{ url: string; nombre: string }[]>([]);
  // uploading: controla si mostrar spinner o ícono de upload
  const [uploading, setUploading] = useState(false);

  // Conecta con el endpoint 'imagenesEvento' definido en core.ts
  const { startUpload } = useUploadThing('imagenesEvento', {
    // Cuando Uploadthing termina, extrae las URLs reales y se las pasa al formulario
    onClientUploadComplete: (res) => {
      const urls = res.map((f) => f.ufsUrl);
      onChange(urls);
      setUploading(false);
    },
    onUploadError: (err) => {
      console.error('Error al subir imagen:', err);
      setUploading(false);
    },
  });

  // Se ejecuta cuando el usuario elige archivos (click o drag & drop)
  const procesarArchivos = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Descarta archivos que no sean imágenes
    const validas = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validas.length === 0) return;

    // Crea previews locales instantáneos para mostrar antes de que termine la subida
    const nuevasPreviews = validas.map((f) => ({ url: URL.createObjectURL(f), nombre: f.name }));
    setPreviews((prev) => [...prev, ...nuevasPreviews]);

    // Sube los archivos a Uploadthing
    setUploading(true);
    await startUpload(validas);
  }, [startUpload]);

  // Elimina una preview de la lista y libera la memoria del objeto URL temporal
  const eliminar = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  return (
    <div className="space-y-4">
      {/* Zona de drop: acepta click y drag & drop */}
      <div
        className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        onClick={() => document.getElementById('ut-input')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); procesarArchivos(e.dataTransfer.files); }}
      >
        <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center mb-3">
          {/* Spinner mientras sube, ícono de upload cuando está idle */}
          {uploading
            ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            : <Upload className="w-6 h-6 text-gray-400" />}
        </div>
        <p className="font-semibold text-gray-700">
          {uploading ? 'Subiendo...' : 'Cargar Imágenes del Evento'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Arrastrá y soltá archivos aquí o hacé clic para explorar
        </p>
        {/* Input oculto, se activa con el click del div de arriba */}
        <input
          id="ut-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => procesarArchivos(e.target.files)}
        />
      </div>

      {/* Grid de thumbnails de las imágenes cargadas */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {previews.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group shadow-sm"
            >
              <img src={img.url} alt={img.nombre} className="w-full h-full object-cover" />
              {/* Overlay con botón X al hacer hover */}
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
