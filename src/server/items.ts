import type { Message } from 'ai';
import { z } from 'zod';
import { createTogetherAI } from '@ai-sdk/togetherai';
import { ItemSchema } from '@/schemas/item';
import { generateText } from 'ai';

const together = createTogetherAI({
	apiKey: process.env.TOGETHER_API_KEY!,
});

// Create a schema specifically for AI-generated items
const ThematicItemsSchema = z.array(
	ItemSchema.extend({
		type: z.enum(['misc', 'potion', 'currency']),
		slot: z.literal('none'),
		value: z.number().min(1).max(100),
		quantity: z.number().min(1).max(3),
		stackable: z.boolean(),
	})
);

export async function generateThematicItems(scenario: string) {
	const messages: Message[] = [
		{
			id: crypto.randomUUID(),
			role: 'system',
			content: 'You are a D&D item generator. Create unique, thematic items based on campaign scenarios. Return items as a JSON array.',
		},
		{
			id: crypto.randomUUID(),
			role: 'user',
			content: `Generate 2-3 unique items that would fit this campaign scenario: "${scenario}".
			Return as a JSON array where each item has:
			{
				"id": "unique-string",
				"name": "Item Name",
				"description": "Detailed description",
				"type": "misc" or "potion" or "currency",
				"slot": "none",
				"value": number between 1-100,
				"quantity": number between 1-3,
				"stackable": boolean
			}
			Items should be thematic consumables, quest items, or special treasures. No weapons or armor.`,
		},
	];

	try {
		const model = together('meta-llama/Llama-3.3-70B-Instruct-Turbo');
		const result = await generateText({
			model,
			messages,
			temperature: 0.7,
			maxTokens: 500,
		});

		const response = await result.text;
		const jsonStr = response.substring(
			response.indexOf('['),
			response.lastIndexOf(']') + 1
		);

		const parsedItems = JSON.parse(jsonStr);
		const validatedItems = ThematicItemsSchema.parse(parsedItems);

		return validatedItems.map(item => ({
			...item,
			id: `${item.id}-${crypto.randomUUID()}`,
		}));
	} catch (error) {
		console.error('Failed to generate items:', error);
		return [];
	}
}
