/**
 * Configuration file for the Influencer Marketing Negotiation Bot
 * Modify these settings to customize the negotiation bot behavior
 */

const ChatbotConfig = {
  // UI Settings
  ui: {
    title: "BrandCorp Influencer Hub",
    statusText: "Partnership Bot Online",
    placeholder: "Tell us about your platform, followers, and rates...",
    maxMessageLength: 500,
    typingDelayMin: 1000,
    typingDelayMax: 3000,
  },

  // Quick Actions Configuration
  quickActions: [
    {
      text: "📸 Instagram Reels",
      message:
        "I have 75k Instagram followers and create reels in fashion niche",
    },
    {
      text: "📺 YouTube Videos",
      message: "I create YouTube videos with 150k subscribers in tech niche",
    },
    {
      text: "📘 Facebook Posts",
      message:
        "I have 25k followers and create Facebook posts with 6% engagement",
    },
    {
      text: "💰 Quote Rate",
      message: "My rate is ₹25,000 per sponsored post",
    },
  ],

  // Influencer Negotiation Settings
  negotiation: {
    // Confidence threshold for intent recognition
    confidenceThreshold: 0.3,

    // Number of counter-offers before escalation
    maxCounterOffers: 3,

    // Budget flexibility percentage
    budgetFlexibility: 0.15, // 15% above calculated fair price

    // Enable/disable features
    features: {
      intentDisplay: true,
      contextDisplay: true,
      metricsTracking: true,
      negotiationHistory: true,
      priceCalculation: true,
      demographicsAnalysis: true,
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
