import axios from "axios";
// import Submission from "../assignment/submission.model.js";

const HF_API = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

// AI CHATBOT (FREE)
export const chatWithAI = async (message, user) => {
  try {
    const response = await axios.post(
      HF_API,
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`, // optional (works without too)
        },
      }
    );

    let reply = response.data?.[0]?.generated_text;

    // fallback
    if (!reply) {
      reply = "I'm not sure, but try checking your dashboard or asking your teacher.";
    }

    return reply;
  } catch (error) {
    console.error("HF AI Error:", error.message);
    return "AI service temporarily unavailable";
  }
};







export const generateSummary = async(test)=>{
    // openai call krege
    return "Short Summary of content"
}

export const generateQuiz = async(text)=>{
    return [
        {
            question: "What is AI",
            options: ["A", "B", "C"],
            answer:"A"
        }
    ]
}