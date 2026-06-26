import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Genera la imagen OG automáticamente — Next.js la inyecta en <head> como og:image
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fcf4e5',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '64px',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        {/* Logo: círculo rosa con E */}
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: '#cc7e88',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 170,
              color: '#7b0b0b',
              fontFamily: 'serif',
              lineHeight: 1,
              marginTop: '-8px',
            }}
          >
            E
          </span>
        </div>

        {/* Texto */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontSize: 90,
              fontWeight: 700,
              color: '#7b0b0b',
              fontFamily: 'serif',
              lineHeight: 1,
            }}
          >
            Eventia
          </span>
          <span
            style={{
              fontSize: 32,
              color: '#8a7067',
              lineHeight: 1.3,
            }}
          >
            Plataforma para organizadores de eventos
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
