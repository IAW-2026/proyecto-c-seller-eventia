import { Ban } from 'lucide-react';

export default function CuentaDesactivada() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-2xl p-10 max-w-md w-full" style={{ background: '#fff0f2', border: '1.5px solid #fe9ea2' }}>
        <Ban className="mx-auto mb-4 h-12 w-12" style={{ color: '#fe9ea2' }} />
        <h2 className="mb-3 font-display text-2xl text-slate-800">Cuenta desactivada</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Tu cuenta fue desactivada y no podés realizar acciones en Eventia.
          Para recuperar el acceso, comunicate con el administrador.
        </p>
      </div>
    </div>
  );
}
