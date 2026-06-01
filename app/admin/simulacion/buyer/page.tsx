"use client";

import { useState, useEffect } from "react";

type Evento = {
  idEvento: number;
  nombreEvento: string;
  stock: number;
};

const selectClass = "h-10 w-full rounded-[12px] border border-[#d7cfc6] bg-[#fbfaf8] px-3 text-sm text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white";
const btnPrimary = "h-10 shrink-0 rounded-[14px] bg-[#7b0b0b] px-5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(123,11,11,0.18)] transition hover:bg-[#640808] disabled:opacity-40";
const btnSecondary = "h-10 shrink-0 rounded-[14px] border border-[#d7cfc6] bg-[#f0e6df] px-5 text-sm font-medium text-[#5d4d45] transition hover:bg-[#e8d8ce] disabled:opacity-40";

export default function BuyerSimulacion() {
  // respuesta guarda lo que devuelve la API para mostrarlo en pantalla
  const [respuesta, setRespuesta] = useState<any>(null);
  // loading controla si mostrar "Cargando..." mientras espera la respuesta
  const [loading, setLoading] = useState(false);
  // eventos se puebla al cargar la página para llenar los selects
  const [eventos, setEventos] = useState<Evento[]>([]);
  // idEvento y cantEntradas son los valores seleccionados en los desplegables
  const [idEvento, setIdEvento] = useState("");
  const [cantEntradas, setCantEntradas] = useState("1");

  // Al montar la página, carga todos los eventos para poblar los selects
  useEffect(() => {
    fetch("/api/buyer/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch(() => setEventos([]));
  }, []);

  // Función reutilizable para cualquier GET — recibe la URL y muestra la respuesta
  async function fetchGet(url: string) {
    setLoading(true);
    const res = await fetch(url);
    const data = await res.json();
    setRespuesta(data);
    setLoading(false);
  }

  // Función para crear un pedido — hace POST con los datos seleccionados
  // idUsuario está hardcodeado porque simula ser un comprador real
  async function crearPedido() {
    setLoading(true);
    const res = await fetch("/api/buyer/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idEvento: Number(idEvento),
        cantEntradas: Number(cantEntradas),
        idUsuario: "buyer-sim-001",
      }),
    });
    const data = await res.json();
    setRespuesta(data);
    setLoading(false);
  }

  // Input con datalist — muestra los eventos como sugerencias pero permite tipear cualquier ID
  const selectEvento = (
    <div className="flex-1">
      <input
        list="buyer-eventos-list"
        placeholder="Seleccioná o escribí un ID de evento"
        value={idEvento}
        onChange={(e) => setIdEvento(e.target.value)}
        className={`${selectClass} w-full`}
      />
      <datalist id="buyer-eventos-list">
        {eventos.map((e) => (
          <option key={e.idEvento} value={String(e.idEvento)}>{e.nombreEvento}</option>
        ))}
      </datalist>
    </div>
  );

  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 pt-1 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          Simulación Buyer
        </h1>
        <p className="font-label ml-1 mt-1 text-[12px] leading-[1.4] text-[#9a444a]">
          Simulá las llamadas que hace la app de compras al seller
        </p>
      </div>

      <div className="flex flex-col gap-4">

        {/* Acción 1: trae todos los eventos disponibles */}
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Acción 1</p>
          <button onClick={() => fetchGet("/api/buyer/eventos")} className={btnPrimary}>
            Pedir todos los eventos
          </button>
        </div>

        {/* Acción 2: trae el detalle de un evento específico por ID */}
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Acción 2</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {selectEvento}
            <button
              onClick={() => fetchGet(`/api/buyer/eventos/${idEvento}`)}
              disabled={!idEvento}
              className={btnSecondary}
            >
              Pedir detalle del evento
            </button>
          </div>
        </div>

        {/* Acción 3: crea un pedido con el evento y cantidad seleccionados */}
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Acción 3</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {selectEvento}
            <select
              value={cantEntradas}
              onChange={(e) => setCantEntradas(e.target.value)}
              className={`${selectClass} sm:w-40`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n} entrada{n > 1 ? "s" : ""}</option>
              ))}
            </select>
            <button onClick={crearPedido} disabled={!idEvento} className={btnPrimary}>
              Crear pedido
            </button>
          </div>
        </div>

      </div>

      {/* Mientras espera la respuesta muestra un texto de carga */}
      {loading && <p className="text-sm text-[#9a7a6e]">Cargando...</p>}

      {/* Cuando hay respuesta la muestra formateada como JSON */}
      {respuesta && !loading && (
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Respuesta</p>
          <pre className="overflow-auto whitespace-pre-wrap rounded-[12px] bg-[#f0e9e0] p-4 text-[12px] text-[#5d4d45]">
            {JSON.stringify(respuesta, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
