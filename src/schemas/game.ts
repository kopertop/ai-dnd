import { z } from 'zod';

// Basic schemas
export const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
});

export const CharacterStatsSchema = z.object({
	strength: z.number().min(1).max(20),
	dexterity: z.number().min(1).max(20),
	constitution: z.number().min(1).max(20),
	intelligence: z.number().min(1).max(20),
	wisdom: z.number().min(1).max(20),
	charisma: z.number().min(1).max(20),
});

export const MapTileSchema = z.object({
	type: z.enum(['mountain', 'wall', 'water', 'cave', 'entry', 'exit', 'path', 'grass']),
	walkable: z.boolean(),
	description: z.string().optional(),
});

export const GameMessageSchema = z.object({
	id: z.string(),
	content: z.string(),
	sender: z.string(),
	timestamp: z.number(),
	type: z.enum(['system', 'player', 'dm']).default('player'),
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
	stats: CharacterStatsSchema,
	startingPoints: z.number().min(0).default(10),
});

export const GameMapSchema = z.object({
	id: z.string(),
	tiles: z.array(z.array(MapTileSchema)),
	width: z.number().min(1),
	height: z.number().min(1),
	name: z.string(),
});

export const GameStateSchema = z.object({
	characters: z.array(CharacterSchema),
	currentTurn: z.string(),
	gameMap: GameMapSchema,
	messages: z.array(GameMessageSchema),
});

// Export types inferred from schemas
export type Position = z.infer<typeof PositionSchema>;
export type CharacterStats = z.infer<typeof CharacterStatsSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type GameMap = z.infer<typeof GameMapSchema>;
export type MapTile = z.infer<typeof MapTileSchema>;
export type GameMessage = z.infer<typeof GameMessageSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
