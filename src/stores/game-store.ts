import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '@/schemas/game';
import { Campaign } from '@/schemas/campaign';
import { generateMap } from '@/utils/map-generator';
import { EncounterState, EncounterAction } from '@/schemas/encounter';

interface GameStore extends GameState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  currentEncounter: EncounterState | null;
  isInEncounter: boolean;
  currentTurn: string;
  
  // Campaign management
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'lastPlayed'>) => Campaign;
  loadCampaign: (id: string) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  exitCampaign: () => void;
  
  // Encounter management
  startEncounter: (name: string, description: string, participants: string[]) => void;
  enterEncounter: () => void;
  exitEncounter: () => void;
  performAction: (action: EncounterAction) => void;
  nextTurn: () => void;
  applyCondition: (characterId: string, condition: string) => void;
  removeCondition: (characterId: string, condition: string) => void;
  rollInitiative: (characterId: string) => number;
}

type SetState = (fn: (state: GameStore) => Partial<GameStore>) => void;
type GetState = () => GameStore;

const createGameStore = (set: SetState, get: GetState) => ({
  // Initial state
  campaigns: [],
  currentCampaign: null,
  currentEncounter: null,
  characters: [],
  currentTurn: '',
  gameMap: generateMap(),
  messages: [],
  inventory: [],
  isInEncounter: false,

  // Campaign management
  createCampaign: (campaignData) => {
    const campaign: Campaign = {
      ...campaignData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastPlayed: Date.now(),
    };
    set((state) => ({
      ...state,
      campaigns: [...state.campaigns, campaign],
    }));
    return campaign;
  },

  loadCampaign: (id) => {
    const campaign = get().campaigns.find((c) => c.id === id);
    if (!campaign) return;

    const campaignCharacters = get().characters.filter((c) =>
      campaign.characters[c.id] !== undefined
    ).map(char => ({
      ...char,
      controlType: campaign.characters[char.id] || 'user'
    }));

    set((state) => ({
      ...state,
      currentCampaign: campaign,
      characters: campaignCharacters,
      currentTurn: campaignCharacters[0]?.id || '',
      gameMap: generateMap(),
      messages: [],
    }));
  },

  updateCampaign: (id, updates) => {
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      currentCampaign: state.currentCampaign?.id === id 
        ? { ...state.currentCampaign, ...updates }
        : state.currentCampaign,
    }));
  },

  deleteCampaign: (id) => {
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
      currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
    }));
  },

  exitCampaign: () => {
    set((state) => ({
      ...state,
      currentCampaign: null
    }));
  },

  // Encounter management
  startEncounter: (name, description, participants) => {
    const initiativeOrder = participants.map(characterId => ({
      characterId,
      initiative: get().rollInitiative(characterId),
    })).sort((a, b) => b.initiative - a.initiative);

    const encounter: EncounterState = {
      id: crypto.randomUUID(),
      name,
      description,
      round: 1,
      initiativeOrder,
      currentTurn: 0,
      status: 'active',
      conditions: {},
      actionHistory: [],
    };

    set((state) => ({
      ...state,
      currentEncounter: encounter
    }));
  },

  enterEncounter: () => {
    if (!get().currentEncounter) return;
    set((state) => ({
      ...state,
      isInEncounter: true
    }));
  },

  exitEncounter: () => {
    set((state) => ({ 
      ...state,
      isInEncounter: false,
      currentEncounter: null,
    }));
  },

  performAction: (action) => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    set(state => ({
      ...state,
      currentEncounter: {
        ...encounter,
        actionHistory: [...encounter.actionHistory, action],
      }
    }));
  },

  nextTurn: () => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    const nextTurnIndex = (encounter.currentTurn + 1) % encounter.initiativeOrder.length;
    const newRound = nextTurnIndex === 0 ? encounter.round + 1 : encounter.round;

    set(state => ({
      ...state,
      currentEncounter: {
        ...encounter,
        currentTurn: nextTurnIndex,
        round: newRound,
      }
    }));
  },

  applyCondition: (characterId, condition) => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    const conditions = {
      ...encounter.conditions,
      [characterId]: [...(encounter.conditions[characterId] || []), condition],
    };

    set(state => ({
      ...state,
      currentEncounter: {
        ...encounter,
        conditions,
      }
    }));
  },

  removeCondition: (characterId, condition) => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    const characterConditions = encounter.conditions[characterId] || [];
    const conditions = {
      ...encounter.conditions,
      [characterId]: characterConditions.filter(c => c !== condition),
    };

    set(state => ({
      ...state,
      currentEncounter: {
        ...encounter,
        conditions,
      }
    }));
  },

  rollInitiative: (characterId) => {
    const character = get().characters.find(c => c.id === characterId);
    if (!character) return 0;

    // D&D 5e initiative is d20 + dexterity modifier
    const dexMod = Math.floor((character.abilities.dexterity - 10) / 2);
    return Math.floor(Math.random() * 20) + 1 + dexMod;
  },
});

// Create the store with middleware
const createStoreWithMiddleware = () => {
  if (process.env.NODE_ENV === 'test') {
    return create<GameStore>(createGameStore);
  }

  return create<GameStore>(
    persist(
      createGameStore,
      {
        name: 'dnd-game-storage',
      }
    )
  );
};

// Export the store hook
export const useGameStore = createStoreWithMiddleware();
