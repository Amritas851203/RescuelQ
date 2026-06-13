import axios from 'axios';

async function testAI() {
  try {
    const response = await axios.post('http://localhost:5001/api/ai/chat', {
      prompt: "What is RescueIQ?"
    });
    console.log("AI RESPONSE SUCCESS:", response.data.response);
  } catch (error) {
    console.error("AI RESPONSE ERROR:", error.response?.data || error.message);
  }
}

testAI();
