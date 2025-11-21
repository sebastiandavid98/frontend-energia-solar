import React from "react";
import {
  Sun,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  BarChart3,
  Bot,
} from "lucide-react";

// Ajusta estos imports al nombre real de tus componentes:
import TradingFlow from "./TradingFlow";          // tus PASO 1,2,3,4
import HelpAssistant from "./HelpAssistant";      // tu IA
import ProjectHighlights from "./ProjectHighlights"; // Características

export default function SolsexPlatform({ currentUser, onLogout }) {
  const roleLabel =
    currentUser?.role === "ADMIN"
      ? "ADMINISTRACIÓN"
      : currentUser?.role || "USUARIO";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white">
      {/* NAV SUPERIOR */}
      <header className="border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Solsex</h1>
              <p className="text-[11px] text-slate-400">
                Plataforma de Intercambio de Energía Solar
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <span className="cursor-default text-purple-400 font-semibold">
              Panel
            </span>
            <span className="cursor-default hover:text-white">
              Mercado P2P
            </span>
            <span className="cursor-default hover:text-white">
              Analítica
            </span>
            <span className="cursor-default hover:text-white">IA Asistente</span>
          </nav>

          <div className="flex items-center gap-4 text-xs">
            {currentUser && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-semibold">{currentUser.name}</span>
                <span className="text-slate-400">{roleLabel}</span>
              </div>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs border border-slate-700 transition-colors"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO DATOS CUENTA */}
      <section className="border-b border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-4">
          {/* DATOS DE CUENTA */}
          <div className="md:col-span-1">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 h-full flex flex-col justify-between shadow-lg">
              <div>
                <p className="text-xs text-slate-400 mb-1">Cuenta actual</p>
                <p className="text-sm">
                  <span className="font-semibold text-slate-100">
                    DNI interno:
                  </span>{" "}
                  <span className="text-slate-300">
                    {currentUser?.id || "—"}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-slate-100">Nombre:</span>{" "}
                  <span className="text-slate-300">
                    {currentUser?.name || "—"}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-slate-100">Correo:</span>{" "}
                  <span className="text-slate-300">
                    {currentUser?.email || "—"}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-slate-100">Rol:</span>{" "}
                  <span className="text-purple-300">{roleLabel}</span>
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Estado</p>
                    <p className="font-semibold text-slate-100">
                      Operando en Solsex
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Seguridad</p>
                    <p className="font-semibold text-slate-100">
                      Custodia simulada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TARJETAS SUPERIORES */}
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400">
                  Precio de referencia kWh
                </p>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-300 mb-1">
                0.45 USD
              </p>
              <p className="text-xs text-emerald-400">
                +2.5% hoy (dato simulado)
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400">Actividad P2P</p>
                <BarChart3 className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-sm text-slate-300">
                Usa el panel central para registrar producción, consumo y
                transacciones de energía con otros usuarios.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400">Consejo rápido</p>
                <TrendingDown className="w-4 h-4 text-pink-400" />
              </div>
              <p className="text-xs text-slate-300">
                Antes de vender o comprar kWh, consulta al asistente IA para
                entender tu posición energética y los riesgos del mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-4">
        {/* CENTRO: tus pasos (PASO 1–4, gráficos, etc.) */}
        <section className="lg:col-span-2 space-y-4">
          <TradingFlow currentUser={currentUser} />
        </section>

        {/* DERECHA: IA + Características */}
        <aside className="space-y-4">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              Solsex (IA)
            </h3>
            <HelpAssistant />
          </div>

          <ProjectHighlights />
        </aside>
      </main>
    </div>
  );
}
