# 🚀 Ema - X/Twitter Profile Audit Extension

![Ema Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)

Ema is an intelligent Chrome extension that provides comprehensive X/Twitter profile audits using AI analysis. Get personalized insights, performance metrics, and actionable recommendations to grow your X presence.

## ✨ Features

### 🔍 **AI-Powered Profile Analysis**
- **Smart Content Analysis**: AI analyzes your recent tweets to identify patterns and opportunities
- **Performance Metrics**: Detailed breakdown of engagement rates, content performance, and growth trends
- **Personalized Recommendations**: Tailored suggestions based on your unique content style and audience

### 📊 **Comprehensive Insights**
- **Audit Score**: Get a score out of 10 with detailed explanations
- **Content Performance**: See your top-performing vs. lowest-performing tweets with AI explanations
- **Topic Analysis**: Discover which topics and content formats work best for your audience
- **Growth Recommendations**: Actionable steps to improve engagement and follower growth

### 🎨 **Beautiful Shareable Cards**
- **Visual Share Cards**: Generate beautiful, branded cards to share your audit results
- **Personalized Messages**: AI creates unique, catchy messages that reflect your content personality
- **Easy Sharing**: One-click sharing to X with both image and text

### 🔧 **Smart Features**
- **Side Panel Integration**: Works seamlessly in Chrome's side panel for better workflow
- **Real-time Analysis**: Analyzes your content in real-time as you browse X
- **Cross-browser Support**: Optimized for Chrome with fallbacks for other browsers
- **Offline Fallbacks**: Provides meaningful insights even when AI analysis fails

## 🛠️ Technology Stack

### Frontend (Chrome Extension)
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons
- **HTML2Canvas** - Generate shareable images from UI components
- **Chrome Extensions API** - Side panel, content scripts, and background workers

### Backend (API Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - Advanced AI analysis for content insights
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection and usage management

## 📁 Project Structure

```
emaextension/
├── 📁 client/                 # Chrome Extension Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # React components
│   │   │   ├── AuditScore.jsx
│   │   │   ├── AuditSection.jsx
│   │   │   ├── ContentPerformance.jsx
│   │   │   ├── ContentTopics.jsx
│   │   │   ├── ShareCard.jsx
│   │   │   └── Header.jsx
│   │   ├── EmaPopup.jsx       # Main popup component
│   │   └── popup.jsx          # Entry point
│   ├── background.js          # Extension background script
│   ├── content.js            # Content script for X/Twitter
│   ├── manifest.json         # Extension manifest
│   └── package.json
│
├── 📁 server/                # Backend API Server
│   ├── 📁 routes/
│   │   └── audit.js          # Audit API endpoints
│   ├── 📁 services/
│   │   └── ai-analyzer.js    # AI analysis service
│   ├── 📁 middleware/
│   │   └── validation.js     # Request validation
│   ├── index.js             # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Chrome** (latest version)
- **Gemini AI API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/PonmileDaniel/emaextension.git
cd emaextension
```

### 2. Set Up the Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your configuration to .env
# GEMINI_API_KEY=your_gemini_api_key_here
# CORS_ORIGIN=chrome-extension://your-extension-id
# PORT=3001
```

### 3. Set Up the Frontend

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Build the extension
npm run build
```

### 4. Install the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `client/dist` folder
5. Copy the generated extension ID
6. Update your server `.env` file with the extension ID

### 5. Start the Backend Server

```bash
cd ../server
npm run dev
```

Your server will start at `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3001

# AI Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
CORS_ORIGIN=chrome-extension://your-extension-id-here
```

### Getting Your Extension ID

1. Install the extension in Chrome
2. Go to `chrome://extensions/`
3. Find your extension and copy the ID
4. Update the `CORS_ORIGIN` in your `.env` file

## 💡 Usage

### Basic Usage

1. **Visit X/Twitter**: Navigate to any X/Twitter profile
2. **Open Extension**: Click the Ema extension icon or open the side panel
3. **Run Audit**: Click "Run Audit" to analyze the profile
4. **View Results**: Explore detailed insights, recommendations, and performance analysis
5. **Share Results**: Generate and share beautiful audit cards

### Advanced Features

#### Content Performance Analysis
- View top-performing vs. lowest-performing tweets
- Understand what makes content successful
- Get specific recommendations for improvement

#### Topic & Format Insights
- Discover your best-performing topics
- Learn optimal content formats (threads, polls, images)
- Get timing recommendations for maximum engagement

#### Shareable Cards
- Generate beautiful, branded share cards
- AI creates personalized messages reflecting your style
- Easy sharing with automatic image generation


Analyzes a X/Twitter profile and returns comprehensive insights.

**Request Body:**
```json
{
  "profileData": {
    "name": "User Name",
    "handle": "@username",
    "bio": "User bio",
    "followers": 1000,
    "following": 500,
    "avatar": "https://..."
  },
  "tweets": [
    {
      "text": "Tweet content",
      "metrics": {
        "likes": 10,
        "retweets": 5,
        "replies": 2,
        "views": 100
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "score": 7,
    "maxScore": 10,
    "description": "Overall assessment...",
    "doingRight": ["strength 1", "strength 2"],
    "doingWrong": ["issue 1", "issue 2"],
    "shouldStart": ["recommendation 1", "recommendation 2"],
    "topPerforming": {
      "content": ["top tweet summaries"],
      "whyItWorked": ["explanations"]
    },
    "contentTopics": {
      "bestPerforming": ["topics"],
      "recommendations": ["content types"],
      "contentFormats": ["formats"],
      "timing": "timing insights"
    },
    "shareMessage": {
      "text": "personalized message",
      "emoji": "🚀",
      "vibe": "authentic"
    }
  }
}
```

## 🧪 Development

### Development Mode

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

```bash
# Build the extension
cd client
npm run build

# The built extension will be in client/dist/
```

### Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🛡️ Security & Privacy

- **No Data Storage**: User data is processed in real-time and not stored
- **Secure API Communication**: All API calls use HTTPS
- **Rate Limiting**: Built-in protection against API abuse
- **CORS Protection**: Restricted to authorized origins only
- **Environment Variables**: Sensitive data kept in environment files

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Extension Not Loading:**
- Ensure you've built the project: `npm run build`
- Check that Developer mode is enabled in Chrome
- Verify the manifest.json is valid

**API Errors:**
- Check your Gemini API key is valid
- Ensure the server is running on the correct port
- Verify CORS settings match your extension ID

**Share Feature Not Working:**
- Make sure html2canvas is installed
- Check browser console for CORS errors on profile images
- Verify the generated image downloads correctly

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/PonmileDaniel/emaextension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PonmileDaniel/emaextension/discussions)
- **Email**: [support@ema-extension.com](mailto:support@ema-extension.com)

## 🎯 Roadmap

### Version 1.1
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Content scheduling recommendations
- [ ] Competitor analysis features

### Version 2.0
- [ ] LinkedIn profile analysis
- [ ] Instagram integration
- [ ] Team collaboration features
- [ ] Custom branding options

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful content analysis capabilities
- **Chrome Extensions Team** - For excellent developer tools and documentation
- **React Team** - For the amazing React framework
- **All Contributors** - Thank you for your contributions and feedback!

---

<div align="center">

**Built with ❤️ by [Daniel Ponmile](https://github.com/PonmileDaniel)**

[⭐ Star this repo](https://github.com/PonmileDaniel/emaextension) | [🐛 Report Bug](https://github.com/PonmileDaniel/emaextension/issues) | [✨ Request Feature](https://github.com/PonmileDaniel/emaextension/issues)

</div>