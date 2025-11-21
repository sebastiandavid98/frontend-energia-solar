import { useState } from "react";
import { API_URL } from "../api";

const STEP_TITLES = [
  "¿En qué quieres invertir?",
  "Elige el activo",
  "Configura tu operación",
  "Confirma y listo",
];

export default function InvestmentFlow({ currentUser }) {
  const [step, setStep] = useState(0);
  const [operation, setOperation] = useState({
    type: "BUY_ENERGY", // BUY_ENERGY, SELL_ENERGY, TRANSFER
    asset: "",          // por ejemplo: "kWh Solar", "Acción verde"
    userFrom: "",
    userTo: "",
    amountKwh: "",
    price: "",
  });
  const [message, setMessage] = useState("");

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleConfirm = async () => {
    setMessage("Enviando operación...");

    try {
      // Aquí decides qué endpoint pegar según type
      if (operation.type === "BUY_ENERGY" || operation.type === "SELL_ENERGY") {
        // Registrar récord de energía
        await fetch(`${API_URL}/energy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            productionKwh:
              operation.type === "BUY_ENERGY" ? Number(operation.amountKwh) : 0,
            consumptionKwh:
              operation.type === "SELL_ENERGY" ? Number(operation.amountKwh) : 0,
          }),
        });
      } else if (operation.type === "TRANSFER") {
        // Crear transacción
        await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromUserId: operation.userFrom,
            toUserId: operation.userTo,
            amountKwh: Number(operation.amountKwh),
          }),
        });
      }

      setMessage("Operación registrada con éxito ✅");
    } catch (err) {
      setMessage("Error al registrar operación: " + err.message);
    }
  };

  return (
    <div className="mt-6 bg-slate-900 text-white">
      {/* Encabezado tipo app */}
      <div className="mb-4">
        <p className="text-sm uppercase text-purple-300">
          Paso {step + 1} de 4
        </p>
        <h2 className="text-xl font-bold">{STEP_TITLES[step]}</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Paso 1: Tipo de operación */}
        <StepCard active={step === 0}>
          <h3 className="font-semibold mb-2">1er paso</h3>
          <p className="text-sm mb-3">
            Selecciona el tipo de operación que deseas realizar.
          </p>
          <div className="space-y-2">
            <OptionButton
              selected={operation.type === "BUY_ENERGY"}
              onClick={() => setOperation({ ...operation, type: "BUY_ENERGY" })}
            >
              Comprar energía
            </OptionButton>
            <OptionButton
              selected={operation.type === "SELL_ENERGY"}
              onClick={() =>
                setOperation({ ...operation, type: "SELL_ENERGY" })
              }
            >
              Vender energía
            </OptionButton>
            <OptionButton
              selected={operation.type === "TRANSFER"}
              onClick={() => setOperation({ ...operation, type: "TRANSFER" })}
            >
              Transferir kWh a otro usuario
            </OptionButton>
          </div>
        </StepCard>

        {/* Paso 2: Elegir activo */}
        <StepCard active={step === 1}>
          <h3 className="font-semibold mb-2">2do paso</h3>
          <p className="text-sm mb-3">
            Elige el activo o tipo de energía sobre el que operarás.
          </p>
          <div className="space-y-2">
            <OptionButton
              selected={operation.asset === "KWH_SOLAR"}
              onClick={() => setOperation({ ...operation, asset: "KWH_SOLAR" })}
            >
              kWh Solar
            </OptionButton>
            <OptionButton
              selected={operation.asset === "BONO_VERDE"}
              onClick={() => setOperation({ ...operation, asset: "BONO_VERDE" })}
            >
              Bono verde
            </OptionButton>
            <OptionButton
              selected={operation.asset === "OTRO"}
              onClick={() => setOperation({ ...operation, asset: "OTRO" })}
            >
              Otro activo energético
            </OptionButton>
          </div>
        </StepCard>

        {/* Paso 3: Monto */}
        <StepCard active={step === 2}>
          <h3 className="font-semibold mb-2">3er paso</h3>
          <p className="text-sm mb-3">
            Define el monto de kWh o dinero que deseas operar.
          </p>
          <div className="space-y-2">
            {operation.type === "TRANSFER" && (
              <>
                <input
                  placeholder="Desde ID usuario"
                  value={operation.userFrom}
                  onChange={(e) =>
                    setOperation({ ...operation, userFrom: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded text-black"
                />
                <input
                  placeholder="Hacia ID usuario"
                  value={operation.userTo}
                  onChange={(e) =>
                    setOperation({ ...operation, userTo: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded text-black"
                />
              </>
            )}

            <input
              placeholder="Cantidad kWh"
              value={operation.amountKwh}
              onChange={(e) =>
                setOperation({ ...operation, amountKwh: e.target.value })
              }
              className="w-full px-2 py-1 rounded text-black"
            />
            <input
              placeholder="Precio estimado (opcional)"
              value={operation.price}
              onChange={(e) =>
                setOperation({ ...operation, price: e.target.value })
              }
              className="w-full px-2 py-1 rounded text-black"
            />
          </div>
        </StepCard>

        {/* Paso 4: Confirmar */}
        <StepCard active={step === 3}>
          <h3 className="font-semibold mb-2">4to paso</h3>
          <p className="text-sm mb-2">
            Revisa el resumen y confirma la operación.
          </p>
          <div className="bg-slate-900 p-2 rounded text-xs space-y-1">
            <p>
              <span className="font-semibold">Operación:</span>{" "}
              {operation.type}
            </p>
            <p>
              <span className="font-semibold">Activo:</span> {operation.asset}
            </p>
            <p>
              <span className="font-semibold">Cantidad:</span>{" "}
              {operation.amountKwh} kWh
            </p>
            {operation.type === "TRANSFER" && (
              <>
                <p>
                  <span className="font-semibold">De:</span>{" "}
                  {operation.userFrom}
                </p>
                <p>
                  <span className="font-semibold">Para:</span>{" "}
                  {operation.userTo}
                </p>
              </>
            )}
          </div>
          <button
            onClick={handleConfirm}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-3 text-sm"
          >
            Confirmar operación
          </button>
          {message && <p className="mt-2 text-xs">{message}</p>}
        </StepCard>
      </div>

      {/* Navegación de pasos */}
      <div className="flex justify-between mt-4 text-sm">
        <button
          onClick={back}
          disabled={step === 0}
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
        active ? "bg-slate-800 shadow-lg border border-purple-500" : "bg-slate-800/60"
      }`}
    >
      {children}
    </div>
  );
}

function OptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-sm ${
        selected ? "bg-purple-600" : "bg-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
