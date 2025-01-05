import { z } from 'zod';

export const CampaignSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string(),
	dmId: z.string(),
	messages: z.array(z.object({
		id: z.string(),
		role: z.enum(['user', 'assistant']),
		content: z.string(),
		// Unix timestamp
		createdAt: z.number(),
	})),
	characters: z.record(z.string(), z.enum(['user', 'ai'])),
	createdAt: z.number(),
	lastPlayed: z.number(),
});

export type Campaign = z.infer<typeof CampaignSchema>;
