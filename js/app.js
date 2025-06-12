/**
 * Application initialization and global functions
 */

// Initialize the chatbot when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the chatbot
  window.chatbot = new AICustomerServiceBot();

  // Initialize send button state
  document.getElementById("sendButton").disabled = true;

  console.log("AI Customer Service Chatbot initialized successfully");
});

/**
 * Global function for sending messages (called from HTML onclick events)
 */
function sendMessage() {
  if (window.chatbot) {
    window.chatbot.sendMessage();
  }
}

/**
 * Global function for sending quick messages (called from HTML onclick events)
 */
function sendQuickMessage(message) {
  if (window.chatbot) {
    window.chatbot.sendQuickMessage(message);
  }
}

/**
 * Utility functions for the application
 */
const AppUtils = {
  /**
   * Format timestamp for display
   */
  formatTimestamp: function (date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /**
   * Scroll to bottom of chat messages
   */
  scrollToBottom: function () {
    const messagesContainer = document.getElementById("chatMessages");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  },

  /**
   * Clear chat history
   */
  clearChat: function () {
    if (window.chatbot) {
      const messagesContainer = document.getElementById("chatMessages");
      // Keep only the initial bot message
      const initialMessage = messagesContainer.querySelector(".bot-message");
      messagesContainer.innerHTML = "";
      if (initialMessage) {
        messagesContainer.appendChild(initialMessage);
      }

      // Reset chatbot state
      window.chatbot.conversationHistory = [];
      window.chatbot.userContext = {
        lastTopic: null,
        currentIssue: null,
        sentiment: "neutral",
        hasOrderNumber: false,
        escalationLevel: 0,
      };
    }
  },

  /**
   * Export chat history
   */
  exportChatHistory: function () {
    if (window.chatbot && window.chatbot.conversationHistory.length > 0) {
      const history = window.chatbot.conversationHistory.map((entry) => ({
        timestamp: entry.timestamp.toISOString(),
        user: entry.user,
        bot: entry.bot,
        intent: entry.intent,
        confidence: entry.confidence,
      }));

      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `chat-history-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
    }
  },
};

// Make utilities available globally
window.AppUtils = AppUtils;
