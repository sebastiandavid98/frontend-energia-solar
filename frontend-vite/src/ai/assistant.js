const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-4.1-mini";

/**
 * Llama a OpenAI para obtener una respuesta experta sobre energía.
 * @param {string} question - Pregunta del usuario.
 * @returns {Promise<string>} - Respuesta generada por el modelo.
 */
export async function askSolsexAssistant(question) {
  if (!apiKey) {
    throw new Error(
      "No se ha configurado VITE_OPENAI_API_KEY en el archivo .env del frontend."
    );
  }

  const systemPrompt =
    "Eres un asistente experto en mercados de energía solar y plataformas P2P de intercambio de kWh. " +
    "Respondes en español, de forma clara, profesional y pedagógica. " +
    "Tu objetivo es ayudar al usuario a interpretar su saldo energético, " +
    "sus riesgos, oportunidades de compra/venta y buenas prácticas de gestión de energía. " +
    "No inventes datos numéricos específicos de su cuenta, pero sí puedes dar ejemplos y recomendaciones generales. " +
    "Evita respuestas muy largas; prioriza claridad y aplicabilidad práctica.";

  const userPrompt =
    "Pregunta del usuario sobre su operación en la plataforma Solsex: \n\n" +
    question +
    "\n\n" +
    "Recuerda: responde como un asesor profesional en energía, sin dar consejos financieros extremos.";

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error de OpenAI:", response.status, errorText);
    throw new Error("No se pudo obtener respuesta de la IA.");
  }

  const data = await response.json();
  const content =
    data.choices?.[0]?.message?.content ||
    "Lo siento, no pude generar una respuesta en este momento.";
  return content.trim();
}
