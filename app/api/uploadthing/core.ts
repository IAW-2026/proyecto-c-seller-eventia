import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  // archivo que creo, acepta solo imagenes de 4mb y hasta 5 archivos
  imagenesEvento: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => { //verifica que este loguado
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("No autenticado");
      return { userId };
    })
    .onUploadComplete(async ({ file }) => {//guarda el archivo en su servidor y devuelve la url
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
