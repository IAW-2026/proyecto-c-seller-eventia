"use client";

import { useState, useEffect } from "react";

type Evento = {
  idEvento: number;
  nombreEvento: string;
  stock: number;
};

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

  // Select reutilizable con los eventos cargados desde la API
  // Se usa en dos acciones distintas por eso se extrae como variable
  const selectEvento = (
    <select
      value={idEvento}
      onChange={(e) => setIdEvento(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">Seleccionar evento</option>
      {eventos.map((e) => (
        <option key={e.idEvento} value={e.idEvento}>
          #{e.idEvento} — {e.nombreEvento}
        </option>
      ))}
    </select>
  );

  return (
    <div className="p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Simulacion Buyer</h1>

      <div className="flex flex-col gap-4">

        {/* Acción 1: trae todos los eventos disponibles */}
        <button
          onClick={() => fetchGet("/api/buyer/eventos")}
          className="w-fit px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
        >
          Pedir todos los eventos
        </button>

        {/* Acción 2: trae el detalle de un evento específico por ID */}
        <div className="flex items-center gap-2">
          {selectEvento}
          <button
            onClick={() => fetchGet(`/api/buyer/eventos/${idEvento}`)}
            disabled={!idEvento}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
          >
            Pedir detalle del evento
          </button>
        </div>

        {/* Acción 3: crea un pedido con el evento y cantidad seleccionados */}
        <div className="flex items-center gap-2">
          {selectEvento}
          <select
            value={cantEntradas}
            onChange={(e) => setCantEntradas(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n} entrada{n > 1 ? "s" : ""}</option>
            ))}
          </select>
          <button
            onClick={crearPedido}
            disabled={!idEvento}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
          >
            Crear pedido
          </button>
        </div>

      </div>

      {/* Mientras espera la respuesta muestra un texto de carga */}
      {loading && <p className="text-slate-500">Cargando...</p>}

      {/* Cuando hay respuesta la muestra formateada como JSON */}
      {respuesta && !loading && (
        <div className="border rounded p-4 bg-slate-50">
          <h2 className="font-semibold mb-2">Respuesta:</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {JSON.stringify(respuesta, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
