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

export const createStore = () => create<GameStore>((set, get) => ({
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

    set({
      currentCampaign: campaign,
      characters: campaignCharacters,
      currentTurn: campaignCharacters[0]?.id || '',
      gameMap: generateMap(),
      messages: [],
    });
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
    set({ currentCampaign: null });
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

    set({ currentEncounter: encounter });
  },

  enterEncounter: () => {
    if (!get().currentEncounter) return;
    set({ isInEncounter: true });
  },

  exitEncounter: () => {
    set({ 
      isInEncounter: false,
      currentEncounter: null,
    });
  },

  performAction: (action) => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    set(state => ({
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

    set({
      currentEncounter: {
        ...encounter,
        currentTurn: nextTurnIndex,
        round: newRound,
      }
    });
  },

  applyCondition: (characterId, condition) => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    const conditions = {
      ...encounter.conditions,
      [characterId]: [...(encounter.conditions[characterId] || []), condition],
    };

    set({
      currentEncounter: {
        ...encounter,
        conditions,
      }
    });
  },

  removeCondition: (characterId, condition) => {
    const encounter = get().currentEncounter;
    if (!encounter) return;

    const characterConditions = encounter.conditions[characterId] || [];
    const conditions = {
      ...encounter.conditions,
      [characterId]: characterConditions.filter(c => c !== condition),
    };

    set({
      currentEncounter: {
        ...encounter,
        conditions,
      }
    });
  },

  rollInitiative: (characterId) => {
    const character = get().characters.find(c => c.id === characterId);
    if (!character) return 0;

    // D&D 5e initiative is d20 + dexterity modifier
    const dexMod = Math.floor((character.abilities.dexterity - 10) / 2);
    return Math.floor(Math.random() * 20) + 1 + dexMod;
  },
}));

// Create a persisted version for production use
export const useGameStore = process.env.NODE_ENV === 'test'
  ? createStore()
  : create(
      persist(
        (set, get) => createStore()(set, get),
        {
          name: 'dnd-game-storage',
        }
      )
    );
