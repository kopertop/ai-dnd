import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game-store';

describe('GameStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useGameStore.getState();
    useGameStore.setState({
      ...store,
      campaigns: [],
      currentCampaign: null,
      currentEncounter: null,
      characters: [{
        id: 'char1',
        name: 'Test Character',
        abilities: { dexterity: 10 },
      }],
      currentTurn: '',
      gameMap: { tiles: [], width: 32, height: 32 },
      messages: [],
      inventory: [],
      isInEncounter: false,
    });
  });

  it('should initialize with default values', () => {
    const store = useGameStore.getState();
    expect(store.campaigns).toEqual([]);
    expect(store.currentCampaign).toBeNull();
    expect(store.currentEncounter).toBeNull();
    expect(store.isInEncounter).toBe(false);
  });

  it('should create a campaign', () => {
    const store = useGameStore.getState();
    const campaign = store.createCampaign({
      name: 'Test Campaign',
      description: 'Test Description',
      characters: {},
    });

    const updatedStore = useGameStore.getState();
    expect(campaign.name).toBe('Test Campaign');
    expect(campaign.description).toBe('Test Description');
    expect(updatedStore.campaigns).toHaveLength(1);
  });

  it('should handle encounter state correctly', () => {
    const store = useGameStore.getState();
    
    // Start an encounter
    store.startEncounter('Test Encounter', 'Test Description', ['char1', 'char2']);
    let updatedStore = useGameStore.getState();
    expect(updatedStore.currentEncounter).not.toBeNull();
    expect(updatedStore.currentEncounter?.name).toBe('Test Encounter');
    
    // Enter encounter
    store.enterEncounter();
    updatedStore = useGameStore.getState();
    expect(updatedStore.isInEncounter).toBe(true);
    
    // Exit encounter
    store.exitEncounter();
    updatedStore = useGameStore.getState();
    expect(updatedStore.isInEncounter).toBe(false);
    expect(updatedStore.currentEncounter).toBeNull();
  });
});
