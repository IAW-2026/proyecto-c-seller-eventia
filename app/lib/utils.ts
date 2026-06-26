import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arma el fragmento `fecha` para queries Prisma a partir de los searchParams de fecha.
// Devuelve un objeto vacío si no hay filtros, listo para spread en el `where`.
export function buildFechaFiltro(desde?: string, hasta?: string) {
  return {
    ...(desde ? { gte: new Date(desde + 'T00:00:00') } : {}),
    ...(hasta ? { lte: new Date(hasta + 'T23:59:59') } : {}),
  };
}
