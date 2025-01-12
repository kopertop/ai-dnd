import { z } from 'zod';

export const SpellDamageSchema = z.object({
	type: z.enum([
		'acid',
		'bludgeoning',
		'cold',
		'fire',
		'force',
		'lightning',
		'necrotic',
		'piercing',
		'poison',
		'psychic',
		'radiant',
		'slashing',
		'thunder'
	]),
	amount: z.string(), // e.g. "2d6" or "1d8 + 3"
});

export const SpellSchema = z.object({
	id: z.string(),
	name: z.string(),
	level: z.number().min(0).max(9), // 0 for cantrips
	school: z.enum([
		'abjuration',
		'conjuration',
		'divination',
		'enchantment',
		'evocation',
		'illusion',
		'necromancy',
		'transmutation'
	]),
	castingTime: z.string(), // e.g. "1 action", "1 bonus action"
	range: z.string(), // e.g. "60 feet", "Self", "Touch"
	components: z.object({
		verbal: z.boolean(),
		somatic: z.boolean(),
		material: z.string().optional(),
	}),
	duration: z.string(), // e.g. "Instantaneous", "1 minute", "Concentration, up to 1 hour"
	description: z.string(),
	damage: SpellDamageSchema.optional(),
	healing: z.string().optional(), // e.g. "2d8 + 3"
	concentration: z.boolean().default(false),
	ritual: z.boolean().default(false),
});

export type SpellDamage = z.infer<typeof SpellDamageSchema>;
export type Spell = z.infer<typeof SpellSchema>;
