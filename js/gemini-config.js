/**
 * Google Gemini API Configuration
 * Replace 'YOUR_GEMINI_API_KEY' with your actual API key from Google AI Studio
 */

const GEMINI_CONFIG = {
  // Get your API key from: https://makersuite.google.com/app/apikey
  apiKey: "AIzaSyBmJ8zlaygJaeMYsxL88e-PzGke70gGFEI", // Your actual API key

  // API endpoint
  apiUrl:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",

  // Enable/disable Gemini integration
  enabled: true,

  // Generation parameters
  generationConfig: {
    temperature: 0.7, // Controls randomness (0.0 to 1.0)
    topK: 40, // Limits token selection
    topP: 0.95, // Nucleus sampling parameter
    maxOutputTokens: 150, // Short responses (approximately 50 words)
  },

  // Safety settings (optional)
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
};

// Gemini API Integration Status
if (GEMINI_CONFIG.enabled && GEMINI_CONFIG.apiKey !== "YOUR_GEMINI_API_KEY") {
  console.log(`
✅ Google Gemini API Integration Active
🤖 Model: gemini-1.5-flash
🔑 API Key: Configured
📊 Max Output Tokens: ${GEMINI_CONFIG.generationConfig.maxOutputTokens}
🌡️ Temperature: ${GEMINI_CONFIG.generationConfig.temperature}
  `);
} else {
  console.log(`
⚠️ Google Gemini API Not Configured
Please set your API key in js/gemini-config.js
  `);
}
