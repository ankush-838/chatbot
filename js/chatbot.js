/**
 * AI Customer Service Chatbot
 * Handles intent recognition, sentiment analysis, and response generation
 */
class AICustomerServiceBot {
  constructor() {
    this.conversationHistory = [];
    this.userContext = {
      lastTopic: null,
      currentIssue: null,
      sentiment: "neutral",
      hasOrderNumber: false,
      escalationLevel: 0,
    };
    this.intents = this.initializeIntents();
    this.responses = this.initializeResponses();
    this.isProcessing = false;

    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners for user interactions
   */
  initializeEventListeners() {
    const input = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    input.addEventListener("input", () => {
      sendButton.disabled = input.value.trim() === "";
    });
  }

  /**
   * Initialize intent recognition patterns and keywords
   */
  initializeIntents() {
    return {
      order_tracking: {
        keywords: [
          "track",
          "order",
          "shipment",
          "delivery",
          "status",
          "where is",
          "when will",
        ],
        patterns: [/order\s*#?\s*\d+/i, /tracking\s*number/i, /shipped/i],
        confidence: 0,
      },
      returns: {
        keywords: [
          "return",
          "refund",
          "exchange",
          "defective",
          "wrong item",
          "damaged",
        ],
        patterns: [/return\s*policy/i, /money\s*back/i, /exchange/i],
        confidence: 0,
      },
      technical_support: {
        keywords: [
          "technical",
          "support",
          "bug",
          "error",
          "not working",
          "broken",
          "fix",
        ],
        patterns: [/tech\s*support/i, /doesn't\s*work/i, /error\s*\d+/i],
        confidence: 0,
      },
      billing: {
        keywords: [
          "billing",
          "payment",
          "charge",
          "invoice",
          "credit card",
          "subscription",
        ],
        patterns: [/billed/i, /charged/i, /payment\s*failed/i],
        confidence: 0,
      },
      product_info: {
        keywords: [
          "product",
          "item",
          "specifications",
          "features",
          "compatibility",
          "size",
        ],
        patterns: [/tell\s*me\s*about/i, /what\s*is/i, /how\s*does/i],
        confidence: 0,
      },
      greeting: {
        keywords: [
          "hello",
          "hi",
          "hey",
          "good morning",
          "good afternoon",
          "good evening",
        ],
        patterns: [/^(hi|hello|hey)/i],
        confidence: 0,
      },
      complaint: {
        keywords: [
          "angry",
          "frustrated",
          "terrible",
          "awful",
          "worst",
          "disappointed",
          "upset",
        ],
        patterns: [/this\s*is\s*ridiculous/i, /fed\s*up/i, /unacceptable/i],
        confidence: 0,
      },
    };
  }

  /**
   * Initialize response templates for different intents
   */
  initializeResponses() {
    return {
      order_tracking: [
        "I'd be happy to help you track your order! Could you please provide your order number? It usually starts with # followed by 6-8 digits.",
        "To track your order, I'll need your order number or the email address used for the purchase. Do you have that information handy?",
        "Let me help you find your order status. Please share your order number, and I'll look it up for you right away.",
      ],
      returns: [
        "I can definitely help with returns! Our return policy allows returns within 30 days of purchase. What item would you like to return and what's the reason?",
        "No problem with processing your return. Could you tell me more about the item and why you'd like to return it? I'll guide you through the process.",
        "I'll be glad to assist with your return. What's the order number and which item needs to be returned?",
      ],
      technical_support: [
        "I'm here to help resolve your technical issue. Can you describe what specific problem you're experiencing? The more details you provide, the better I can assist you.",
        "Let's troubleshoot this together! What device or service are you having trouble with, and what exactly is happening?",
        "Technical issues can be frustrating, but I'm confident we can solve this. Please describe the problem and any error messages you're seeing.",
      ],
      billing: [
        "I can help clarify any billing questions you have. Are you asking about a specific charge, payment method, or subscription details?",
        "Let me assist you with your billing inquiry. Could you provide more details about what you're seeing on your account or statement?",
        "I'm here to help resolve billing concerns. What specific billing issue can I help you with today?",
      ],
      product_info: [
        "I'd be happy to provide product information! Which specific product are you interested in learning more about?",
        "What product would you like to know more about? I can share details about features, specifications, and compatibility.",
        "I can provide detailed product information. What specific product or feature are you curious about?",
      ],
      greeting: [
        "Hello! Great to see you today. I'm your AI customer service assistant, ready to help with any questions or concerns you might have.",
        "Hi there! Welcome to our customer support. I'm here to assist you with orders, returns, technical issues, or any other questions.",
        "Hello! I'm your dedicated AI assistant for customer service. How can I make your day better?",
      ],
      complaint: [
        "I sincerely apologize for the frustrating experience you've had. I understand how disappointing this must be, and I'm here to make things right. Let me know exactly what happened so I can help resolve this immediately.",
        "I'm truly sorry you're having such a negative experience. Your frustration is completely understandable, and I want to turn this around for you. Please tell me what's gone wrong so I can fix it right away.",
        "I can hear how upset you are, and I don't blame you. Let me personally ensure we resolve this issue today. What specifically has caused this problem?",
      ],
      default: [
        "I want to make sure I help you with exactly what you need. Could you provide a bit more detail about your question or concern?",
        "I'm here to assist you! Could you elaborate on what you're looking for help with today?",
        "I'd love to help you out. Can you give me some more information about what you need assistance with?",
      ],
    };
  }

  /**
   * Analyze user message to determine intent
   */
  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    let bestIntent = "default";
    let highestScore = 0;

    for (const [intent, data] of Object.entries(this.intents)) {
      let score = 0;

      // Check keywords
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }

      // Check patterns
      for (const pattern of data.patterns) {
        if (pattern.test(message)) {
          score += 2;
        }
      }

      // Context bonus
      if (this.userContext.lastTopic === intent) {
        score += 0.5;
      }

      if (score > highestScore) {
        highestScore = score;
        bestIntent = intent;
      }
    }

    return {
      intent: bestIntent,
      confidence: Math.min(highestScore / 3, 1),
    };
  }

  /**
   * Analyze sentiment of user message
   */
  analyzeSentiment(message) {
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "love",
      "perfect",
      "amazing",
      "wonderful",
      "happy",
      "satisfied",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "hate",
      "horrible",
      "frustrated",
      "angry",
      "disappointed",
      "upset",
      "annoyed",
    ];

    const lowerMessage = message.toLowerCase();
    let sentiment = "neutral";
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      if (lowerMessage.includes(word)) positiveCount++;
    });

    negativeWords.forEach((word) => {
      if (lowerMessage.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) {
      sentiment = "positive";
    } else if (negativeCount > positiveCount) {
      sentiment = "negative";
    }

    return sentiment;
  }

  /**
   * Update conversation context based on user message
   */
  updateContext(message, intent) {
    this.userContext.lastTopic = intent.intent;
    this.userContext.sentiment = this.analyzeSentiment(message);

    // Check for order number
    const orderMatch = message.match(/order\s*#?\s*(\d+)/i);
    if (orderMatch) {
      this.userContext.hasOrderNumber = true;
      this.userContext.orderNumber = orderMatch[1];
    }

    // Escalation logic
    if (this.userContext.sentiment === "negative") {
      this.userContext.escalationLevel++;
    } else {
      this.userContext.escalationLevel = Math.max(
        0,
        this.userContext.escalationLevel - 1
      );
    }
  }

  /**
   * Generate appropriate response based on intent and context
   */
  generateResponse(intent) {
    const responses =
      this.responses[intent.intent] || this.responses["default"];
    let response = responses[Math.floor(Math.random() * responses.length)];

    // Add contextual information
    if (this.userContext.hasOrderNumber && intent.intent === "order_tracking") {
      response += ` I can see you mentioned order #${this.userContext.orderNumber}. Let me look that up for you.`;
    }

    // Handle escalation
    if (this.userContext.escalationLevel > 2) {
      response =
        "I understand this situation is very frustrating for you. Let me connect you with a senior specialist who can provide more personalized assistance. " +
        response;
    }

    return response;
  }

  /**
   * Process user message and generate response
   */
  async processMessage(message) {
    // Simulate AI processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const intent = this.analyzeIntent(message);
    this.updateContext(message, intent);

    const response = this.generateResponse(intent);

    // Store conversation
    this.conversationHistory.push({
      user: message,
      bot: response,
      intent: intent.intent,
      confidence: intent.confidence,
      timestamp: new Date(),
    });

    return {
      response,
      intent: intent.intent,
      confidence: intent.confidence,
    };
  }

  /**
   * Send message and handle the conversation flow
   */
  async sendMessage() {
    if (this.isProcessing) return;

    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (!message) return;

    this.isProcessing = true;
    input.value = "";
    document.getElementById("sendButton").disabled = true;

    // Display user message
    this.displayMessage(message, "user");

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Process with AI
      const result = await this.processMessage(message);

      // Hide typing indicator
      this.hideTypingIndicator();

      // Display bot response
      this.displayMessage(result.response, "bot", result);
    } catch (error) {
      this.hideTypingIndicator();
      this.displayMessage(
        "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        "bot"
      );
    }

    this.isProcessing = false;
    document.getElementById("sendButton").disabled = false;
    input.focus();
  }

  /**
   * Display message in the chat interface
   */
  displayMessage(message, sender, metadata = null) {
    const messagesContainer = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    let messageContent = `<div class="message-content">${message}</div>`;

    if (metadata && sender === "bot") {
      messageContent += `<div class="intent-confidence">Intent: ${
        metadata.intent
      } (${(metadata.confidence * 100).toFixed(0)}% confidence)</div>`;

      if (this.userContext.lastTopic) {
        messageContent += `<div class="conversation-context">Context: Continuing ${this.userContext.lastTopic} discussion</div>`;
      }
    }

    messageDiv.innerHTML = messageContent;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    const messagesContainer = document.getElementById("chatMessages");
    messagesContainer.appendChild(indicator);
    indicator.style.display = "block";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    indicator.style.display = "none";
  }

  /**
   * Send a quick message from predefined options
   */
  sendQuickMessage(message) {
    const input = document.getElementById("messageInput");
    input.value = message;
    this.sendMessage();
  }
}
