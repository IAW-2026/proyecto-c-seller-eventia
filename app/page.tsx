import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-8">
      <div className="max-w-3xl text-center">
        <p className="mb-4 text-lg font-medium text-violet-500">
          Bienvenido a Eventia
        </p>

        <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
          Descubrí, creá y viví
          <br />
          los mejores eventos
        </h1>

        <p className="mb-8 text-lg text-slate-600">
          La plataforma para organizar eventos y vender entradas de manera fácil y segura.
        </p>

        <Link
          href="/seller/eventos/nuevo"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-white font-semibold transition hover:bg-indigo-700"
        >
          Crear evento
        </Link>
      </div>
    </div>
  );
}