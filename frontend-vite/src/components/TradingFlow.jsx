import { useEffect, useState } from "react";
import { API_URL } from "../api";

const STEP_TITLES = [
  "1er paso: Verifica tu usuario",
  "2do paso: Registra tu récord energético",
  "3er paso: Configura una transacción P2P",
  "4to paso: Revisa tu resumen profesional",
];

export default function TradingFlow({
  currentUser,
  onEnergySummaryUpdate,
  onTxSummaryUpdate,
}) {
  // Empezamos en el paso 1 porque ya está logueado
  const [step, setStep] = useState(1);

  const [energyForm, setEnergyForm] = useState({
    productionKwh: "",
    consumptionKwh: "",
  });

  const [txForm, setTxForm] = useState({
    toUserId: "",
    amountKwh: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Datos de resumen
  const [energySummary, setEnergySummary] = useState({
    totalProduction: 0,
    totalConsumption: 0,
  });
  const [txSummary, setTxSummary] = useState({
    totalSent: 0,
    totalReceived: 0,
    transactions: [],
  });

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  // ------- Cargar resumen desde el backend -------
  const loadSummary = async () => {
    if (!currentUser) return;

    try {
      const [energyRes, txRes] = await Promise.all([
        fetch(`${API_URL}/energy`),
        fetch(`${API_URL}/transactions`),
      ]);

      if (!energyRes.ok || !txRes.ok) {
        throw new Error("No se pudieron cargar datos de resumen");
      }

      const [energyList, txList] = await Promise.all([
        energyRes.json(),
        txRes.json(),
      ]);

      // Filtrar por usuario actual
      const userEnergy = energyList.filter(
        (e) => e.userId === currentUser.id
      );
      const userTx = txList.filter(
        (t) => t.fromUserId === currentUser.id || t.toUserId === currentUser.id
      );

      const totalProduction = userEnergy.reduce(
        (sum, e) => sum + (e.productionKwh || 0),
        0
      );
      const totalConsumption = userEnergy.reduce(
        (sum, e) => sum + (e.consumptionKwh || 0),
        0
      );

      let totalSent = 0;
      let totalReceived = 0;
      userTx.forEach((t) => {
        if (t.fromUserId === currentUser.id) {
          totalSent += t.amountKwh || 0;
        }
        if (t.toUserId === currentUser.id) {
          totalReceived += t.amountKwh || 0;
        }
      });

      const energyData = { totalProduction, totalConsumption };
      const txData = { totalSent, totalReceived, transactions: userTx };

      setEnergySummary(energyData);
      setTxSummary(txData);
      setError("");

      // 🔁 Notificar al padre (App.jsx) para AnalyticsPanel
      if (onEnergySummaryUpdate) {
        onEnergySummaryUpdate(energyData);
      }
      if (onTxSummaryUpdate) {
        onTxSummaryUpdate({ totalSent, totalReceived });
      }
    } catch (err) {
      console.error("Error cargando resumen:", err);
      setError("No se pudo actualizar el resumen. Intenta de nuevo más tarde.");
    }
  };

  useEffect(() => {
    loadSummary();
  }, [currentUser]);

  // ------- Paso 2: registrar energía -------
  const handleSaveEnergy = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const prod = Number(energyForm.productionKwh);
    const cons = Number(energyForm.consumptionKwh);

    if (isNaN(prod) || isNaN(cons) || prod < 0 || cons < 0) {
      setError(
        "La producción y el consumo deben ser números positivos. Verifica los valores."
      );
      return;
    }

    setMessage("Guardando récord energético...");

    try {
      const res = await fetch(`${API_URL}/energy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          productionKwh: prod,
          consumptionKwh: cons,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar energía");

      await res.json();
      setMessage("Récord energético guardado correctamente ✅");
      setEnergyForm({ productionKwh: "", consumptionKwh: "" });
      await loadSummary();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el récord energético.");
      setMessage("");
    }
  };

  // ------- Paso 3: crear transacción -------
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const amount = Number(txForm.amountKwh);
    if (!txForm.toUserId.trim()) {
      setError("Debes indicar el ID (DNI) del usuario destino.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("La cantidad de kWh debe ser un número mayor a cero.");
      return;
    }

    setMessage("Guardando transacción P2P...");

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          toUserId: txForm.toUserId.trim(),
          amountKwh: amount,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar transacción");

      await res.json();
      setMessage("Transacción registrada correctamente ✅");
      setTxForm({ toUserId: "", amountKwh: "" });
      await loadSummary();
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar la transacción.");
      setMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-purple-300 uppercase">
          PASO {step + 1} DE 4
        </p>
        <h2 className="text-lg font-bold">{STEP_TITLES[step]}</h2>
      </div>

      {/* Mensajes globales */}
      {(message || error) && (
        <div className="text-xs">
          {message && <p className="text-emerald-300">{message}</p>}
          {error && <p className="text-red-300">{error}</p>}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        {/* Columna 1 – Verificación de usuario */}
        <StepCard active={step === 1}>
          <h3 className="font-semibold mb-2">Usuario actual</h3>
          <p className="text-xs mb-2">
            Estos son los datos de la cuenta con la que estás operando en
            Solsex.
          </p>
          <div className="text-xs bg-slate-900 rounded p-2 space-y-1">
            <p>
              <span className="font-semibold">DNI (ID interno):</span>{" "}
              {currentUser.id}
            </p>
            <p>
              <span className="font-semibold">Nombre:</span>{" "}
              {currentUser.name}
            </p>
            <p>
              <span className="font-semibold">Correo:</span>{" "}
              {currentUser.email}
            </p>
            <p>
              <span className="font-semibold">Rol:</span> {currentUser.role}
            </p>
          </div>
        </StepCard>

        {/* Columna 2 – Récord energético */}
        <StepCard active={step === 2}>
          <h3 className="font-semibold mb-2">Récord energético</h3>
          <p className="text-xs mb-2">
            Usa tu cuenta para registrar producción y consumo de energía.
          </p>
          <div className="text-[11px] mb-2">
            Usuario actual: {currentUser ? currentUser.id : "No definido"}
          </div>
          <form className="space-y-2 text-sm" onSubmit={handleSaveEnergy}>
            <input
              placeholder="Producción kWh"
              value={energyForm.productionKwh}
              onChange={(e) =>
                setEnergyForm({
                  ...energyForm,
                  productionKwh: e.target.value,
                })
              }
              className="w-full py-1 px-2 rounded text-black"
            />
            <input
              placeholder="Consumo kWh"
              value={energyForm.consumptionKwh}
              onChange={(e) =>
                setEnergyForm({
                  ...energyForm,
                  consumptionKwh: e.target.value,
                })
              }
              className="w-full py-1 px-2 rounded text-black"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded mt-1"
            >
              Guardar récord
            </button>
          </form>
        </StepCard>

        {/* Columna 3 – Transacción P2P */}
        <StepCard active={step === 3}>
          <h3 className="font-semibold mb-2">Transacción de energía P2P</h3>
          <p className="text-xs mb-2">
            Simula una compra/venta o transferencia de kWh a otro usuario.
          </p>
          <div className="text-[11px] mb-2">
            DNI remitente (desde): {currentUser ? currentUser.id : "—"}
          </div>
          <form className="space-y-2 text-sm" onSubmit={handleSaveTransaction}>
            <input
              placeholder="DNI / ID usuario destino"
              value={txForm.toUserId}
              onChange={(e) =>
                setTxForm({ ...txForm, toUserId: e.target.value })
              }
              className="w-full py-1 px-2 rounded text-black"
            />
            <input
              placeholder="Cantidad kWh"
              value={txForm.amountKwh}
              onChange={(e) =>
                setTxForm({ ...txForm, amountKwh: e.target.value })
              }
              className="w-full py-1 px-2 rounded text-black"
            />
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-1 rounded mt-1"
            >
              Guardar transacción
            </button>
          </form>
        </StepCard>

        {/* Columna 4 – Resumen profesional */}
        <StepCard active={step === 4}>
          <h3 className="font-semibold mb-2">Resumen de posición</h3>
          <p className="text-xs mb-2">
            Visión consolidada de tu saldo energético y de tus operaciones P2P.
          </p>
          <div className="text-xs bg-slate-900 rounded p-2 space-y-1">
            <p className="font-semibold">Energía acumulada</p>
            <p>Producción total: {energySummary.totalProduction} kWh</p>
            <p>Consumo total: {energySummary.totalConsumption} kWh</p>
            <p>
              Saldo neto:{" "}
              {energySummary.totalProduction -
                energySummary.totalConsumption}{" "}
              kWh
            </p>

            <hr className="border-slate-700 my-1" />

            <p className="font-semibold">Transacciones P2P</p>
            <p>kWh enviados: {txSummary.totalSent}</p>
            <p>kWh recibidos: {txSummary.totalReceived}</p>
            <p>
              Balance neto transacciones:{" "}
              {txSummary.totalReceived - txSummary.totalSent} kWh
            </p>

            <hr className="border-slate-700 my-1" />

            <p className="font-semibold">Historial reciente</p>
            {txSummary.transactions.length === 0 ? (
              <p>No hay transacciones registradas.</p>
            ) : (
              <ul className="space-y-1 max-h-32 overflow-auto">
                {txSummary.transactions.map((t) => (
                  <li key={t.id}>
                    {t.fromUserId === currentUser.id ? "Enviaste" : "Recibiste"}{" "}
                    {t.amountKwh} kWh{" "}
                    {t.fromUserId === currentUser.id
                      ? `a ${t.toUserId}`
                      : `de ${t.fromUserId}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </StepCard>
      </div>

      <div className="flex justify-between items-center mt-3 text-sm">
        <button
          onClick={back}
          disabled={step === 1}
          className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          onClick={next}
          disabled={step === 3}
          className="px-3 py-1 rounded bg-purple-600"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function StepCard({ active, children }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        active
          ? "bg-slate-800 shadow-lg border border-purple-500"
          : "bg-slate-800/70"
      }`}
    >
      {children}
    </div>
  );
}
