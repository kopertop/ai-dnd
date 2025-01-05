import React from 'react';
import {
	Stack,
	Card,
	Button,
	Badge,
	Row,
	Col,
	ToggleButton,
} from 'react-bootstrap';
import { useCharacterStore } from '@/stores/character-store';
import { useGameStore } from '@/stores/game-store';
import { Campaign } from '@/schemas/campaign';
import { Character } from '@/schemas/character';
import { LuUser, LuBrain } from 'react-icons/lu';
import { CharacterImage } from '@/components/shared/character-image';

interface CharacterListProps {
	campaign?: Campaign;
	onCharacterSelect?: (character: Character) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
	campaign,
	onCharacterSelect,
}) => {
	const { characters, loadCharacter } = useCharacterStore();
	const { updateCampaign } = useGameStore();

	const handleCharacterAction = (character: Character) => {
		if (campaign) {
			updateCampaign(campaign.id, {
				characters: {
					...campaign.characters,
					[character.id]: 'ai',
				},
			});
			onCharacterSelect?.(character);
		} else {
			loadCharacter(character.id);
		}
	};

	const toggleControlType = (characterId: string) => {
		if (!campaign) return;

		const currentType = campaign.characters[characterId];
		updateCampaign(campaign.id, {
			characters: {
				...campaign.characters,
				[characterId]: currentType === 'user' ? 'ai' : 'user',
			},
		});
	};

	const isCharacterInCampaign = (character: Character) => {
		return campaign?.characters[character.id] !== undefined;
	};

	const getCharacterControl = (character: Character) => {
		return campaign?.characters[character.id] || 'user';
	};

	if (characters.length === 0) {
		return (
			<Stack gap={2} className="text-center p-4">
				<p className="text-muted mb-0">No characters found</p>
				<small className="text-muted">
					Create a new character to get started
				</small>
			</Stack>
		);
	}

	return (
		<Stack gap={3}>
			{characters.map((character) => {
				const inCampaign = isCharacterInCampaign(character);
				const controlType = getCharacterControl(character);

				return (
					<Card key={character.id} className="shadow-sm">
						<Card.Body>
							<Stack gap={3}>
								<div className="d-flex align-items-center gap-3">
									<CharacterImage character={character} />
									<div>
										<h5 className="mb-0">
											{character.name}
											{inCampaign && (
												<Badge bg="success" className="ms-2">
													In Campaign
												</Badge>
											)}
										</h5>
										<small className="text-muted">
											Level {character.level} {character.race} {character.class}
										</small>
									</div>
									{inCampaign && (
										<ToggleButton
											id={`control-type-${character.id}`}
											type="checkbox"
											variant={controlType === 'user' ? 'outline-primary' : 'outline-secondary'}
											checked={controlType === 'user'}
											value="1"
											onChange={() => toggleControlType(character.id)}
											size="sm"
										>
											{controlType === 'user' ? (
												<>
													<LuUser className="me-2" />
													Player
												</>
											) : (
												<>
													<LuBrain className="me-2" />
													AI
												</>
											)}
										</ToggleButton>
									)}
								</div>

								<Row xs={2} className="g-2 text-muted small">
									<Col>STR: {character.stats.strength}</Col>
									<Col>DEX: {character.stats.dexterity}</Col>
									<Col>CON: {character.stats.constitution}</Col>
									<Col>INT: {character.stats.intelligence}</Col>
									<Col>WIS: {character.stats.wisdom}</Col>
									<Col>CHA: {character.stats.charisma}</Col>
								</Row>

								<Button
									variant={campaign ? 'success' : 'primary'}
									size="sm"
									onClick={() => handleCharacterAction(character)}
									disabled={inCampaign}
								>
									{campaign
										? inCampaign
											? 'In your Campaign'
											: 'Add to Campaign'
										: 'Load Character'
									}
								</Button>
							</Stack>
						</Card.Body>
					</Card>
				);
			})}
		</Stack>
	);
};
