import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const previousElements = new Set<string>(); // Store tracked elements

export async function POST(req: Request): Promise<Response> {
  try {
    console.log(previousElements);
    const { prompt } = await req.json();

    // Extract key concepts from the prompt
    const data = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts key concepts from text."
        },
        {
          role: "user",
          content: `Extract the main key concepts from the following text as a comma-separated list: "${prompt}"`
        }
      ],
      max_tokens: 50,
    });

    const keywords = data.choices[0]?.message?.content
      ? data.choices[0].message.content.trim().split(", ")
      : [];
    console.log(keywords);

    // Find new elements to add
    const newElements = keywords.filter((k) => !previousElements.has(k));
    newElements.forEach((el) => previousElements.add(el));
    console.log("New elements: ", newElements);

    if (newElements.length === 0) {
      return new Response(
        JSON.stringify({ message: "No new elements to add." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Request only the new elements from DALL·E
    const elementPrompts = newElements.map(
      (el) => `A cute colorful sketch illustration of ${el} with white background`
    );

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: elementPrompts.join(", "), // Generate all in one image
      n: 1,
      size: "1024x1024",
    });

    // Ensure response.data is defined and has a valid URL
    const newImageUrl = response.data && response.data[0] && response.data[0].url 
      ? response.data[0].url 
      : "";

    if (!newImageUrl) {
      return new Response(
        JSON.stringify({ error: "Failed to generate image, no valid URL returned" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl: newImageUrl, newElements }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ error: "Failed to generate image", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}