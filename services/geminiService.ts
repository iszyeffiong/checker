
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
// Only initialize if we have a key to avoid immediate instantiation errors if any
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getOracleReading(address: string, isEligible: boolean): Promise<string> {
  // Fallback messages
  const successFallback = "The dice have rolled in your favor!";
  const failFallback = "The cards aren't in your hand this time.";

  if (!apiKey || !ai) {
    console.warn("Gemini API Key is missing or invalid. Using fallback messages.");
    return isEligible ? successFallback : failFallback;
  }

  try {
    const prompt = isEligible
      ? `Give a 1-sentence "lucky" league-themed encouragement for this crypto wallet: ${address}. Use doodle/sketchy metaphors. Keep it short.`
      : `Give a 1-sentence "better luck next time" sketchy message for this wallet: ${address}. Be witty but polite. Keep it short.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8,
      },
    });

    return response.text || (isEligible ? successFallback : failFallback);
  } catch (error) {
    console.error("Gemini Error:", error);
    // If the error suggests invalid key, we might want to be explicit, but the catch-all works for now
    return isEligible ? "You are definitely on the list!" : "Not on the list today.";
  }
}
