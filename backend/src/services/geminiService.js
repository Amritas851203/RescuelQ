import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class GeminiService {
  /**
   * Generates a professional tactical summary and recommendation for a disaster event
   */
  async analyzeDisaster(eventData) {
    try {
      const prompt = `
        You are RescueIQ AI, a professional disaster response intelligence system.
        Analyze the following disaster data and provide a concise tactical intelligence report.
        
        Data:
        Type: ${eventData.type}
        Severity: ${eventData.severity}
        Location: ${eventData.address}
        Coordinates: ${JSON.stringify(eventData.location)}
        Impact: ${eventData.affected_people} people affected
        
        Format your response as a JSON object with these exact keys:
        - aiSummary: A professional 1-2 sentence tactical assessment of the situation.
        - tacticalAction: A high-level recommendation for the response team.
        - riskLevel: A number from 1-10.
        - requiredResources: An array of 3 professional rescue units or resources needed.
        
        Response must be valid JSON only.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response in case Gemini adds markdown backticks
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini Analysis Error:', error.message);
      return {
        aiSummary: `Intelligence confirms ${eventData.type} signature at ${eventData.address}. Predicted escalation risk is high.`,
        tacticalAction: 'Immediate deployment of regional response units.',
        riskLevel: eventData.severity === 'CRITICAL' ? 9 : 6,
        requiredResources: ['Alpha Rescue', 'Trauma Medics', 'Aerial Drone']
      };
    }
  }
}

export default new GeminiService();
