import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ANTHROPIC_API_KEY } from '$env/static/private';
import type { RequestHandler } from "./$types";

// Ensure the API key is available
if (!ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set.");
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { messages } = await request.json(); // Expecting an array of messages

    // Basic validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid request body: messages array is required.", { status: 400 });
    }

    // Initialize the Anthropic model with streaming enabled
    const model = new ChatAnthropic({
      apiKey: ANTHROPIC_API_KEY,
      modelName: "claude-3-5-sonnet-20240620", // Or your preferred model
      streaming: true,
    });

    // Use the BytesOutputParser to handle the stream of bytes
    const parser = new BytesOutputParser();

    // Convert incoming messages to Langchain format (basic example, might need refinement)
    const history = messages.map((msg: { role: string, content: string }) => {
        if (msg.role === 'user') {
            return new HumanMessage(msg.content);
        } else {
            // Assuming other roles are 'assistant' or similar
            return new AIMessage(msg.content);
        }
    });

    // Create the stream
    const stream = await model.pipe(parser).stream(history);

    // Return the stream directly to the client
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream", // Important for streaming
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    // Provide a more informative error response
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return new Response(JSON.stringify({ error: "Failed to process chat request.", details: errorMessage }), { status: 500 });
  }
}; 