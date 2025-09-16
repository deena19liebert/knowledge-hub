const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Warning: GEMINI_API_KEY not found in environment variables');
      return;
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateSummary(content) {
    try {
      if (!this.model) {
        // Fallback if Gemini is not configured
        return content.substring(0, 200) + '...';
      }
      const prompt = `Summarize this document in 2-3 sentences:\n${content}`;
      const response = await this.model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      console.error('Gemini summary error:', error);
      // Fallback summary
      return content.substring(0, 200) + '...';
    }
  }

  async generateTags(content) {
    try {
      if (!this.model) {
        // Fallback if Gemini is not configured
        return ['general', 'document'];
      }
      const prompt = `Generate 5 relevant tags for this content separated by commas:\n${content}`;
      const response = await this.model.generateContent(prompt);
      const tags = response.response.text().split(',').map(tag => tag.trim());
      return tags.slice(0, 5);
    } catch (error) {
      console.error('Gemini tags error:', error);
      // Fallback tags
      return ['general', 'document'];
    }
  }
}

module.exports = new GeminiService();
