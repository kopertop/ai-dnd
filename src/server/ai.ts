import { createTogetherAI } from '@ai-sdk/togetherai';
import { streamText } from 'ai';
import type { Message } from 'ai';

const together = createTogetherAI({
	apiKey: process.env.TOGETHER_API_KEY!,
});

export async function handleChat(messages: Message[]) {
	const model = together('meta-llama/Llama-3.3-70B-Instruct-Turbo');

	const result = streamText({
		model,
		messages,
		temperature: 0.7,
		maxTokens: 500,
	});

	return result.toDataStreamResponse();
}
