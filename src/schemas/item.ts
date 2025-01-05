import { z } from 'zod';

export const ItemStatSchema = z.object({
	strength: z.number().optional(),
	dexterity: z.number().optional(),
	constitution: z.number().optional(),
	intelligence: z.number().optional(),
	wisdom: z.number().optional(),
	charisma: z.number().optional(),
	damage: z.number().optional(),
	armor: z.number().optional(),
});

export const ItemEffectSchema = z.object({
	type: z.enum(['heal', 'damage', 'buff', 'debuff']),
	value: z.number(),
	duration: z.number().optional(), // in rounds, if applicable
	description: z.string(),
});

export const ItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.enum([
		'weapon',
		'armor',
		'potion',
		'ring',
		'currency',
		'misc',
	]),
	slot: z.enum([
		'ring1',
		'ring2',
		'chest',
		'legs',
		'feet',
		'head',
		'mainHand',
		'offHand',
		'none',
	]).default('none'),
	stats: ItemStatSchema.optional(),
	effect: ItemEffectSchema.optional(),
	value: z.number().default(0),
	quantity: z.number().default(1),
	stackable: z.boolean().default(false),
});

export type ItemStat = z.infer<typeof ItemStatSchema>;
export type ItemEffect = z.infer<typeof ItemEffectSchema>;
export type Item = z.infer<typeof ItemSchema>;
