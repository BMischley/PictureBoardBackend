
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { prompt } = req.body;
  
      // Validate prompt
      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }
  
      // Call OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/engines/dall-e-2/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "256x256",
        }),
      });
  
      const data = await openaiResponse.json();
  
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to match your exact origin in production
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
      // Send the response
      res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  