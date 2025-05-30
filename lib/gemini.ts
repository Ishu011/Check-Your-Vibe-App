import { GoogleGenAI } from "@google/genai";

// Interfaces
interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

// API error handler
const handleAPIError = (error: unknown): string => {
  console.error("Gemini API error:", error);
  if (error instanceof Error) {
    if (error.message.includes("API key")) {
      return "Missing or invalid API key. Check your environment variables.";
    }
    if (error.message.includes("quota")) {
      return "API quota exceeded. Try again later.";
    }
    return `Gemini Error: ${error.message}`;
  }
  return "An unknown error occurred with the Gemini API.";
};

// Initialize GoogleGenAI instance
const initializeGenAI = (): GoogleGenAI => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Set it in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Generates a quiz using Gemini
export async function generateQuiz(
  topic: string,
  numQuestions: number,
  difficulty: string
): Promise<QuizData> {
  try {
    const ai = initializeGenAI();

    const prompt = `
      Generate a quiz on the topic: "${topic}" with ${numQuestions} questions.
      Difficulty: ${difficulty}. Use this JSON structure:

      {
        "title": "${topic} Quiz",
        "questions": [
          {
            "question": "Sample question?",
            "options": [
              { "text": "Option A", "isCorrect": false },
              { "text": "Option B", "isCorrect": false },
              { "text": "Option C", "isCorrect": true },
              { "text": "Option D", "isCorrect": false }
            ]
          }
        ]
      }

      ❗ Only return pure JSON. Do not include any extra explanation or text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const rawText = response.text ?? "";
    console.log("Gemini raw output (first 200 chars):", rawText.slice(0, 200));

    const jsonText = extractJSON(rawText);
    const parsedQuiz = JSON.parse(jsonText) as QuizData;

    return validateQuizData(parsedQuiz, topic);
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

// Safely extract JSON from a messy Gemini response
function extractJSON(responseText: string): string {
  const match = responseText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No valid JSON found in Gemini response.");
  return match[0];
}

// Validate and correct the quiz data
function validateQuizData(data: QuizData, topic: string): QuizData {
  if (!data.title) {
    data.title = `${topic} Quiz`;
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("Quiz must contain at least one question.");
  }

  data.questions.forEach((q, index) => {
    if (!q.question || typeof q.question !== "string") {
      q.question = `Question ${index + 1} on ${topic}`;
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${index + 1} must have exactly 4 options.`);
    }

    const correctCount = q.options.filter(opt => opt.isCorrect).length;
    if (correctCount !== 1) {
      q.options.forEach((opt, i) => (opt.isCorrect = i === 0));
    }
  });

  return data;
}
