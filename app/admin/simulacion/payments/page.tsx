"use client";

import { useState, useEffect } from "react";
import BuscadorOpcion from "../_componentes/buscadorOpcion";

type Evento = {
  idEvento: number;
  nombreEvento: string;
  stock: number;
};

const selectClass = "h-10 w-full rounded-[12px] border border-[#d7cfc6] bg-[#fbfaf8] px-3 text-sm text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white";
const btnPrimary = "h-10 shrink-0 rounded-[14px] bg-[#7b0b0b] px-5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(123,11,11,0.18)] transition hover:bg-[#640808] disabled:opacity-40";
const btnSecondary = "h-10 shrink-0 rounded-[14px] border border-[#d7cfc6] bg-[#f0e6df] px-5 text-sm font-medium text-[#5d4d45] transition hover:bg-[#e8d8ce] disabled:opacity-40";
const btnDanger = "h-10 shrink-0 rounded-[14px] bg-red-100 px-5 text-sm font-medium text-red-700 transition hover:bg-red-200";

export default function PaymentsSimulacion() {
  const [respuesta, setRespuesta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [idEvento, setIdEvento] = useState("");
  const [idPedido, setIdPedido] = useState("");
  const [estadoTransaccion, setEstadoTransaccion] = useState("APROBADA");

  // Carga eventos y pedidos al montar para poblar los selects
  useEffect(() => {
    fetch("/api/buyer/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch(() => setEventos([]));

    // TODO: eliminar cuando se integren las apps — ver /api/simulacion/pedidos/route.ts
    fetch("/api/simulacion/pedidos")
      .then((res) => res.json())
      .then((data) => setPedidos(Array.isArray(data) ? data : []))
      .catch(() => setPedidos([]));
  }, []);

  // Acción 1: trae el detalle de un evento específico (igual que hace buyer)
  async function pedirDetalleEvento() {
    setLoading(true);
    const res = await fetch(`/api/buyer/eventos/${idEvento}`);
    const data = await res.json();
    setRespuesta(data);
    setLoading(false);
  }

  // Acción 2: notifica al seller el estado final del pago (PAGADO o CANCELADO)
  // el seller devuelve el pedido actualizado y el stock del evento para visualizar los cambios
  async function enviarEstado() {
    setLoading(true);
    const res = await fetch("/api/payments/estadoTransaccion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPedido: Number(idPedido), estadoTransaccion }),
    });
    const data = await res.json();
    setRespuesta(data);
    setLoading(false);
  }

  // Test API key: llama directo al seller sin pasar por el proxy (sin key) → debe dar 401
  async function testApiKey() {
    setLoading(true);
    const res = await fetch("/api/seller/eventos");
    const data = await res.json().catch(() => ({ status: res.status }));
    setRespuesta({ _test: "sin api key", status: res.status, respuesta: data });
    setLoading(false);
  }

  // Acción 3: obtiene el organizador del evento para saber a quién acreditar el pago
  async function obtenerOrganizador() {
    setLoading(true);
    const res = await fetch("/api/payments/organizador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idEvento: Number(idEvento) }),
    });
    const data = await res.json();
    setRespuesta(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 pt-1 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          Simulación Payments
        </h1>
        <p className="font-label ml-1 mt-1 text-[12px] leading-[1.4] text-[#9a444a]">
          Simulá las notificaciones que envía la app de pagos al seller
        </p>
      </div>

      <div className="flex flex-col gap-4">

        {/* Test middleware API key */}
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={testApiKey} className={btnDanger}>
            Test API key (sin key → 401)
          </button>
          <span className="text-[12px] text-[#9a7a6e]">
            Llama directo a /api/seller/eventos sin header — debe rechazar con 401
          </span>
        </div>

        {/* Acción 1 y 3 comparten el mismo selector visible de evento */}
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Acciones 1 y 3 — por evento</p>
          <BuscadorOpcion
            value={idEvento}
            onChange={setIdEvento}
            opciones={eventos.map((e) => ({ id: e.idEvento, label: e.nombreEvento }))}
            placeholder="Buscá o escribí un ID de evento"
            emptyLabel="No hay eventos para mostrar"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Acción 1: pedir detalle del evento seleccionado */}
            <button onClick={pedirDetalleEvento} disabled={!idEvento} className={`${btnSecondary} w-full sm:w-auto`}>
              Pedir detalle evento
            </button>
            {/* Acción 3: obtener organizador del evento seleccionado */}
            <button onClick={obtenerOrganizador} disabled={!idEvento} className={`${btnSecondary} w-full sm:w-auto`}>
              Obtener organizador
            </button>
          </div>
        </div>

        {/* Acción 2: confirmar o cancelar un pago por idPedido */}
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Acción 2 — estado de transacción</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <BuscadorOpcion
              value={idPedido}
              onChange={setIdPedido}
              opciones={pedidos.map((p) => ({
                id: p.idPedido,
                label: `${p.estado} — $${p.monto}`,
              }))}
              placeholder="Buscá o escribí un ID de pedido"
              emptyLabel="No hay pedidos para mostrar"
            />
            <select
              value={estadoTransaccion}
              onChange={(e) => setEstadoTransaccion(e.target.value)}
              className={`${selectClass} sm:w-44`}
            >
              <option value="APROBADA">Aprobada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="FALLIDA">Fallida</option>
            </select>
          </div>
          <button onClick={enviarEstado} disabled={!idPedido} className={`${btnPrimary} w-full sm:w-fit`}>
            Enviar estado de transacción
          </button>
        </div>

      </div>

      {loading && <p className="text-sm text-[#9a7a6e]">Cargando...</p>}

      {/* Muestra la respuesta de la última acción ejecutada */}
      {respuesta && !loading && (
        <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#b38c7d]">Respuesta</p>

          {"pedido" in respuesta ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1 text-[12px] font-medium text-[#6f5a50]">Pedido actualizado:</p>
                <pre className="overflow-auto whitespace-pre-wrap rounded-[12px] bg-[#f0e9e0] p-4 text-[12px] text-[#5d4d45]">
                  {JSON.stringify(respuesta.pedido, null, 2)}
                </pre>
              </div>
              {respuesta.evento && (
                <div>
                  <p className="mb-1 text-[12px] font-medium text-[#6f5a50]">Stock del evento:</p>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-[12px] bg-[#f0e9e0] p-4 text-[12px] text-[#5d4d45]">
                    {JSON.stringify(respuesta.evento, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <pre className="overflow-auto whitespace-pre-wrap rounded-[12px] bg-[#f0e9e0] p-4 text-[12px] text-[#5d4d45]">
              {JSON.stringify(respuesta, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
