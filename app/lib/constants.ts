// Constantes compartidas entre cliente y servidor.
// Centralizar acá evita tener que actualizar múltiples archivos si cambian los valores.

export const EXPIRACION_PEDIDO_MS = 15 * 60 * 1000; // 15 minutos

export const EVENTOS_POR_PAGINA = 6;

export const CATEGORIAS = [
  'Arte y manualidades',
  'Gastronomía',
  'Social',
  'Movimiento',
  'Musica y espectáculos',
] as const;
