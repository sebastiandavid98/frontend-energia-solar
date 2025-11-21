import React from "react";

const items = [
  {
    title: "Sistema P2P con Custodia Inteligente (Smart Escrow)",
    strong: "Punto Fuerte:",
    description:
      "Permite la compra/venta entre pares con un sistema de custodia digital seguro. El activo o el dinero se retiene automáticamente hasta que ambas partes confirman el cumplimiento de la transacción.",
    impactTitle: "Impacto:",
    impact:
      "Genera confianza y seguridad máximas, reduciendo el riesgo de fraude entre usuarios que no se conocen.",
  },
  {
    title: "Integración de IA Predictiva en el Frontend",
    strong: "Punto Fuerte:",
    description:
      "La inteligencia artificial se integra en la experiencia del usuario para ofrecer sugerencias personalizadas, insights de mercado y apoyo en la toma de decisiones.",
    impactTitle: "Impacto:",
    impact:
      "Sugiere las mejores operaciones P2P y mejora la interfaz en tiempo real según el comportamiento del inversor.",
  },
  {
    title: "Arquitectura Microfrontend Escalable",
    strong: "Punto Fuerte:",
    description:
      "El sistema se concibe como módulos independientes: autenticación, dashboard, marketplace P2P y analítica.",
    impactTitle: "Impacto:",
    impact:
      "Permite desplegar cambios por módulo, escalar solo las partes críticas y trabajar con múltiples equipos en paralelo.",
  },
  {
    title: "Dashboard Inmersivo con Datos en Tiempo Real",
    strong: "Punto Fuerte:",
    description:
      "Inspirado en plataformas de trading, combina indicadores, gráficos y resúmenes de posición en una sola vista.",
    impactTitle: "Impacto:",
    impact:
      "El usuario tiene una visibilidad clara de su saldo, sus operaciones y la evolución de su energía en el tiempo.",
  },
  {
    title: "Autenticación Robusta y Experiencia Fluida",
    strong: "Punto Fuerte:",
    description:
      "Diseñado para integrar mecanismos como KYC, MFA y OAuth2 en entornos productivos, manteniendo un flujo sencillo.",
    impactTitle: "Impacto:",
    impact:
      "Equilibrio entre seguridad de grado empresarial y experiencia de usuario sin fricciones.",
  },
];

export default function ProjectHighlights() {
  return (
    <section className="bg-slate-800/80 rounded-2xl p-4 text-white">
      <h2 className="text-lg font-bold mb-1">
        Características Altamente Destacables y Diferenciadoras
      </h2>
      <p className="text-xs text-slate-300 mb-3">
        Puntos clave que muestran por qué Solsex puede escalar como una
        solución empresarial para el intercambio de energía.
      </p>

      <div className="grid md:grid-cols-1 gap-3 text-xs md:text-sm">
        {items.map((item) => (
          <article
            key={item.title}
            className="bg-slate-900/70 rounded-xl p-3 border border-slate-700/60 hover:border-purple-500/70 transition-colors"
          >
            <h3 className="font-semibold mb-1 text-purple-200">
              {item.title}
            </h3>
            <p className="mb-1">
              <span className="font-semibold">{item.strong} </span>
              {item.description}
            </p>
            <p>
              <span className="font-semibold">{item.impactTitle} </span>
              {item.impact}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 text-[11px] text-slate-400">
        <p className="font-semibold mb-1">Tecnologías Clave (Diseño de Arquitectura)</p>
        <p>
          <span className="font-semibold">Frontend base: </span>
          React.js, TypeScript, Tailwind CSS.
        </p>
        <p>
          <span className="font-semibold">Arquitectura: </span>
          Microfrontends (Module Federation).
        </p>
        <p>
          <span className="font-semibold">IA en cliente: </span>
          TensorFlow.js / librerías de ML para ejecución en navegador.
        </p>
        <p>
          <span className="font-semibold">Visualización: </span>
          Recharts, D3.js y gráficos tipo trading para datos en tiempo real.
        </p>
        <p>
          <span className="font-semibold">Autenticación: </span>
          OAuth 2.0 / OIDC, JWT como propuesta para entornos empresariales.
        </p>
      </div>
    </section>
  );
}
