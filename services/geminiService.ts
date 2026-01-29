
import { GoogleGenAI } from "@google/genai";

export const generateFaithCard = async (theme: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere um "Card de Fé" curto e inspirador em português. O tema é: ${theme}. 
    Inclua:
    1. Um versículo bíblico relevante.
    2. Uma breve reflexão (máximo 2 frases).
    3. Uma sugestão de oração de uma frase.
    
    Retorne o texto formatado lindamente.`,
  });
  
  return response.text;
};
