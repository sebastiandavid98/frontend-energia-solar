import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

/**
 * energySummary: { totalProduction, totalConsumption }
 * txSummary: { totalSent, totalReceived }
 */
export default function AnalyticsPanel({ energySummary, txSummary }) {
  const energyData = [
    { name: "Producción", kwh: energySummary.totalProduction || 0 },
    { name: "Consumo", kwh: energySummary.totalConsumption || 0 },
  ];

  const txData = [
    { name: "Enviados", kwh: txSummary.totalSent || 0 },
    { name: "Recibidos", kwh: txSummary.totalReceived || 0 },
  ];

  return (
    <section className="bg-slate-800/90 rounded-2xl p-4 text-white mt-4">
      <h2 className="text-lg font-bold mb-1">
        Análisis de tu posición energética
      </h2>
      <p className="text-xs text-slate-300 mb-3">
        Visualiza tu balance de producción/consumo y el flujo de kWh enviados y
        recibidos en la plataforma.
      </p>

      <div className="grid md:grid-cols-2 gap-4 h-64">
        {/* Producción vs Consumo */}
        <div className="bg-slate-900/70 rounded-xl p-2">
          <p className="text-xs mb-1 font-semibold">
            Producción vs consumo (kWh)
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kwh" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enviados vs Recibidos */}
        <div className="bg-slate-900/70 rounded-xl p-2">
          <p className="text-xs mb-1 font-semibold">
            Flujo P2P: kWh enviados vs recibidos
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={txData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="kwh" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
