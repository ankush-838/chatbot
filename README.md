# AI Customer Service Chatbot

A modern, responsive AI-powered customer service chatbot with intent recognition, sentiment analysis, and contextual conversation handling.

## Project Structure

```
chatbot/
├── index.html          # Main HTML file with clean structure
├── css/
│   └── styles.css      # All CSS styles and animations
├── js/
│   ├── chatbot.js      # Main chatbot class and AI logic
│   └── app.js          # Application initialization and utilities
└── README.md           # Project documentation
```

## Features

- **Intent Recognition**: Automatically detects user intent from messages
- **Sentiment Analysis**: Analyzes user sentiment for better responses
- **Context Awareness**: Maintains conversation context and history
- **Escalation Handling**: Automatically escalates frustrated users
- **Quick Actions**: Pre-defined quick response buttons
- **Typing Indicators**: Visual feedback during AI processing
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

### `js/chatbot.js`

Main chatbot functionality:

- `AICustomerServiceBot` class with all AI logic
- Intent recognition with keywords and patterns
- Sentiment analysis for user messages
- Context management and conversation history
- Response generation with personalization

### `js/app.js`

Application utilities:

- DOM initialization and event handling
- Global functions for HTML onclick events
- Utility functions for chat management
- Export functionality for chat history

## Supported Intents

1. **Order Tracking** - Help users track their orders
2. **Returns** - Assist with return requests and policies
3. **Technical Support** - Troubleshoot technical issues
4. **Billing** - Handle billing and payment questions
5. **Product Information** - Provide product details
6. **Greetings** - Respond to user greetings
7. **Complaints** - Handle frustrated or angry users

## Usage

1. Open `index.html` in a web browser
2. Type a message or click a quick action button
3. The AI will analyze your message and respond appropriately
4. Continue the conversation naturally

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
