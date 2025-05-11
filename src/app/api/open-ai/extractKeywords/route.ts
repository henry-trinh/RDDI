import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts key concepts from text.",
        },
        {
          role: "user",
          content: `Extract the main key concepts from the following text as a comma-separated list: "${text}"`,
        },
      ],
      max_tokens: 50,
    });

    const keywords = response.choices[0]?.message?.content
      ? response.choices[0].message.content.trim().split(", ")
      : [];

    return new Response(JSON.stringify({ keywords }), { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error extracting keywords:", errorMessage);
    return new Response(JSON.stringify({ error: "Failed to extract keywords", details: errorMessage }), { status: 500 });
  }
}
