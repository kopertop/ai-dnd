import { z } from 'zod';
import { PositionSchema } from './base';
import { ItemSchema } from './item';

export const CharacterStatsSchema = z.object({
	strength: z.number().min(1).max(20),
	dexterity: z.number().min(1).max(20),
	constitution: z.number().min(1).max(20),
	intelligence: z.number().min(1).max(20),
	wisdom: z.number().min(1).max(20),
	charisma: z.number().min(1).max(20),
});

export const CharacterEquipmentSchema = z.object({
	ring1: ItemSchema.optional(),
	ring2: ItemSchema.optional(),
	chest: ItemSchema.optional(),
	legs: ItemSchema.optional(),
	feet: ItemSchema.optional(),
	head: ItemSchema.optional(),
	mainHand: ItemSchema.optional(),
	offHand: ItemSchema.optional(),
});

export const CharacterSchema = z.object({
	id: z.string(),
	name: z.string(),
	imageUrl: z.string().optional(),
	position: PositionSchema,
	type: z.enum(['player', 'npc', 'ai']),
	controlType: z.enum(['user', 'ai']),
	hp: z.number().min(0),
	maxHp: z.number().min(1),
	level: z.number().min(1),
	class: z.string(),
	race: z.string(),
	gender: z.string(),
	stats: CharacterStatsSchema,
	startingPoints: z.number().min(0).default(10),
	equipment: CharacterEquipmentSchema,
});

export type CharacterStats = z.infer<typeof CharacterStatsSchema>;
export type CharacterEquipment = z.infer<typeof CharacterEquipmentSchema>;
export type Character = z.infer<typeof CharacterSchema>;
