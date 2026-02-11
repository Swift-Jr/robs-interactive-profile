import { GoogleGenAI } from "@google/genai";
import { CVData } from "../types";

export const improveTextWithAI = async (text: string, context: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert CV writer and career coach.
      Please improve the following text for a professional CV.
      
      Context of the text: ${context}
      
      Original Text:
      "${text}"
      
      Instructions:
      - Make it more impactful and action-oriented.
      - Keep it concise.
      - Correct any grammar issues.
      - Return ONLY the improved text, no explanations or quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Fallback to original text on error
  }
};

export const generateProfileVideo = async (data: CVData): Promise<string | undefined> => {
  try {
    // Veo models require user to select their own API key
    // Cast window to any to access aistudio which is injected by the environment
    const win = window as any;
    if (win.aistudio) {
      const hasKey = await win.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await win.aistudio.openSelectKey();
      }
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Try to fetch profile image for visual reference
    let imageInput = undefined;
    if (data.profileImage && data.profileImage.startsWith('http')) {
      try {
        const response = await fetch(data.profileImage);
        if (response.ok) {
          const blob = await response.blob();
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          imageInput = {
            imageBytes: base64Data,
            mimeType: blob.type || 'image/jpeg',
          };
        }
      } catch (e) {
        console.warn("Could not fetch profile image for video (likely CORS), skipping image input.");
      }
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic professional video intro for ${data.name}, ${data.title}. Context: ${data.summary.slice(0, 200)}`,
      ...(imageInput ? { image: imageInput } : {}),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return undefined;

  } catch (error: any) {
    console.error("Veo API Error:", error);
    const win = window as any;
    // If request failed due to missing/invalid key entity, prompt selection again
    if (error.message?.includes("Requested entity was not found") && win.aistudio) {
       await win.aistudio.openSelectKey();
    }
    return undefined;
  }
};