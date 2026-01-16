import { GoogleGenAI, Type } from "@google/genai";
import { AppData } from "../types";

// Initialize Gemini Client
// Note: In a production environment, this should be proxied through a backend to hide the key.
// For this frontend-only demo, we assume the user has the key in env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchAppsWithGemini = async (query: string, availableApps: AppData[]): Promise<{ appIds: string[], reason: string }> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. Falling back to basic search.");
    // Fallback logic for basic substring matching if no API key
    const lowerQuery = query.toLowerCase();
    const matches = availableApps
      .filter(app => 
        app.title.toLowerCase().includes(lowerQuery) || 
        app.description.toLowerCase().includes(lowerQuery) ||
        app.category.toLowerCase().includes(lowerQuery)
      )
      .map(app => app.id);
    return { appIds: matches, reason: "Local search (API Key missing)" };
  }

  try {
    const appsSummary = availableApps.map(app => ({
      id: app.id,
      title: app.title,
      description: app.description,
      category: app.category
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Query: "${query}"
      
      You are an intelligent App Store Assistant for "Xopoc Store". 
      Below is a list of available apps (JSON format).
      Your goal is to identify which apps best match the user's intent.
      
      Available Apps:
      ${JSON.stringify(appsSummary)}
      
      Return a JSON object with:
      1. "matchIds": an array of app IDs that match.
      2. "reasoning": a very short, friendly sentence explaining why you picked these (e.g., "Here are some great racing games for you.").
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      appIds: result.matchIds || [],
      reason: result.reasoning || "Here is what I found."
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { appIds: [], reason: "Sorry, I had trouble connecting to the AI brain." };
  }
};