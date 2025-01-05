import { z } from 'zod';
import { GameMessageSchema } from './game';

export const CampaignSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string(),
	dmId: z.string(),
	messages: z.array(GameMessageSchema),
	characters: z.record(z.string(), z.enum(['user', 'ai'])),
	createdAt: z.number(),
	lastPlayed: z.number(),
});

export type Campaign = z.infer<typeof CampaignSchema>;
