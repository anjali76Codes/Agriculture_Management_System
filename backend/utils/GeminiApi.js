/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

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

// Function to format the response text with numbered points
function formatResponseText(response) {
  // Remove bold markers '**' from the response
  let cleanedText = response.replace(/\*\*/g, "");

  // Split the text into stages (assuming numbered list like '1. Seed', '2. Germination', etc.)
  const stages = cleanedText.split(/\n(?=[1-5]\.\s)/);

  // For each stage, assign numbers to the subpoints (like Duration, Temperature, Yield, etc.)
  const formattedStages = stages.map(stage => {
    const lines = stage.split('\n');
    let pointNumber = 1;
    const numberedPoints = lines.map(line => {
      if (line.startsWith('Duration') || line.startsWith('Temperature') || line.startsWith('Yield') || line.startsWith('Pest/Disease') || line.startsWith('Management')) {
        return `${pointNumber++}. ${line}`;
      }
      return line;
    });
    return numberedPoints.join('\n');
  });

  // Join the stages back together, separated by two blank lines
  return formattedStages.join('\n\n\n');
}

// Function to run a chat session with the Gemini API
async function runGeminiChat(cropName, growthStage) {
  const prompt = `
    Provide guidance on the following crop and stage:
    Crop Name: ${cropName}
    Growth Stage: ${growthStage}`;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: "when by user you get the crop name and its stage then based on it give subsequent or future stages information only about the crop and in each future stage in one para about 3 to 4 lines of each future stage and in each stage add things or info about duration required temperature and yield or pest detection or required things to manage that particular prompt.\n" },
          { text: "five stages I mentioned that is seed, germination, vegetative, flowering, harvest\n" },
        ],
      },
    ],
  });

  // Send the message and get the result
  const result = await chatSession.sendMessage(prompt);

  // Format the response text
  const formattedText = formatResponseText(result.response.text());

  return formattedText;
}

module.exports = {
  runGeminiChat,
};

