import React, { useState } from 'react';
import {
	Stack,
	Card,
	Badge,
	Collapse,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { Campaign } from '@/schemas/campaign';
import { LuUser, LuBrain, LuSword, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { CharacterCard } from '@/components/cards/character-card';
import { addDefaultEquipment } from '@/utils/character-equipment';

interface CampaignCharacterListProps {
	campaign?: Campaign;
}

export const CampaignCharacterList: React.FC<CampaignCharacterListProps> = ({
	campaign,
}) => {
	const [isOpen, setIsOpen] = useState(true);
	const { getCharactersByIds, updateCharacter } = useCharacterStore();
	const { currentTurn, isInEncounter } = useGameStore();

	if (!campaign) return null;

	const characters = getCharactersByIds(Object.keys(campaign.characters));

	return (
		<Card className='shadow-sm p-0'>
			<Card.Header
				className='bg-dark text-white p-0'
				role='button'
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='d-flex justify-content-between align-items-center p-3'>
					<h5 className='mb-0'>Campaign Characters</h5>
					{isOpen ? <LuChevronUp /> : <LuChevronDown />}
				</div>
			</Card.Header>
			<Collapse in={isOpen}>
				<div>
					<Card.Body className='p-0'>
						<Stack>
							{characters.map((character) => {
								if (!character.equipment) {
									addDefaultEquipment(character);
									updateCharacter(character.id, { equipment: character.equipment });
								}
								const controlType = campaign.characters[character.id];
								const isCurrentTurn = isInEncounter && currentTurn === character.id;

								return (
									<CharacterCard
										key={character.id}
										character={character}
										className={isCurrentTurn ? 'border-primary' : ''}
										header={
											<div className='d-flex justify-content-between align-items-center'>
												<div className='d-flex align-items-center gap-2'>
													{isCurrentTurn && (
														<LuSword className='text-primary' title='Current Turn' />
													)}
													<Badge
														bg={controlType === 'user' ? 'primary' : 'secondary'}
														className='d-flex align-items-center gap-1'
													>
														{controlType === 'user' ? (
															<>
																<LuUser />
																Player
															</>
														) : (
															<>
																<LuBrain />
																AI
															</>
														)}
													</Badge>
												</div>
											</div>
										}
									/>
								);
							})}
						</Stack>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
};
