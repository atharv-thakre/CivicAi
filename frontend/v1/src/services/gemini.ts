import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function polishComplaint(params: {
  title: string;
  description: string;
  language: string;
}): Promise<{ title: string; description: string }> {
  const { title, description, language } = params;

  const prompt = `
    You are a professional civic assistant. Your task is to polish a citizen's complaint to make it more effective, formal, and clear for urban authorities.
    
    Target Language: ${language}
    Original Title: ${title}
    Original Description: ${description}

    Guidelines:
    1. Improve grammar and professional tone.
    2. Keep the core facts but remove emotional outbursts or irrelevant details.
    3. Ensure the summary is concise and actionable.
    4. Maintain the response in the requested language.
    
    Return a JSON object with:
    {
      "title": "A concise, professional title",
      "description": "A well-structured, clear description"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return { title, description };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { title, description };
  }
}
