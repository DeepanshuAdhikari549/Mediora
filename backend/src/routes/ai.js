import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback mock response if no key configured
      return res.json({
        response: "I'm MediLiaison, your MediCompare AI assistant! I can help you find hospitals, compare prices, check test availability, and book appointments. Try asking: 'Find blood test near me' or 'What is the price of MRI in Dehradun?'"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are MediLiaison, a helpful and professional AI medical assistant for MediCompare — India's leading hospital & lab price comparison platform. 
              MediCompare helps users find hospitals, labs, and clinics near them, compare test prices, read reviews, and book appointments online.
              Current platform city focus: Dehradun (also covers Delhi, Mumbai, and other major cities).
              
              User message: ${message}
              
              Respond helpfully and concisely. If asked about specific prices or hospitals, suggest the user search on MediCompare for real-time data. Always be professional, empathetic and in plain English.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return res.json({
        response: "I'm having trouble connecting to my AI engine right now. Please try again in a moment!"
      });
    }

    const data = await response.json();
    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble generating a response. Please try again.";

    res.json({ response: aiText });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
