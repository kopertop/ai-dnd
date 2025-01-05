import React, { useState } from 'react';
import {
	Stack,
	Button,
	Form,
	Alert,
	Modal,
} from 'react-bootstrap';
import { useCharacterStore } from '@/stores/character-store';
import { useGameStore } from '@/stores/game-store';
import { Character } from '@/schemas/character';
import { LuUser, LuBrain, LuUserPlus } from 'react-icons/lu';
import { CharacterCard } from '@/components/cards/character-card';
import { CreateCharacter } from './create-character';
import { addDefaultEquipment } from '@/utils/character-equipment';

const MAX_CHARACTERS = 4;

export const AddCharacters: React.FC = () => {
	const { characters, updateCharacter } = useCharacterStore();
	const { currentCampaign, updateCampaign } = useGameStore();
	const [selectedCharacters, setSelectedCharacters] = useState<Record<string, 'user' | 'ai'>>({});
	const [showCreateCharacter, setShowCreateCharacter] = useState(false);

	if (!currentCampaign) {
		return null;
	}

	if (!characters.length) {
		return (
			<Stack gap={3} className='p-4'>
				<Alert variant='info'>
					No characters available. Create your first character to begin.
				</Alert>
				<Button
					variant='primary'
					onClick={() => setShowCreateCharacter(true)}
					className='d-flex align-items-center gap-2 justify-content-center'
				>
					<LuUserPlus />
					Create First Character
				</Button>
			</Stack>
		);
	}

	// Make sure all characters have default equipment
	for (const character of characters) {
		if (!character.equipment || Object.keys(character.equipment).length === 0) {
			character.equipment = {};
			addDefaultEquipment(character);
			updateCharacter(character.id, { equipment: character.equipment });
		}
	}

	const handleCharacterToggle = (character: Character) => {
		setSelectedCharacters(prev => {
			const updated = { ...prev };
			if (character.id in updated) {
				if (updated[character.id] === 'user' &&
					Object.values(updated).filter(type => type === 'user').length <= 1) {
					return prev;
				}
				delete updated[character.id];
			} else {
				if (Object.keys(updated).length >= MAX_CHARACTERS) {
					return prev;
				}
				const hasUserControlled = Object.values(updated).includes('user');
				updated[character.id] = hasUserControlled ? 'ai' : 'user';
			}
			return updated;
		});
	};

	const handleControlTypeToggle = (characterId: string) => {
		setSelectedCharacters(prev => {
			if (prev[characterId] === 'user' &&
				Object.values(prev).filter(type => type === 'user').length <= 1) {
				return prev;
			}
			return {
				...prev,
				[characterId]: prev[characterId] === 'user' ? 'ai' : 'user',
			};
		});
	};

	const handleAddCharacters = () => {
		if (!currentCampaign) return;

		updateCampaign(currentCampaign.id, {
			characters: {
				...currentCampaign.characters,
				...selectedCharacters,
			},
		});
	};

	const selectedCount = Object.keys(selectedCharacters).length;
	const userControlledCount = Object.values(selectedCharacters).filter(type => type === 'user').length;
	const canAddMore = selectedCount < MAX_CHARACTERS;
	const canStartCampaign = selectedCount > 0 && userControlledCount > 0;

	const getStartButtonMessage = () => {
		if (selectedCount === 0) {
			return 'Select at least one character to start the campaign';
		}
		if (userControlledCount === 0) {
			return 'At least one character must be player-controlled';
		}
		return '';
	};

	return (
		<Stack gap={4} className='p-4'>
			<div className='d-flex justify-content-between align-items-start'>
				<div>
					<h4>Add Characters to Campaign</h4>
					<p className='text-muted'>
						Select characters to add to your campaign (1-{MAX_CHARACTERS} characters).
						At least one character must be player-controlled.
					</p>
				</div>
				<Button
					variant='outline-primary'
					onClick={() => setShowCreateCharacter(true)}
					className='d-flex align-items-center gap-2'
				>
					<LuUserPlus />
					New Character
				</Button>
			</div>

			{selectedCount >= MAX_CHARACTERS && (
				<Alert variant='warning'>
					Maximum of {MAX_CHARACTERS} characters reached
				</Alert>
			)}

			<Stack gap={3}>
				{characters.map((character) => {
					const isSelected = character.id in selectedCharacters;
					const controlType = selectedCharacters[character.id];
					const isDisabled = !isSelected && !canAddMore;

					return (
						<CharacterCard
							key={character.id}
							character={character}
							className={`${isSelected ? 'border-primary' : ''} ${isDisabled ? 'opacity-50' : ''}`}
							header={
								<div className='d-flex align-items-center gap-3'>
									<Form.Check
										type='checkbox'
										checked={isSelected}
										onChange={() => handleCharacterToggle(character)}
										disabled={isDisabled}
										label=''
									/>
									<div className='flex-grow-1'>
										{isDisabled ? 'Maximum characters reached' : 'Select Character'}
									</div>
									{isSelected && (
										<Button
											variant={controlType === 'user' ? 'primary' : 'secondary'}
											size='sm'
											onClick={() => handleControlTypeToggle(character.id)}
											className='d-flex align-items-center gap-2'
										>
											{controlType === 'user' ? (
												<>
													<LuUser />
													Player Controlled
												</>
											) : (
												<>
													<LuBrain />
													AI Controlled
												</>
											)}
										</Button>
									)}
								</div>
							}
						/>
					);
				})}
			</Stack>

			<div className='d-flex flex-column gap-2'>
				<div className='d-flex justify-content-between align-items-center'>
					<div className='text-muted'>
						{selectedCount} of {MAX_CHARACTERS} characters selected
						{selectedCount > 0 && ` (${userControlledCount} player-controlled)`}
					</div>
					<Button
						variant='primary'
						size='lg'
						disabled={!canStartCampaign}
						onClick={handleAddCharacters}
					>
						Start Campaign
					</Button>
				</div>
				{!canStartCampaign && (
					<Alert variant='info' className='mb-0'>
						{getStartButtonMessage()}
					</Alert>
				)}
			</div>

			<Modal
				show={showCreateCharacter}
				onHide={() => setShowCreateCharacter(false)}
				size='lg'
				centered
				className='modal-blur'
			>
				<Modal.Header closeButton>
					<Modal.Title>Create New Character</Modal.Title>
				</Modal.Header>
				<Modal.Body className='p-4'>
					<CreateCharacter
						onComplete={(character) => {
							setShowCreateCharacter(false);
							// Automatically select the new character as user-controlled
							setSelectedCharacters(prev => ({
								...prev,
								[character.id]: 'user',
							}));
						}}
					/>
				</Modal.Body>
			</Modal>
		</Stack>
	);
};
