import { GoogleGenerativeAI } from "@google/generative-ai";

class AIAnalyzer {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  /**
   * A robust wrapper for the Gemini API call that includes retries with exponential backoff.
   */
  async _generateWithRetry(model, prompt, retries = 3, initialDelay = 1000) {
    let delay = initialDelay;
    for (let i = 0; i < retries; i++) {
      try {
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out after 20 seconds')), 20000)
          )
        ]);
        return result;
      } catch (error) {
        const isNetworkError = error.message.includes('fetch failed') || error.message.includes('timed out');
        
        if (isNetworkError && i < retries - 1) {
          console.warn(`⚠️ Gemini API call failed (Attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw error;
        }
      }
    }
  }

  async analyzeProfile(profileData, tweets) {
    try {
      // Sort tweets by engagement for performance analysis
      const tweetsWithEngagement = tweets.map(tweet => ({
        ...tweet,
        totalEngagement: tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies
      })).sort((a, b) => b.totalEngagement - a.totalEngagement);

      const tweetSummary = tweetsWithEngagement.slice(0, 20).map((tweet, i) => ({
        text: tweet.text.substring(0, 200),
        likes: tweet.metrics.likes,
        retweets: tweet.metrics.retweets,
        replies: tweet.metrics.replies,
        totalEngagement: tweet.totalEngagement,
        views: tweet.metrics.views || 0
      }));

      const prompt = this._buildPrompt(profileData, tweetsWithEngagement, tweetSummary);
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const result = await this._generateWithRetry(model, prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid AI response format from Gemini");
      }

      const auditResults = JSON.parse(jsonMatch[0]);

      return auditResults;
    } catch (error) {
      console.error("❌ Gemini AI error (after retries):", error.message);
      return this._getFallbackResults(profileData, tweets);
    }
  }

  _buildPrompt(profileData, tweets, tweetSummary) {
    // Calculate performance metrics
    const avgEngagement = tweetSummary.reduce((sum, t) => sum + t.totalEngagement, 0) / tweetSummary.length;
    const topPerformers = tweetSummary.slice(0, 3);
    const bottomPerformers = tweetSummary.slice(-3).reverse();

    return `
You are an expert X (Twitter) growth strategist. Analyze this profile and provide a comprehensive audit in this EXACT JSON format:
{
  "score": [number between 1-10],
  "maxScore": 10,
  "description": "[2-3 sentence overall assessment]",
  "doingRight": ["[point 1]", "[point 2]", "[point 3]", "[point 4]"],
  "doingWrong": ["[point 1]", "[point 2]", "[point 3]"],
  "shouldStart": ["[recommendation 1]", "[recommendation 2]", "[recommendation 3]"],
  "topPerforming": {
    "content": ["[top tweet 1 summary]", "[top tweet 2 summary]", "[top tweet 3 summary]"],
    "whyItWorked": ["[reason 1]", "[reason 2]", "[reason 3]"]
  },
  "lowestPerforming": {
    "content": ["[low tweet 1 summary]", "[low tweet 2 summary]", "[low tweet 3 summary]"],
    "whyItFailed": ["[reason 1]", "[reason 2]", "[reason 3]"]
  },
  "contentTopics": {
    "bestPerforming": ["[topic/theme 1]", "[topic/theme 2]", "[topic/theme 3]"],
    "recommendations": ["[content type 1]", "[content type 2]", "[content type 3]"],
  },
  "shareMessage": {
    "text": "[fun, catchy 15-20 word message that reflects their unique strengths]",
    "emoji": "[1-2 relevant emojis]",
    "vibe": "[their content personality: creative/professional/funny/authentic/etc.]"
  }
}

PROFILE DATA:
- Name: ${profileData.name}
- Handle: ${profileData.handle}
- Bio: ${profileData.bio}
- Followers: ${profileData.followers}

PERFORMANCE ANALYSIS:
Average Engagement: ${Math.round(avgEngagement)} interactions per tweet

TOP PERFORMING TWEETS:
${topPerformers.map((t, i) => 
  `${i + 1}. "${t.text}" (${t.totalEngagement} total interactions: ${t.likes} ❤️, ${t.retweets} 🔄, ${t.replies} 💬)`
).join("\n")}

LOWEST PERFORMING TWEETS:
${bottomPerformers.map((t, i) => 
  `${i + 1}. "${t.text}" (${t.totalEngagement} total interactions: ${t.likes} ❤️, ${t.retweets} 🔄, ${t.replies} 💬)`
).join("\n")}

ALL RECENT TWEETS (${tweets.length} total):
${tweetSummary.map((t, i) => `${i + 1}. "${t.text}"`).join("\n")}

For analysis:
- Identify the best performing TOPICS/THEMES (not individual tweets)
- Recommend specific content types that would work for this audience
- Suggest optimal content formats (threads, polls, images, etc.)
- Provide timing insights if patterns are visible
- Focus on actionable content strategy recommendations

For shareMessage:
- Create a SHORT,make the message unique to the account
- Make it personal and smile-worthy
- Keep it under 20 words
- Match their content personality/vibe
- Include 1 relevant emojis that fit their style

Keep recommendations practical, specific, and actionable for X growth.

Respond ONLY with valid JSON.`;
  }

  _getFallbackResults(profileData, tweets) {
    // Calculate basic engagement for fallback
    const tweetsWithEngagement = tweets.map(tweet => ({
      ...tweet,
      totalEngagement: tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies
    })).sort((a, b) => b.totalEngagement - a.totalEngagement);

    const topTweet = tweetsWithEngagement[0];
    const bottomTweet = tweetsWithEngagement[tweetsWithEngagement.length - 1];

    // Generate a simple personalized message for fallback
    const fallbackMessages = [
      { text: `${profileData.name.split(' ')[0]} is building something special on X`, emoji: "🚀", vibe: "ambitious" },
      { text: `Authentic voice with real potential for growth`, emoji: "✨", vibe: "authentic" },
      { text: `Great foundation, ready for the next level`, emoji: "🎯", vibe: "focused" },
      { text: `Consistent creator with engaging personality`, emoji: "💫", vibe: "engaging" }
    ];
    
    const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

    return {
      score: 5,
      maxScore: 10,
      description: `Analysis failed due to a network issue. This is fallback data for ${profileData.handle} based on ${tweets.length} tweets.`,
      doingRight: ["Maintains a regular posting schedule."],
      doingWrong: ["Could improve engagement with followers."],
      shouldStart: ["Experiment with different content formats."],
      topPerforming: {
        content: [
          topTweet ? `${topTweet.text.substring(0, 50)}...` : "Sample high-performing content",
          "Engaging question-based tweets",
          "Content with clear value proposition"
        ],
        whyItWorked: [
          "Strong hook in the opening line",
          "Encouraged audience interaction",
          "Relevant and timely topic"
        ]
      },
      lowestPerforming: {
        content: [
          bottomTweet ? `${bottomTweet.text.substring(0, 50)}...` : "Sample low-performing content",
          "Generic promotional tweets",
          "Tweets without clear purpose"
        ],
        whyItFailed: [
          "Lack of engaging hook",
          "Too promotional without value",
          "Poor timing or formatting"
        ]
      },
      contentTopics: {
        bestPerforming: ["Industry insights", "Personal experiences", "Helpful tips"],
        recommendations: ["Share behind-the-scenes content", "Ask engaging questions", "Post educational threads"]
      },
      shareMessage: randomMessage
    };
  }
}

export default new AIAnalyzer();