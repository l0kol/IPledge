import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Ensure API_KEY is available in the environment.
// The prompt specifies to assume process.env.API_KEY is pre-configured.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY for Gemini is not set in environment variables. Gemini service will be disabled.");
}

// Initialize GoogleGenAI only if API key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // General text tasks model

export const generateProjectAnalysis = async (projectIdea: string, existingHistory?: ChatMessage[]): Promise<string> => {
  if (!ai) {
    return "Gemini API is not configured. Please set the API_KEY.";
  }

  const prompt = `
    Analyze the following project idea for a decentralized grant funding platform. 
    Provide a brief analysis covering potential strengths, weaknesses, opportunities, and threats (SWOT). 
    Also, suggest 2-3 key milestones for such a project. Format the output clearly.
    Project Idea: "${projectIdea}"
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // Omitting thinkingConfig to use default (enabled) for higher quality analysis
        temperature: 0.7, // Slightly creative but still factual
        topP: 0.95,
        maxOutputTokens: 500,
      }
    });
    
    // The .text property directly provides the string output
    return response.text;

  } catch (error) {
    console.error("Error generating project analysis with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
             return "Error: The provided API key is not valid. Please check your API_KEY environment variable.";
        }
         return `Error generating analysis: ${error.message}`;
    }
    return "An unknown error occurred while generating project analysis.";
  }
};


export const streamChatResponse = async (
  message: string, 
  history: ChatMessage[],
  setStreamedContent: (updater: (prev: string) => string) => void,
  setIsLoading: (loading: boolean) => void
): Promise<void> => {
  if (!ai) {
    setStreamedContent(() => "Gemini API is not configured. Please set the API_KEY.");
    setIsLoading(false);
    return;
  }
  setIsLoading(true);
  setStreamedContent(() => ""); // Clear previous streamed content

  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: 'You are a helpful AI assistant specialized in Web3, decentralized funding, and IP management. Provide concise and informative answers.',
      // thinkingConfig: { thinkingBudget: 0 } // For lower latency, if needed. Omitting for higher quality.
    },
    // Convert ChatMessage[] to the format expected by Gemini history if needed,
    // For simplicity, this example starts a new chat context each time or uses a simplified history.
    // A more robust implementation would map ChatMessage[] to Gemini's Content[] structure.
    // This example implies history is managed externally and fed into the prompt or a more complex chat setup.
  });

  try {
    // For sendMessageStream, the history is part of the chat object state.
    // We can send previous messages to the chat object before sending the current one
    // if the API supports adding messages to chat history explicitly.
    // Otherwise, constructing a prompt with history context is an alternative.

    // Constructing history for the chat session.
    // This approach assumes `chat.sendMessageStream` uses the history accumulated in the `chat` object.
    // If the chat needs to be 'primed' with history, this is one way.
    // However, @google/genai's `Chat` object maintains history internally across `sendMessage` calls.
    // So, for a continuing conversation, we just need to send the new message.
    // The `history` param to this function is for external state management if needed, or to reconstruct a chat.
    // For simplicity, let's assume `chat` object handles its own history after creation for subsequent calls.
    // If this is the first message of a *new* conceptual "session" but needs old context:
    
    let messagesForChat = [];
    if (history.length > 0) {
        messagesForChat = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        // The current @google/genai `Chat` object in `ai.chats.create` doesn't directly accept history.
        // History is built up by calling sendMessage / sendMessageStream multiple times on the SAME chat instance.
        // For this function, if `history` represents a full prior conversation to REPLAY into a NEW chat instance,
        // you would iterate and send them. But that's inefficient.
        // It's better to maintain ONE `chat` instance across the user's session.
        // Since this function creates a new `chat` instance each time, we will pass history as context
        // in the first message, if there's any history. This is not ideal for long conversations.
    }


    const currentPrompt = history.length > 0 
      ? `Context from previous messages:\n${history.map(h => `${h.sender === 'user' ? 'User' : 'AI'}: ${h.text}`).join('\n')}\n\nNew user message: ${message}`
      : message;

    // If the `chat` object instance were long-lived, we would just do:
    // const responseStream = await chat.sendMessageStream({ message: message });
    // Since it's new each time, we pass context in the `currentPrompt`.
    const responseStream = await chat.sendMessageStream({ message: currentPrompt });

    for await (const chunk of responseStream) {
      if (chunk.text) { // Check if text exists
        setStreamedContent(prev => prev + chunk.text);
      }
    }
  } catch (error) {
    console.error("Error streaming chat response from Gemini:", error);
    if (error instanceof Error) {
        setStreamedContent(() => `Error: ${error.message}`);
    } else {
        setStreamedContent(() => "An unknown error occurred during streaming.");
    }
  } finally {
    setIsLoading(false);
  }
};

// Example of parsing JSON (not directly used in current UI but good for reference)
export const generateJsonData = async (promptForJson: string): Promise<object | string> => {
    if (!ai) return "Gemini API is not configured.";

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: promptForJson,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error generating JSON with Gemini:", error);
        if (error instanceof Error) {
            // Safely access 'cause' property
            const causeInfo = (error as any).cause ? ` Cause: ${(error as any).cause}` : '';
            return `Error generating JSON: ${error.message}.${causeInfo}`;
        }
        return "Unknown error generating JSON.";
    }
};
