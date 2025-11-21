import { useState } from "react";
import { askSolsexAssistant } from "../ai/assistant";

export default function HelpAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setAnswer("");

    if (!question.trim()) return;

    setLoading(true);
    try {
      const resp = await askSolsexAssistant(question.trim());
      setAnswer(resp);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "No se pudo obtener una respuesta de la IA. Revisa tu conexión o la configuración de la API."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-2xl text-white">
      <h2 className="text-lg font-bold mb-2">Asistente Solsex (IA)</h2>
      <p className="text-xs text-slate-300 mb-2">
        Pregunta sobre compra/venta de energía, interpretación de tu resumen,
        riesgos u oportunidades en el mercado de kWh.
      </p>
      <form onSubmit={handleAsk} className="space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ej: ¿Es buen momento para vender mi energía excedente? ¿Qué riesgos tengo si consumo más de lo que produzco?"
          className="w-full h-20 text-black p-2 rounded text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1 rounded text-sm"
        >
          {loading ? "Consultando a la IA..." : "Preguntar a la IA"}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-3 text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      {answer && (
        <div className="mt-3 text-sm bg-slate-900 p-2 rounded whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}
