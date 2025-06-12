# BrandCorp Influencer Marketing Negotiation Bot

A modern, responsive AI-powered negotiation bot designed to help BrandCorp negotiate partnerships with influencers and content creators. The bot analyzes influencer metrics (followers, engagement, demographics) and calculates fair pricing for brand collaborations across various social media platforms.

## Project Structure

```
chatbot/
├── index.html              # Main HTML file with clean structure
├── css/
│   └── styles.css          # All CSS styles and animations
├── js/
│   ├── influencer-bot.js   # Main influencer negotiation bot logic
│   ├── config.js           # Configuration settings
│   └── app.js              # Application initialization and utilities
└── README.md               # Project documentation
```

## Features

- **Influencer Recognition**: Automatically detects platform, follower count, and content niche
- **Metrics Analysis**: Analyzes follower count, engagement rates, and audience demographics
- **Smart Pricing**: Calculates fair pricing based on industry standards and influencer metrics
- **Platform-Specific Rates**: Different pricing tiers for Instagram, YouTube, TikTok, Twitter
- **Engagement Multipliers**: Adjusts pricing based on engagement rates (low/average/high/excellent)
- **Demographics Bonuses**: Premium pricing for valuable demographics (Gen Z, female audiences)
- **Niche Multipliers**: Specialized pricing for high-value niches (tech, fashion, beauty)
- **Negotiation Tracking**: Maintains conversation history and negotiation progress
- **Agreement Finalization**: Guides conversations toward partnership agreements
- **Responsive Design**: Works on desktop and mobile devices

## File Descriptions

### `index.html`

Clean HTML structure containing:

- Chat container with header, messages area, and input
- Quick action buttons for common queries
- Typing indicator for AI processing feedback

### `css/styles.css`

Complete styling including:

- Modern gradient backgrounds and glassmorphism effects
- Smooth animations for messages and interactions
- Responsive design for different screen sizes
- Hover effects and transitions

### `js/influencer-bot.js`

Main influencer negotiation bot functionality:

- `InfluencerNegotiationBot` class with all negotiation logic
- Platform and metrics recognition with keywords and patterns
- Smart pricing calculation based on follower count, engagement, and demographics
- Negotiation context management and conversation history
- Intelligent response generation with influencer-specific strategies

### `js/app.js`

Application utilities:

- DOM initialization and event handling
- Global functions for HTML onclick events
- Utility functions for chat management
- Export functionality for chat history

## Supported Influencer Intents

1. **Influencer Introduction** - Detect when creators introduce themselves
2. **Platform Mention** - Recognize social media platforms (Instagram, YouTube, TikTok, etc.)
3. **Follower Count** - Extract follower/subscriber numbers and audience size
4. **Engagement Metrics** - Analyze engagement rates and interaction data
5. **Demographics Info** - Process audience age, gender, and location data
6. **Niche Content** - Identify content categories (fashion, tech, gaming, etc.)
7. **Price Quote** - Recognize pricing and rate discussions
8. **Negotiation** - Handle price negotiation and counter-offers
9. **Collaboration Interest** - Detect partnership and collaboration requests
10. **Agreement** - Finalize terms and move toward contracts
11. **Rejection** - Handle declined offers professionally
12. **Greetings** - Professional introductions and relationship building

## Usage

1. Open `index.html` in a web browser
2. As an influencer, introduce yourself and mention your platform (Instagram, YouTube, TikTok, etc.)
3. Share your follower count, engagement rate, and content niche
4. Quote your rates for sponsored content or collaborations
5. The bot will analyze your metrics and provide a calculated fair price
6. Engage in negotiations based on your audience value and demographics
7. Finalize partnership terms and campaign details

## Example Conversations

### Scenario 1: Instagram Fashion Influencer

**Influencer**: "Hi! I'm a fashion influencer with 75k Instagram followers and 8% engagement rate. My audience is 70% female, ages 18-28."

**Bot**: "Great metrics! With 75k followers and 8% engagement on Instagram in the fashion niche, you're in our mid-tier category. Based on your demographics (70% female, Gen Z/Millennial audience), our calculated fair rate is $1,200 per sponsored post."

### Scenario 2: YouTube Tech Creator

**Influencer**: "I create tech content on YouTube with 150k subscribers. My rate is $5,000 per sponsored video."

**Bot**: "Impressive reach! With 150k subscribers, you're in our macro influencer tier for YouTube. Your quote of $5,000 aligns well with our calculated fair rate of $4,800 for tech content creators."

### Scenario 3: TikTok Micro-Influencer

**Influencer**: "I have 25k TikTok followers in the fitness niche with 12% engagement rate."

**Bot**: "Excellent engagement! 12% is outstanding for TikTok. With 25k followers in fitness, plus your excellent engagement rate, our calculated fair rate is $450 per sponsored video."

## Customization

### Adding New Intents

Edit the `initializeIntents()` method in `chatbot.js`:

```javascript
new_intent: {
  keywords: ["keyword1", "keyword2"],
  patterns: [/pattern1/i, /pattern2/i],
  confidence: 0,
}
```

### Adding New Responses

Edit the `initializeResponses()` method in `chatbot.js`:

```javascript
new_intent: ["Response option 1", "Response option 2", "Response option 3"];
```

### Styling Changes

Modify `css/styles.css` to change:

- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and effects

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The code is organized for easy maintenance and extension:

- Modular structure with separated concerns
- Well-documented functions and classes
- Consistent coding style
- Easy to add new features or modify existing ones

## Future Enhancements

Potential improvements:

- Integration with real AI services (OpenAI, Dialogflow)
- Database storage for conversation history
- Multi-language support
- Voice input/output capabilities
- Admin dashboard for analytics
