import { z } from 'zod';
import { PositionSchema } from './base';
import { CharacterSchema } from './character';
import { ItemSchema } from './item';

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
	inventory: z.array(ItemSchema), // Shared inventory
});

export type Position = z.infer<typeof PositionSchema>;
export type GameMap = z.infer<typeof GameMapSchema>;
export type MapTile = z.infer<typeof MapTileSchema>;
export type GameMessage = z.infer<typeof GameMessageSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
