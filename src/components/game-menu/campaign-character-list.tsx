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
import { Item } from '@/schemas/item';
import { LuUser, LuBrain, LuSword, LuShield, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { CharacterImage } from '@/components/shared/character-image';
import { addDefaultEquipment } from '@/utils/character-equipment';

interface CampaignCharacterListProps {
	campaign?: Campaign;
}

export const CampaignCharacterList: React.FC<CampaignCharacterListProps> = ({
	campaign,
}) => {
	const [isOpen, setIsOpen] = useState(true);
	const { getCharactersByIds, updateCharacter } = useCharacterStore();
	const { currentTurn } = useGameStore();

	if (!campaign) return null;

	const characters = getCharactersByIds(Object.keys(campaign.characters));

	const getEquippedItems = (characterId: string): Record<string, Item> => {
		const equippedItems: Record<string, Item> = {};
		campaign.inventory?.forEach(item => {
			if (item.slot !== 'none') {
				equippedItems[item.slot] = item;
			}
		});
		return equippedItems;
	};

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
								const isCurrentTurn = currentTurn === character.id;
								const equippedItems = getEquippedItems(character.id);

								return (
									<div
										key={character.id}
										className={`p-3 border-bottom ${isCurrentTurn ? 'bg-light' : ''}`}
									>
										<div className='d-flex align-items-center gap-3'>
											<CharacterImage character={character} />
											<div className='flex-grow-1'>
												<div className='d-flex justify-content-between align-items-start'>
													<div>
														<h6 className='mb-0 d-flex align-items-center gap-2'>
															{character.name}
															{isCurrentTurn && (
																<LuSword className='text-primary' title='Current Turn' />
															)}
														</h6>
														<small className='text-muted'>
															Level {character.level} {character.race} {character.class}
														</small>
													</div>
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
												<div className='d-flex gap-2 mt-1 text-muted small'>
													<span>HP: {character.hp}/{character.maxHp}</span>
													<span>•</span>
													<span>AC: {10 + Math.floor((character.stats.dexterity - 10) / 2)}</span>
												</div>
												{Object.keys(equippedItems).length > 0 && (
													<div className='mt-2'>
														<div className='d-flex gap-2 flex-wrap'>
															{Object.entries(equippedItems).map(([slot, item]) => (
																<Badge
																	key={slot}
																	bg='light'
																	text='dark'
																	className='d-flex align-items-center gap-1'
																>
																	<LuShield className='opacity-50' />
																	<span className='text-capitalize'>
																		{slot}: {item.name}
																	</span>
																</Badge>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</Stack>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
};
