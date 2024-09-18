/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to run a chat session with the Gemini API
async function runGeminiChat(cropName, growthStage, additionalInfo) {
  const prompt = `
    Provide guidance on the following crop and stage:
    Crop Name: ${cropName}
    Growth Stage: ${growthStage}
    Additional Information: ${additionalInfo}
    
For the subsequent stage(s), please provide:
  1. Important management practices for the next stage(s) (e.g., irrigation, fertilization, pest control)
  2. Expected growth patterns and timelines for the next stage(s)
  3. Indicators of healthy growth and potential problems to watch for in the subsequent stage(s)
  4. Tips for maximizing yield and quality in the next stage(s)
`;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

module.exports = {
  runGeminiChat,
};