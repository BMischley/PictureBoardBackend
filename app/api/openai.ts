
import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Parse request body
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    // Call OpenAI API
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/engines/dall-e-2/completions',
      {
        prompt: prompt,
        n: 1,
        size: "256x256",
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `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`
        }
      }
    );

    // Send the response
    return new Response(JSON.stringify(openaiResponse.data), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
