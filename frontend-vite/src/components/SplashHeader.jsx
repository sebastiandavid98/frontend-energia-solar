import React from "react";

export default function SplashHeader({ currentUser, onLogout }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      {/* Logo + título */}
      <div className="flex items-center gap-3">
        {/* Logo circular con animación */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center text-slate-900 font-extrabold text-xl shadow-xl animate-pulse">
            SX
          </div>
          <div className="absolute -inset-1 rounded-full border border-yellow-300/40 blur-sm opacity-70" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Solsex
            <span className="text-sm md:text-base font-normal text-purple-300 ml-2">
              Plataforma de Intercambio de Energía Solar
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Usa tu cuenta para registrar producción y consumo de energía, operar
            transacciones P2P y tomar decisiones informadas como en un mercado
            profesional.
          </p>
        </div>
      </div>

      {/* Info del usuario + botón salir */}
      {currentUser && (
        <div className="text-right text-xs md:text-sm">
          <p className="font-semibold">{currentUser.name}</p>
          <p className="text-slate-300 break-all">{currentUser.email}</p>
          <p className="text-[11px] text-slate-400">
            DNI / ID interno: {currentUser.id}
          </p>
          <button
            onClick={onLogout}
            className="mt-2 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-red-300 text-[11px] uppercase tracking-wide"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
