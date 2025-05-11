import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a middle schooler who wants to learn about the provided prompt. Provide a single sentence question to kick off the discussion of the topic.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: 50,
    });

    const question = response.choices[0]?.message?.content || "No question generated.";
    return new Response(JSON.stringify({ question }), { status: 200 });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate the first question' }), 
      { status: 500 }
    );
  }
}
