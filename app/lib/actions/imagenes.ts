'use server';

import { UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

// Instancia de la API de UploadThing para operaciones server-side
const utapi = new UTApi();

// Recibe la URL completa de una imagen y la elimina del CDN de UploadThing
// La fileKey es la parte final de la URL después de /f/
export async function eliminarImagenAction(url: string) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  // Extraemos la fileKey de la URL (formato: https://<app>.ufs.sh/f/<fileKey>)
  const fileKey = url.split('/f/').pop();
  if (!fileKey) return { error: "URL inválida" };

  try {
    await utapi.deleteFiles([fileKey]);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar imagen de UploadThing:", error);
    return { error: "No se pudo eliminar la imagen" };
  }
}
