import { GoogleGenerativeAI } from "@google/generative-ai";

class AIAnalyzer {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  /**
   * A robust wrapper for the Gemini API call that includes retries with exponential backoff.
   * This makes the function resilient to intermittent network failures.
   */
  async _generateWithRetry(model, prompt, retries = 3, initialDelay = 1000) {
    let delay = initialDelay;
    for (let i = 0; i < retries; i++) {
      try {
        // Set a timeout for the API call itself
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out after 20 seconds')), 20000)
          )
        ]);
        return result; // Success!
      } catch (error) {
        // Check if it's a retryable network error
        const isNetworkError = error.message.includes('fetch failed') || error.message.includes('timed out');
        
        if (isNetworkError && i < retries - 1) {
          console.warn(`⚠️ Gemini API call failed (Attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double the delay for the next retry
        } else {
          // If it's not a network error, or the last retry failed, throw the error
          throw error;
        }
      }
    }
  }

  async analyzeProfile(profileData, tweets) {
    try {
      const tweetSummary = tweets.slice(0, 20).map((tweet, i) => ({
        text: tweet.text.substring(0, 200),
        likes: tweet.metrics.likes,
        retweets: tweet.metrics.retweets,
        replies: tweet.metrics.replies,
      }));

      const prompt = this._buildPrompt(profileData, tweets, tweetSummary);
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      // Use the new robust function instead of the direct call
      const result = await this._generateWithRetry(model, prompt);
      
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid AI response format from Gemini");
      }

      const auditResults = JSON.parse(jsonMatch[0]);

      console.log("✅ AI analysis complete:", auditResults.score + "/10");
      return auditResults;
    } catch (error) {
      console.error("❌ Gemini AI error (after retries):", error.message);
      return this._getFallbackResults(profileData, tweets);
    }
  }

  _buildPrompt(profileData, tweets, tweetSummary) {
    return `
You are an expert X (Twitter) growth strategist. Analyze this profile and provide a comprehensive audit in this EXACT JSON format:
{
  "score": [number between 1-10],
  "maxScore": 10,
  "description": "[2-3 sentence overall assessment]",
  "doingRight": ["[point 1]", "[point 2]", "[point 3]", "[point 4]"],
  "doingWrong": ["[point 1]", "[point 2]", "[point 3]"],
  "shouldStart": ["[recommendation 1]", "[recommendation 2]", "[recommendation 3]"]
}

PROFILE DATA:
- Name: ${profileData.name}
- Handle: ${profileData.handle}
- Bio: ${profileData.bio}
- Followers: ${profileData.followers}

RECENT TWEETS (${tweets.length} total):
${tweetSummary.map((t, i) => `${i + 1}. "${t.text}"`).join("\n")}

Keep recommendations practical, specific, and actionable for X growth. If the account is already excellent, acknowledge it but still provide advanced growth tips.

Respond ONLY with valid JSON.`;
  }

  _getFallbackResults(profileData, tweets) {
    return {
      score: 5,
      maxScore: 10,
      description: `Analysis failed due to a network issue. This is fallback data for ${profileData.handle}.`,
      doingRight: ["Maintains a regular posting schedule."],
      doingWrong: ["Could improve engagement with followers."],
      shouldStart: ["Experiment with different content formats."],
    };
  }
}

export default new AIAnalyzer();