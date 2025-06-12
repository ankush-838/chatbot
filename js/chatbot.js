/**
 * AI Service Procurement Negotiation Bot
 * Handles price negotiations, service discussions, and contract terms
 */
class ServiceNegotiationBot {
  constructor() {
    this.conversationHistory = [];
    this.userContext = {
      lastTopic: null,
      currentService: null,
      sentiment: "neutral",
      proposedPrice: null,
      counterOfferCount: 0,
      negotiationStage: "initial", // initial, discussing, negotiating, finalizing
      serviceProvider: null,
      agreedTerms: [],
    };
    this.intents = this.initializeIntents();
    this.responses = this.initializeResponses();
    this.isProcessing = false;

    // Company's budget ranges for different services
    this.budgetRanges = {
      web_development: { min: 5000, max: 15000, preferred: 8000 },
      mobile_app: { min: 8000, max: 25000, preferred: 12000 },
      digital_marketing: { min: 2000, max: 8000, preferred: 4000 },
      content_creation: { min: 1000, max: 5000, preferred: 2500 },
      seo_services: { min: 1500, max: 6000, preferred: 3000 },
      consulting: { min: 3000, max: 12000, preferred: 6000 },
      design_services: { min: 2000, max: 10000, preferred: 5000 },
    };

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
   * Initialize intent recognition patterns and keywords for service negotiation
   */
  initializeIntents() {
    return {
      service_offering: {
        keywords: [
          "offer",
          "provide",
          "service",
          "development",
          "design",
          "marketing",
          "consulting",
          "can do",
          "specialize",
        ],
        patterns: [
          /i\s*(can|offer|provide)/i,
          /we\s*(specialize|offer)/i,
          /our\s*services/i,
        ],
        confidence: 0,
      },
      price_quote: {
        keywords: [
          "price",
          "cost",
          "quote",
          "rate",
          "fee",
          "charge",
          "budget",
          "dollar",
          "payment",
        ],
        patterns: [/\$\d+/i, /\d+\s*dollars?/i, /price\s*is/i, /costs?\s*\d+/i],
        confidence: 0,
      },
      negotiation: {
        keywords: [
          "negotiate",
          "lower",
          "reduce",
          "discount",
          "better price",
          "deal",
          "compromise",
          "flexible",
        ],
        patterns: [/can\s*you\s*do\s*better/i, /negotiate/i, /lower\s*price/i],
        confidence: 0,
      },
      timeline_discussion: {
        keywords: [
          "timeline",
          "deadline",
          "delivery",
          "complete",
          "finish",
          "duration",
          "time",
          "weeks",
          "months",
        ],
        patterns: [/how\s*long/i, /when\s*can/i, /timeline/i, /\d+\s*weeks?/i],
        confidence: 0,
      },
      requirements_discussion: {
        keywords: [
          "requirements",
          "features",
          "specifications",
          "need",
          "want",
          "include",
          "scope",
        ],
        patterns: [/what\s*do\s*you\s*need/i, /requirements/i, /features/i],
        confidence: 0,
      },
      agreement: {
        keywords: [
          "agree",
          "accept",
          "deal",
          "yes",
          "okay",
          "sounds good",
          "let's do it",
          "proceed",
        ],
        patterns: [/i\s*agree/i, /sounds?\s*good/i, /let'?s\s*do/i, /deal/i],
        confidence: 0,
      },
      rejection: {
        keywords: [
          "no",
          "reject",
          "decline",
          "too high",
          "expensive",
          "can't do",
          "not interested",
        ],
        patterns: [
          /too\s*high/i,
          /too\s*expensive/i,
          /can'?t\s*do/i,
          /not\s*interested/i,
        ],
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
    };
  }

  /**
   * Initialize response templates for service negotiation
   */
  initializeResponses() {
    return {
      service_offering: [
        "That sounds interesting! We're always looking for quality service providers. What specific services do you offer, and what's your experience in this area?",
        "Great! We have several upcoming projects that might be a good fit. Could you tell me more about your expertise and the services you provide?",
        "Perfect timing! We're actively seeking service providers. What's your specialty, and do you have a portfolio or examples of your previous work?",
      ],
      price_quote: [
        "Thank you for the quote. Let me review this with our budget parameters. Our typical range for this type of service is different from what you've proposed. Can we discuss this further?",
        "I appreciate the pricing information. However, we're working with a tighter budget for this project. Would you be open to negotiating the price?",
        "Thanks for the quote. We're comparing several proposals right now. Is there any flexibility in your pricing, especially if we commit to a longer-term partnership?",
      ],
      negotiation: [
        "I appreciate your willingness to negotiate! Based on our budget and the scope of work, we were thinking more in the range of [BUDGET_RANGE]. What are your thoughts on that?",
        "Great that you're open to discussion! We value quality work, but we also need to stay within our allocated budget. Can we find a middle ground that works for both of us?",
        "Excellent! We believe in fair partnerships. If we can adjust the scope slightly or extend the timeline, would that help you meet our budget requirements?",
      ],
      timeline_discussion: [
        "Timeline is important for us. We're looking to start as soon as possible. What's your current availability, and how quickly can you deliver?",
        "Good question about timing. We have some flexibility, but we'd prefer to complete this within [TIMELINE]. Does that work with your schedule?",
        "We're planning to launch this project soon. If you can meet our timeline requirements, it would definitely strengthen your proposal. What's realistic for you?",
      ],
      requirements_discussion: [
        "Let me outline what we're looking for: [REQUIREMENTS]. Does this align with your capabilities? Are there any additional features you'd recommend?",
        "Our requirements are quite specific. We need [REQUIREMENTS]. Can you handle all of these aspects, or would you recommend partnering with other specialists?",
        "Here's what we have in mind: [REQUIREMENTS]. Based on your experience, is this scope realistic, and are there any potential challenges we should discuss?",
      ],
      agreement: [
        "Excellent! I'm glad we could reach an agreement. Let me summarize what we've discussed: [SUMMARY]. I'll prepare the contract details and next steps.",
        "Perfect! This sounds like a great partnership. We'll move forward with [AGREED_TERMS]. I'll send you the formal agreement within 24 hours.",
        "Wonderful! I'm excited to work with you. Based on our discussion, we'll proceed with [AGREED_TERMS]. What information do you need from us to get started?",
      ],
      rejection: [
        "I understand your position. Unfortunately, that pricing doesn't align with our current budget constraints. If your situation changes or you'd like to reconsider, please let us know.",
        "No problem, I appreciate your honesty. We'll keep your information on file for future projects that might have a better budget fit. Thank you for your time.",
        "That's perfectly fine. We respect your pricing structure. If we have projects with larger budgets in the future, we'd love to reconnect. Thanks for the discussion!",
      ],
      greeting: [
        "Hello! Welcome to TechCorp's procurement department. I'm here to discuss potential service partnerships. Are you a service provider looking to work with us?",
        "Hi there! I'm the AI procurement assistant for TechCorp. We're always interested in connecting with talented service providers. What services do you offer?",
        "Good day! I represent TechCorp's vendor relations team. We're actively seeking service providers for various projects. How can we potentially work together?",
      ],
      default: [
        "I want to make sure I understand your proposal correctly. Could you provide more details about your services and pricing?",
        "Let me make sure we're on the same page. Are you offering services to our company? If so, what specific services and at what cost?",
        "I'd like to better understand your offering. Could you clarify what services you provide and how we might work together?",
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

    // Extract price information
    const priceMatch = message.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (priceMatch) {
      this.userContext.proposedPrice = parseFloat(
        priceMatch[1].replace(/,/g, "")
      );
    }

    // Detect service type
    const serviceTypes = {
      web: "web_development",
      website: "web_development",
      app: "mobile_app",
      mobile: "mobile_app",
      marketing: "digital_marketing",
      seo: "seo_services",
      content: "content_creation",
      design: "design_services",
      consulting: "consulting",
    };

    for (const [keyword, serviceType] of Object.entries(serviceTypes)) {
      if (message.toLowerCase().includes(keyword)) {
        this.userContext.currentService = serviceType;
        break;
      }
    }

    // Track negotiation progress
    if (intent.intent === "negotiation" || intent.intent === "price_quote") {
      this.userContext.counterOfferCount++;
    }

    // Update negotiation stage
    if (intent.intent === "agreement") {
      this.userContext.negotiationStage = "finalizing";
    } else if (
      intent.intent === "negotiation" ||
      intent.intent === "price_quote"
    ) {
      this.userContext.negotiationStage = "negotiating";
    } else if (intent.intent === "service_offering") {
      this.userContext.negotiationStage = "discussing";
    }
  }

  /**
   * Generate appropriate response based on intent and context
   */
  generateResponse(intent) {
    const responses =
      this.responses[intent.intent] || this.responses["default"];
    let response = responses[Math.floor(Math.random() * responses.length)];

    // Add contextual negotiation information
    if (this.userContext.proposedPrice && intent.intent === "price_quote") {
      const serviceType = this.userContext.currentService;
      if (serviceType && this.budgetRanges[serviceType]) {
        const budget = this.budgetRanges[serviceType];
        if (this.userContext.proposedPrice > budget.max) {
          response += ` Your quote of $${this.userContext.proposedPrice.toLocaleString()} is above our maximum budget of $${budget.max.toLocaleString()} for this type of service. Our preferred range is $${budget.min.toLocaleString()} - $${budget.preferred.toLocaleString()}.`;
        } else if (this.userContext.proposedPrice > budget.preferred) {
          response += ` Your quote of $${this.userContext.proposedPrice.toLocaleString()} is higher than our preferred budget of $${budget.preferred.toLocaleString()}. Can we work towards something closer to that range?`;
        } else {
          response += ` Your quote of $${this.userContext.proposedPrice.toLocaleString()} looks reasonable and fits within our budget expectations.`;
        }
      }
    }

    // Handle negotiation counter-offers
    if (
      intent.intent === "negotiation" &&
      this.userContext.counterOfferCount > 1
    ) {
      if (this.userContext.counterOfferCount > 3) {
        response =
          "I appreciate your persistence in finding a mutually beneficial agreement. Let me escalate this to our procurement manager who might have more flexibility in the budget. " +
          response;
      } else {
        response =
          "I can see we're both working hard to find common ground. " +
          response;
      }
    }

    // Add service-specific context
    if (this.userContext.currentService) {
      const serviceNames = {
        web_development: "web development",
        mobile_app: "mobile app development",
        digital_marketing: "digital marketing",
        content_creation: "content creation",
        seo_services: "SEO services",
        consulting: "consulting",
        design_services: "design services",
      };

      if (intent.intent === "requirements_discussion") {
        response = response.replace(
          "[REQUIREMENTS]",
          `${
            serviceNames[this.userContext.currentService]
          } with our specific requirements`
        );
      }
    }

    return response;
  }

  /**
   * Generate a counter-offer based on budget constraints
   */
  generateCounterOffer(proposedPrice, serviceType) {
    if (!serviceType || !this.budgetRanges[serviceType]) {
      return null;
    }

    const budget = this.budgetRanges[serviceType];
    let counterOffer;

    if (proposedPrice > budget.max) {
      // Offer maximum budget
      counterOffer = budget.max;
    } else if (proposedPrice > budget.preferred) {
      // Offer something between preferred and their price
      counterOffer = Math.round((budget.preferred + proposedPrice) / 2);
    } else {
      // Their price is acceptable
      return null;
    }

    return counterOffer;
  }

  /**
   * Check if a price is within acceptable range
   */
  isPriceAcceptable(price, serviceType) {
    if (!serviceType || !this.budgetRanges[serviceType]) {
      return false;
    }

    const budget = this.budgetRanges[serviceType];
    return price <= budget.max;
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
