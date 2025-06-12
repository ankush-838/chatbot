/**
 * Configuration file for the AI Customer Service Chatbot
 * Modify these settings to customize the chatbot behavior
 */

const ChatbotConfig = {
  // UI Settings
  ui: {
    title: "AI Customer Support",
    statusText: "AI Assistant Online",
    placeholder: "Type your message...",
    maxMessageLength: 500,
    typingDelayMin: 1000,
    typingDelayMax: 3000,
  },

  // Quick Actions Configuration
  quickActions: [
    {
      text: "📦 Track Order",
      message: "Track my order",
    },
    {
      text: "↩️ Returns",
      message: "Return policy",
    },
    {
      text: "🔧 Tech Support",
      message: "Technical support",
    },
    {
      text: "💳 Billing",
      message: "Billing question",
    },
  ],

  // AI Behavior Settings
  ai: {
    // Confidence threshold for intent recognition
    confidenceThreshold: 0.3,

    // Number of negative messages before escalation
    escalationThreshold: 2,

    // Enable/disable features
    features: {
      intentDisplay: true,
      contextDisplay: true,
      sentimentAnalysis: true,
      conversationHistory: true,
    },
  },

  // Styling Options
  theme: {
    primaryColor: "#4f46e5",
    secondaryColor: "#7c3aed",
    successColor: "#10b981",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",

    // Animation settings
    animations: {
      messageSlide: true,
      typingIndicator: true,
      buttonHover: true,
    },
  },

  // Debug and Development
  debug: {
    enabled: false,
    logIntents: false,
    logSentiment: false,
    logContext: false,
  },
};

// Make config available globally
window.ChatbotConfig = ChatbotConfig;
