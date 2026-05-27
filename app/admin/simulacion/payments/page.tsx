"use client";

import { useState, useEffect } from "react";

type Evento = {
  idEvento: number;
  nombreEvento: string;
  stock: number;
};

export default function PaymentsSimulacion() {
  const [respuesta, setRespuesta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [idEvento, setIdEvento] = useState("");
  const [idPedido, setIdPedido] = useState("");
  const [estadoTransaccion, setEstadoTransaccion] = useState("pagado");

  // Carga eventos y pedidos al montar para poblar los selects
  useEffect(() => {
    fetch("/api/buyer/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch(() => setEventos([]));

    // TODO: quitar cuando se integren las apps — GET temporal solo para la simulación
    fetch("/api/seller/pedidos")
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
    <div className="p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Simulacion Payments</h1>

      <div className="flex flex-col gap-6">

        {/* Acción 1 y 3 comparten el mismo select de evento */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500">Seleccioná un evento para las acciones 1 y 3:</p>
          <div className="flex items-center gap-2">
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

            {/* Acción 1: pedir detalle del evento seleccionado */}
            <button
              onClick={pedirDetalleEvento}
              disabled={!idEvento}
              className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
            >
              Pedir detalle evento
            </button>

            {/* Acción 3: obtener organizador del evento seleccionado */}
            <button
              onClick={obtenerOrganizador}
              disabled={!idEvento}
              className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
            >
              Obtener organizador
            </button>
          </div>
        </div>

        {/* Acción 2: confirmar o cancelar un pago por idPedido */}
        <div className="flex items-center gap-2">
          <select
            value={idPedido}
            onChange={(e) => setIdPedido(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Seleccionar pedido</option>
            {pedidos.map((p) => (
              <option key={p.idPedido} value={p.idPedido}>
                #{p.idPedido} — Evento {p.idEvento} — {p.estado} — ${p.monto}
              </option>
            ))}
          </select>

          <select
            value={estadoTransaccion}
            onChange={(e) => setEstadoTransaccion(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <button
            onClick={enviarEstado}
            disabled={!idPedido}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
          >
            Enviar estado de transaccion
          </button>
        </div>

      </div>

      {loading && <p className="text-slate-500">Cargando...</p>}

      {/* Muestra la respuesta de la última acción ejecutada */}
      {respuesta && !loading && (
        <div className="border rounded p-4 bg-slate-50">
          <h2 className="font-semibold mb-2">Respuesta:</h2>

          {"pedido" in respuesta ? (
            <>
              <p className="text-sm font-medium text-slate-600 mt-2">Pedido actualizado:</p>
              <pre className="text-sm overflow-auto whitespace-pre-wrap">
                {JSON.stringify(respuesta.pedido, null, 2)}
              </pre>

              {respuesta.evento && (
                <>
                  <p className="text-sm font-medium text-slate-600 mt-4">Stock del evento:</p>
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(respuesta.evento, null, 2)}
                  </pre>
                </>
              )}
            </>
          ) : (
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {JSON.stringify(respuesta, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
