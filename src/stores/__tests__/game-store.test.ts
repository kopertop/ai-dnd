import { describe, it, expect, beforeEach } from 'vitest';
import '../../test/setup';
import { useGameStore } from '../game-store';
import type { Character } from '@/schemas/character';

describe('GameStore Encounter Management', () => {
  beforeEach(() => {
    const store = useGameStore.getState();
    store.exitEncounter();
    useGameStore.setState({
      characters: [
        {
          id: 'player1',
          name: 'Test Player',
          race: 'Human',
          class: 'Fighter',
          level: 1,
          abilities: {
            strength: 16,
            dexterity: 14,
            constitution: 15,
            intelligence: 10,
            wisdom: 12,
            charisma: 8,
          },
          hp: { current: 10, max: 10 },
          equipment: {},
        } as Character,
        {
          id: 'enemy1',
          name: 'Test Enemy',
          race: 'Goblin',
          class: 'Monster',
          level: 1,
          abilities: {
            strength: 8,
            dexterity: 14,
            constitution: 10,
            intelligence: 10,
            wisdom: 8,
            charisma: 8,
          },
          hp: { current: 7, max: 7 },
          equipment: {},
        } as Character,
      ],
    });
  });

  it('should start and manage an encounter', () => {
    const store = useGameStore.getState();
    
    // Start encounter
    store.startEncounter('Test Encounter', 'A test combat encounter', ['player1', 'enemy1']);
    expect(store.currentEncounter).toBeTruthy();
    expect(store.currentEncounter?.name).toBe('Test Encounter');
    expect(store.currentEncounter?.initiativeOrder.length).toBe(2);
    
    // Enter encounter
    store.enterEncounter();
    expect(store.isInEncounter).toBe(true);
    
    // Perform action
    store.performAction({
      type: 'attack',
      actor: 'player1',
      target: 'enemy1',
      details: 'Attacks with longsword',
    });
    expect(store.currentEncounter?.actionHistory.length).toBe(1);
    
    // Next turn
    const initialTurn = store.currentEncounter?.currentTurn;
    store.nextTurn();
    expect(store.currentEncounter?.currentTurn).toBe((initialTurn || 0) + 1);
    
    // Apply condition
    store.applyCondition('enemy1', 'poisoned');
    expect(store.currentEncounter?.conditions['enemy1']).toContain('poisoned');
    
    // Remove condition
    store.removeCondition('enemy1', 'poisoned');
    expect(store.currentEncounter?.conditions['enemy1']).not.toContain('poisoned');
    
    // Exit encounter
    store.exitEncounter();
    expect(store.isInEncounter).toBe(false);
    expect(store.currentEncounter).toBeNull();
  });
});
