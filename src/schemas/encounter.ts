import { z } from 'zod';
import { PositionSchema } from './base';
import { SpellSchema } from './spells';
import { ItemSchema } from './item';

export const EncounterMapSchema = z.object({
	type: z.enum([
		'dungeon',
		'forest',
		'cave',
		'city',
		'castle',
		'ship',
		'tavern',
	]),
	width: z.number().min(5).max(20),
	height: z.number().min(5).max(20),
	obstacles: z.array(PositionSchema),
	exits: z.array(PositionSchema),
	description: z.string(),
});

export const CombatantSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['player', 'enemy']),
	position: PositionSchema,
	stats: z.object({
		hp: z.number(),
		maxHp: z.number(),
		ac: z.number(),
		initiative: z.number().optional(),
		strength: z.number(),
		dexterity: z.number(),
		constitution: z.number(),
	}),
	abilities: z.array(z.object({
		name: z.string(),
		description: z.string(),
		damage: z.string().optional(), // e.g. "2d6+3"
		range: z.number(),
		type: z.enum(['melee', 'ranged', 'spell', 'special']),
	})),
	spells: z.array(SpellSchema).optional(),
	equipment: z.array(ItemSchema).optional(),
});

export const EncounterInitSchema = z.object({
	type: z.enum(['combat', 'social', 'puzzle']),
	difficulty: z.enum(['easy', 'medium', 'hard', 'deadly']),
	map: EncounterMapSchema,
	combatants: z.array(CombatantSchema),
	description: z.string(),
});

export type EncounterMap = z.infer<typeof EncounterMapSchema>;
export type Combatant = z.infer<typeof CombatantSchema>;
export type EncounterInit = z.infer<typeof EncounterInitSchema>;
