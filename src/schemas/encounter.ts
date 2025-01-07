import { z } from 'zod';

export const EncounterActionSchema = z.object({
  type: z.enum([
    'attack',
    'cast',
    'dash',
    'disengage',
    'dodge',
    'help',
    'hide',
    'ready',
    'search',
    'use',
    'other'
  ]),
  actor: z.string(), // Character ID
  target: z.string().optional(), // Character ID if applicable
  details: z.string(), // Additional action details
});

export const EncounterStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  round: z.number(),
  initiativeOrder: z.array(z.object({
    characterId: z.string(),
    initiative: z.number(),
  })),
  currentTurn: z.number(), // Index in initiativeOrder
  status: z.enum(['active', 'completed', 'pending']),
  conditions: z.record(z.string(), z.array(z.string())), // Character ID -> Array of condition names
  actionHistory: z.array(EncounterActionSchema),
});

export type EncounterAction = z.infer<typeof EncounterActionSchema>;
export type EncounterState = z.infer<typeof EncounterStateSchema>;