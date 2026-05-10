import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export const processAudioToText = async (audioUrl) => {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('No OpenAI API key, using mock transcription');
      return { text: "Help, there's a flood at Main Street and we need immediate rescue.", language: "en" };
    }

    // 1. Download audio from URL
    const response = await axios.get(audioUrl, { responseType: 'stream' });
    
    // 2. Send to Whisper API
    const formData = new FormData();
    formData.append('file', response.data, 'audio.mp3');
    formData.append('model', 'whisper-1');

    const whisperRes = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    return { text: whisperRes.data.text, language: whisperRes.data.language || 'en' };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

export const classifySeverityAndLocation = async (text) => {
  try {
    if (!CLAUDE_API_KEY) {
      console.warn('No Claude API key, using mock classification');
      return {
        severity: "Critical",
        urgency_score: 95,
        location: { lat: 19.0760, lng: 72.8777 }, // Mumbai approx
        summary: "Flood at Main Street, immediate rescue needed."
      };
    }

    const prompt = `
      Analyze this SOS message: "${text}"
      Return a JSON object with:
      - severity (one of: Critical, Injured, Stranded, Safe)
      - urgency_score (0-100)
      - location (an object with approximate lat and lng based on clues, or null)
      - summary (short 1 sentence)
    `;

    const claudeRes = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      system: "You are an emergency response AI that extracts data into strict JSON format.",
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    const jsonStr = claudeRes.data.content[0].text;
    // Basic extraction assuming Claude returns JSON
    const extracted = JSON.parse(jsonStr.substring(jsonStr.indexOf('{'), jsonStr.lastIndexOf('}') + 1));
    return extracted;

  } catch (error) {
    console.error('Error classifying text:', error);
    throw error;
  }
};
