/**
 * AI Influencer Marketing Negotiation Bot
 * Handles price negotiations with influencers based on their metrics and demographics
 */
class InfluencerNegotiationBot {
  constructor() {
    this.conversationHistory = [];
    this.userContext = {
      lastTopic: null,
      platform: null,
      sentiment: "neutral",
      proposedPrice: null,
      counterOfferCount: 0,
      negotiationStage: "initial", // initial, discussing, negotiating, finalizing
      influencerName: null,
      agreedTerms: [],
      // Influencer metrics
      followers: null,
      engagement: null,
      demographics: null,
      niche: null,
      contentType: null,
    };
    this.intents = this.initializeIntents();
    this.responses = this.initializeResponses();
    this.isProcessing = false;

    // Pricing structure based on knowledge.txt - all prices in Rupees
    this.pricingTiers = {
      instagram: {
        reels: {
          nano: { min: 3000, max: 6000, followers: [1000, 10000] },
          micro: { min: 15000, max: 35000, followers: [10000, 50000] },
          macro: { min: 40000, max: 150000, followers: [50000, 200000] },
          mega: { min: 200000, max: 500000, followers: [200000, 1000000] },
        },
        posts: {
          nano: { min: 3000, max: 6000, followers: [1000, 10000] },
          micro: { min: 15000, max: 35000, followers: [10000, 50000] },
          macro: { min: 40000, max: 150000, followers: [50000, 200000] },
          mega: { min: 200000, max: 500000, followers: [200000, 1000000] },
        },
      },
      youtube: {
        shorts: {
          nano: { min: 4000, max: 8000, followers: [1000, 10000] },
          micro: { min: 15000, max: 40000, followers: [10000, 50000] },
          macro: { min: 50000, max: 200000, followers: [50000, 200000] },
          mega: { min: 250000, max: 600000, followers: [200000, 1000000] },
        },
        videos: {
          nano: { min: 10000, max: 15000, followers: [1000, 10000] },
          micro: { min: 30000, max: 70000, followers: [10000, 50000] },
          macro: { min: 80000, max: 300000, followers: [50000, 200000] },
          mega: { min: 400000, max: 1000000, followers: [200000, 1000000] },
        },
      },
      facebook: {
        posts: {
          nano: { min: 2000, max: 5000, followers: [1000, 10000] },
          micro: { min: 10000, max: 25000, followers: [10000, 50000] },
          macro: { min: 30000, max: 100000, followers: [50000, 200000] },
          mega: { min: 120000, max: 300000, followers: [200000, 1000000] },
        },
        reels: {
          nano: { min: 2000, max: 5000, followers: [1000, 10000] },
          micro: { min: 10000, max: 25000, followers: [10000, 50000] },
          macro: { min: 30000, max: 100000, followers: [50000, 200000] },
          mega: { min: 120000, max: 300000, followers: [200000, 1000000] },
        },
      },
    };

    // Engagement rate multipliers
    this.engagementMultipliers = {
      low: 0.8, // <2% engagement
      average: 1.0, // 2-5% engagement
      high: 1.3, // 5-10% engagement
      excellent: 1.6, // >10% engagement
    };

    // Demographics multipliers
    this.demographicsMultipliers = {
      age_18_24: 1.2, // Gen Z premium
      age_25_34: 1.1, // Millennial premium
      age_35_44: 1.0, // Gen X standard
      age_45_plus: 0.9, // Older demographic discount
      female_majority: 1.1, // Female audience premium for certain niches
      male_majority: 1.0,
      balanced_gender: 1.05,
    };

    // Niche multipliers
    this.nicheMultipliers = {
      fashion: 1.2,
      beauty: 1.2,
      fitness: 1.1,
      tech: 1.3,
      gaming: 1.1,
      food: 1.0,
      travel: 1.1,
      lifestyle: 1.0,
      business: 1.3,
      education: 1.1,
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
   * Initialize intent recognition patterns and keywords for influencer negotiation
   */
  initializeIntents() {
    return {
      influencer_introduction: {
        keywords: [
          "influencer",
          "creator",
          "content creator",
          "blogger",
          "youtuber",
          "instagrammer",
          "tiktoker",
          "my name is",
          "i'm",
          "i am",
        ],
        patterns: [
          /i'?m\s*an?\s*(influencer|creator)/i,
          /my\s*name\s*is/i,
          /i\s*create\s*content/i,
        ],
        confidence: 0,
      },
      platform_mention: {
        keywords: [
          "instagram",
          "youtube",
          "tiktok",
          "twitter",
          "facebook",
          "linkedin",
          "snapchat",
          "twitch",
          "platform",
        ],
        patterns: [
          /on\s*(instagram|youtube|tiktok|twitter)/i,
          /my\s*(instagram|youtube|tiktok)/i,
        ],
        confidence: 0,
      },
      follower_count: {
        keywords: [
          "followers",
          "subscribers",
          "audience",
          "reach",
          "views",
          "thousand",
          "million",
          "k followers",
          "m followers",
        ],
        patterns: [
          /\d+k?\s*followers?/i,
          /\d+m\s*followers?/i,
          /\d+\s*thousand/i,
          /\d+\s*million/i,
        ],
        confidence: 0,
      },
      engagement_metrics: {
        keywords: [
          "engagement",
          "likes",
          "comments",
          "shares",
          "views",
          "engagement rate",
          "interaction",
          "active audience",
        ],
        patterns: [/\d+%\s*engagement/i, /engagement\s*rate/i, /\d+\s*likes/i],
        confidence: 0,
      },
      demographics_info: {
        keywords: [
          "demographics",
          "audience",
          "age",
          "gender",
          "location",
          "female",
          "male",
          "18-24",
          "25-34",
          "millennials",
          "gen z",
        ],
        patterns: [
          /\d+%\s*(female|male)/i,
          /age\s*\d+-\d+/i,
          /mostly\s*(female|male)/i,
        ],
        confidence: 0,
      },
      niche_content: {
        keywords: [
          "niche",
          "fashion",
          "beauty",
          "fitness",
          "tech",
          "gaming",
          "food",
          "travel",
          "lifestyle",
          "business",
          "education",
          "content about",
        ],
        patterns: [/i\s*focus\s*on/i, /content\s*about/i, /specialize\s*in/i],
        confidence: 0,
      },
      price_quote: {
        keywords: [
          "price",
          "cost",
          "rate",
          "fee",
          "charge",
          "dollar",
          "payment",
          "per post",
          "per video",
          "campaign",
        ],
        patterns: [/\$\d+/i, /\d+\s*dollars?/i, /my\s*rate/i, /i\s*charge/i],
        confidence: 0,
      },
      negotiation: {
        keywords: [
          "negotiate",
          "flexible",
          "discuss",
          "open to",
          "consider",
          "work with",
          "budget",
          "lower",
          "higher",
        ],
        patterns: [
          /open\s*to\s*negotiation/i,
          /flexible\s*on\s*price/i,
          /can\s*we\s*discuss/i,
        ],
        confidence: 0,
      },
      collaboration_interest: {
        keywords: [
          "collaborate",
          "partnership",
          "work together",
          "interested",
          "campaign",
          "brand deal",
          "sponsorship",
        ],
        patterns: [
          /interested\s*in\s*collaborating/i,
          /work\s*together/i,
          /brand\s*partnership/i,
        ],
        confidence: 0,
      },
      agreement: {
        keywords: [
          "agree",
          "accept",
          "deal",
          "yes",
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
          "decline",
          "too low",
          "not enough",
          "can't accept",
          "not interested",
        ],
        patterns: [
          /too\s*low/i,
          /not\s*enough/i,
          /can'?t\s*accept/i,
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
   * Initialize response templates for influencer negotiation
   */
  initializeResponses() {
    return {
      influencer_introduction: [
        "Great to meet you! We're always looking for talented creators to partner with. Could you tell me more about your platform and audience?",
        "Welcome! We'd love to learn more about your content and reach. What platform do you primarily create on, and what's your follower count?",
        "Excellent! We're interested in working with influencers like you. Can you share some details about your audience demographics and engagement rates?",
      ],
      platform_mention: [
        "Perfect! [PLATFORM] is one of our key marketing channels. How many followers do you have, and what type of content do you create?",
        "Great choice of platform! What's your follower count on [PLATFORM], and what's your typical engagement rate?",
        "[PLATFORM] is excellent for our campaigns. Could you share your audience size and demographics?",
      ],
      follower_count: [
        "Thanks for sharing your follower count! That puts you in the [TIER] influencer category. What's your typical engagement rate with your audience?",
        "Impressive reach! With [FOLLOWERS] followers, you're in our [TIER] tier. Can you tell me about your audience demographics?",
        "Great audience size! For [FOLLOWERS] followers, we typically work within a certain budget range. What are your usual rates?",
      ],
      engagement_metrics: [
        "Excellent engagement! High engagement rates are very valuable to us. Combined with your follower count, this looks promising for a partnership.",
        "That's a strong engagement rate! Quality engagement is often more important than just follower count. What demographics make up your audience?",
        "Great metrics! Your engagement rate shows you have an active, interested audience. Let's discuss campaign specifics and pricing.",
      ],
      demographics_info: [
        "Perfect! Your audience demographics align well with our target market. This could be a great fit for our campaign.",
        "Excellent demographics! That audience profile is exactly what we're looking for. Based on your metrics, here's what we typically offer...",
        "Those demographics are valuable for our brand. Your audience profile suggests we could have a successful partnership.",
      ],
      niche_content: [
        "Your niche is perfect for our brand! [NICHE] content creators often perform very well for our campaigns.",
        "Excellent specialization! We have several campaigns in the [NICHE] space that could be a great fit for your content style.",
        "That's a valuable niche! [NICHE] influencers typically see great results with our products. Let's discuss collaboration opportunities.",
      ],
      price_quote: [
        "Thank you for the quote. Based on your metrics - [FOLLOWERS] followers, [ENGAGEMENT] engagement, and [DEMOGRAPHICS] audience - let me calculate our offer...",
        "I appreciate the pricing information. For your tier and niche, our typical budget range is [BUDGET_RANGE]. Can we find a middle ground?",
        "Thanks for sharing your rates. Considering your platform, audience size, and engagement, here's what we can offer...",
      ],
      negotiation: [
        "I appreciate your flexibility! Based on your metrics, we can offer [CALCULATED_PRICE]. This factors in your follower count, engagement rate, and audience demographics.",
        "Great that you're open to discussion! Our calculated offer based on your profile is [CALCULATED_PRICE]. What are your thoughts?",
        "Perfect! Let's work together on this. Considering all your metrics, we can offer [CALCULATED_PRICE] for the campaign.",
      ],
      collaboration_interest: [
        "Wonderful! We're excited about the possibility of working together. Let's discuss the campaign details and compensation.",
        "Excellent! Based on your profile, you'd be a great fit for our upcoming campaign. Here are the details...",
        "Perfect timing! We have a campaign that aligns perfectly with your content and audience. Let's talk specifics.",
      ],
      agreement: [
        "Fantastic! I'm excited to move forward with this partnership. I'll prepare the campaign brief and contract details.",
        "Excellent! Welcome to our influencer network. I'll send you the campaign guidelines and next steps within 24 hours.",
        "Perfect! This is going to be a great collaboration. Let me get the paperwork started and send you the campaign details.",
      ],
      rejection: [
        "I understand. Our budget calculations are based on industry standards and your metrics. If you'd like to reconsider, we're here.",
        "No problem! We respect your pricing structure. We'll keep your profile for future campaigns with larger budgets.",
        "That's perfectly fine. We appreciate your time and will reach out if we have campaigns with higher budgets that match your rates.",
      ],
      greeting: [
        "Hello! Welcome to our influencer partnership program. Are you a content creator looking to collaborate with brands?",
        "Hi there! I'm here to discuss potential influencer partnerships. What platform do you create content on?",
        "Good day! I represent our brand's influencer marketing team. We're always looking for talented creators to work with!",
      ],
      default: [
        "I'd love to learn more about your influencer profile. Could you share details about your platform, followers, and content niche?",
        "To better understand how we can work together, could you tell me about your social media presence and audience?",
        "Let me make sure I understand your influencer profile correctly. What platform do you use and what's your audience like?",
      ],
    };
  }

  /**
   * Calculate fair price based on influencer metrics and content type
   */
  calculateFairPrice(
    followers,
    platform,
    contentType = "posts",
    engagement,
    demographics,
    niche
  ) {
    if (!followers || !platform) return null;

    const platformPricing = this.pricingTiers[platform.toLowerCase()];
    if (!platformPricing) return null;

    // Determine content type - default based on platform
    let actualContentType = contentType;
    if (platform.toLowerCase() === "instagram" && !contentType) {
      actualContentType = "posts"; // Default to posts for Instagram
    } else if (platform.toLowerCase() === "youtube" && !contentType) {
      actualContentType = "videos"; // Default to videos for YouTube
    } else if (platform.toLowerCase() === "facebook" && !contentType) {
      actualContentType = "posts"; // Default to posts for Facebook
    }

    const contentPricing = platformPricing[actualContentType];
    if (!contentPricing) {
      // Fallback to first available content type
      actualContentType = Object.keys(platformPricing)[0];
      const fallbackPricing = platformPricing[actualContentType];
      if (!fallbackPricing) return null;
    }

    // Determine tier based on followers
    let tier = "nano";
    const contentTypePricing = platformPricing[actualContentType];

    for (const [tierName, tierData] of Object.entries(contentTypePricing)) {
      if (
        followers >= tierData.followers[0] &&
        followers < tierData.followers[1]
      ) {
        tier = tierName;
        break;
      }
    }

    // Get base price from tier
    const tierData = contentTypePricing[tier];
    if (!tierData) return null;

    let basePrice = (tierData.min + tierData.max) / 2;

    // Apply engagement multiplier (reduced impact since base prices are already market rates)
    if (engagement) {
      const engagementRate = parseFloat(engagement.replace("%", ""));
      let engagementMultiplier = 1.0;

      if (engagementRate < 2)
        engagementMultiplier = 0.9; // Slight reduction for low engagement
      else if (engagementRate < 5) engagementMultiplier = 1.0; // Standard rate
      else if (engagementRate < 10)
        engagementMultiplier = 1.1; // Small bonus for high engagement
      else engagementMultiplier = 1.2; // Good bonus for excellent engagement

      basePrice *= engagementMultiplier;
    }

    // Apply demographics multiplier (reduced impact)
    if (demographics) {
      let demoMultiplier = 1.0;
      if (demographics.includes("18-24") || demographics.includes("gen z")) {
        demoMultiplier *= 1.05; // Small Gen Z premium
      }
      if (demographics.includes("female")) {
        demoMultiplier *= 1.05; // Small female audience premium
      }
      basePrice *= demoMultiplier;
    }

    // Apply niche multiplier (reduced impact)
    if (niche) {
      const nicheMultipliers = {
        fashion: 1.1,
        beauty: 1.1,
        tech: 1.15,
        business: 1.15,
        fitness: 1.05,
        lifestyle: 1.0,
        food: 1.0,
        travel: 1.05,
      };
      const nicheMultiplier = nicheMultipliers[niche.toLowerCase()] || 1.0;
      basePrice *= nicheMultiplier;
    }

    return Math.round(basePrice);
  }

  /**
   * Extract metrics from message
   */
  extractMetrics(message) {
    const metrics = {};

    // Extract follower count
    const followerMatch = message.match(
      /(\d+(?:\.\d+)?)\s*([km])?\s*followers?/i
    );
    if (followerMatch) {
      let count = parseFloat(followerMatch[1]);
      const unit = followerMatch[2]?.toLowerCase();
      if (unit === "k") count *= 1000;
      if (unit === "m") count *= 1000000;
      metrics.followers = count;
    }

    // Extract engagement rate
    const engagementMatch = message.match(/(\d+(?:\.\d+)?)%\s*engagement/i);
    if (engagementMatch) {
      metrics.engagement = engagementMatch[1] + "%";
    }

    // Extract platform
    const platforms = ["instagram", "youtube", "tiktok", "twitter", "facebook"];
    for (const platform of platforms) {
      if (message.toLowerCase().includes(platform)) {
        metrics.platform = platform;
        break;
      }
    }

    // Extract content type
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("reel")) {
      metrics.contentType = "reels";
    } else if (lowerMessage.includes("short")) {
      metrics.contentType = "shorts";
    } else if (lowerMessage.includes("video")) {
      metrics.contentType = "videos";
    } else if (lowerMessage.includes("post")) {
      metrics.contentType = "posts";
    }

    // Extract niche
    const niches = [
      "fashion",
      "beauty",
      "tech",
      "business",
      "fitness",
      "lifestyle",
      "food",
      "travel",
      "gaming",
      "education",
    ];
    for (const niche of niches) {
      if (lowerMessage.includes(niche)) {
        metrics.niche = niche;
        break;
      }
    }

    return metrics;
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
      "excited",
      "great",
      "excellent",
      "love",
      "perfect",
      "amazing",
      "wonderful",
      "happy",
      "interested",
      "fantastic",
      "awesome",
    ];
    const negativeWords = [
      "disappointed",
      "frustrated",
      "low",
      "not enough",
      "terrible",
      "awful",
      "upset",
      "annoyed",
      "unfair",
      "ridiculous",
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

    // Extract and store metrics
    const metrics = this.extractMetrics(message);
    if (metrics.followers) this.userContext.followers = metrics.followers;
    if (metrics.platform) this.userContext.platform = metrics.platform;
    if (metrics.engagement) this.userContext.engagement = metrics.engagement;
    if (metrics.niche) this.userContext.niche = metrics.niche;
    if (metrics.contentType) this.userContext.contentType = metrics.contentType;

    // Extract price information (supports both Rupees and Dollars)
    const priceMatch = message.match(
      /(?:₹|rs\.?|rupees?|\$)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i
    );
    if (priceMatch) {
      this.userContext.proposedPrice = parseFloat(
        priceMatch[1].replace(/,/g, "")
      );
    }

    // Extract demographics info
    if (
      message.toLowerCase().includes("female") ||
      message.toLowerCase().includes("male")
    ) {
      this.userContext.demographics = message.toLowerCase().includes("female")
        ? "female_majority"
        : "male_majority";
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
    } else if (intent.intent === "influencer_introduction") {
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

    // Replace placeholders with actual data
    if (this.userContext.platform) {
      response = response.replace(
        /\[PLATFORM\]/g,
        this.userContext.platform.charAt(0).toUpperCase() +
          this.userContext.platform.slice(1)
      );
    }

    if (this.userContext.followers) {
      response = response.replace(
        /\[FOLLOWERS\]/g,
        this.userContext.followers.toLocaleString()
      );

      // Determine tier
      let tier = "micro";
      if (this.userContext.followers >= 1000000) tier = "mega";
      else if (this.userContext.followers >= 100000) tier = "macro";
      else if (this.userContext.followers >= 10000) tier = "mid-tier";

      response = response.replace(/\[TIER\]/g, tier);
    }

    if (this.userContext.niche) {
      response = response.replace(/\[NICHE\]/g, this.userContext.niche);
    }

    // Calculate and insert fair price
    if (intent.intent === "price_quote" || intent.intent === "negotiation") {
      const fairPrice = this.calculateFairPrice(
        this.userContext.followers,
        this.userContext.platform,
        this.userContext.contentType || "posts",
        this.userContext.engagement,
        this.userContext.demographics,
        this.userContext.niche
      );

      if (fairPrice) {
        response = response.replace(
          /\[CALCULATED_PRICE\]/g,
          `₹${fairPrice.toLocaleString()}`
        );

        if (this.userContext.proposedPrice) {
          if (this.userContext.proposedPrice > fairPrice * 1.5) {
            response += ` Your quote of ₹${this.userContext.proposedPrice.toLocaleString()} is significantly higher than our calculated fair rate of ₹${fairPrice.toLocaleString()} based on industry standards for your metrics.`;
          } else if (this.userContext.proposedPrice > fairPrice * 1.2) {
            response += ` Your quote of ₹${this.userContext.proposedPrice.toLocaleString()} is above our calculated rate of ₹${fairPrice.toLocaleString()}. Can we meet somewhere in the middle?`;
          } else if (this.userContext.proposedPrice < fairPrice * 0.8) {
            response += ` Your rate of ₹${this.userContext.proposedPrice.toLocaleString()} is actually below our calculated fair rate of ₹${fairPrice.toLocaleString()}. We're happy to pay the fair market rate!`;
          } else {
            response += ` Your quote of ₹${this.userContext.proposedPrice.toLocaleString()} aligns well with our calculated fair rate of ₹${fairPrice.toLocaleString()}.`;
          }
        }
      }
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
      metrics: {
        followers: this.userContext.followers,
        platform: this.userContext.platform,
        engagement: this.userContext.engagement,
        niche: this.userContext.niche,
      },
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

      // Show detected metrics
      if (
        this.userContext.followers ||
        this.userContext.platform ||
        this.userContext.engagement
      ) {
        let metricsInfo = "Detected: ";
        const metrics = [];
        if (this.userContext.platform)
          metrics.push(`${this.userContext.platform}`);
        if (this.userContext.followers)
          metrics.push(
            `${this.userContext.followers.toLocaleString()} followers`
          );
        if (this.userContext.engagement)
          metrics.push(`${this.userContext.engagement} engagement`);
        if (this.userContext.niche)
          metrics.push(`${this.userContext.niche} niche`);

        metricsInfo += metrics.join(", ");
        messageContent += `<div class="conversation-context">${metricsInfo}</div>`;
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
