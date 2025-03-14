const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResponse = async (prompt, imageData = null) => {
  try {
    if (imageData) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const result = await model.generateContent([prompt, imageData]);
      const response = await result.response;
      return response.text();
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat();
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

const generateStreamResponse = async function* (prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    
    for await (const chunk of result.stream()) {
      yield chunk.text();
    }
  } catch (error) {
    console.error('Gemini Streaming Error:', error);
    throw new Error('Streaming failed. Please try again.');
  }
};

module.exports = { generateResponse, generateStreamResponse };