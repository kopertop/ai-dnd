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
	/**
	 * A unique identifier for the message.
	 */
	id: z.string(),
	/**
	 * The timestamp of the message.
	 */
	createdAt: z.date().optional(),
	/**
	 * Text content of the message.
	 */
	content: z.string(),
	/**
	 * Additional attachments to be sent along with the message.
	 */
	experimental_attachments: z.array(z.any()).optional(),
	role: z.enum(['system', 'user', 'assistant', 'data']),
	data: z.any().optional(),
	/**
	 * Additional message-specific information added on the server via StreamData
	 */
	annotations: z.array(z.any()).optional(),
	/**
	 * Tool invocations (that can be tool calls or tool results, depending on whether or not the invocation has finished)
	 * that the assistant made as part of this message.
	 */
	toolInvocations: z.array(z.any()).optional(),
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
