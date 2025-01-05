import { z } from 'zod';
import { CharacterSchema } from './game';

export const CampaignSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	dmId: z.string(), // The DM's user ID
	characters: z.array(z.string()), // Array of character IDs
	createdAt: z.number(),
	lastPlayed: z.number(),
});

export type Campaign = z.infer<typeof CampaignSchema>;
