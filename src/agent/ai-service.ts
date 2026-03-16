import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateContentStrategy(topicFocus: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are the lead content strategist for Atul Automation, a global AI Automation Agency.
Generate 1 high-impact blog post idea and 2 social media post ideas (one for Twitter, one for Instagram) focusing on: ${topicFocus}.
Output format should be clean JSON:
{
  "blog": { "title": "...", "markdown_body": "..." },
  "twitter": { "copy": "..." },
  "instagram": { "caption": "...", "image_prompt": "..." }
}`;
    
    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        // Clean JSON formatting if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Strategy Generation Error:", error);
        return null;
    }
}
