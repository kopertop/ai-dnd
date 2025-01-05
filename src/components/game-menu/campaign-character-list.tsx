import React from 'react';
import {
	Stack,
	Card,
	Badge,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { Campaign } from '@/schemas/campaign';
import { LuUser, LuBrain, LuSword } from 'react-icons/lu';
import { CharacterImage } from '@/components/shared/character-image';

interface CampaignCharacterListProps {
	campaign?: Campaign;
}

export const CampaignCharacterList: React.FC<CampaignCharacterListProps> = ({
	campaign,
}) => {
	const { getCharactersByIds } = useCharacterStore();
	const { currentTurn } = useGameStore();

	if (!campaign) return null;

	const characters = getCharactersByIds(Object.keys(campaign.characters));

	return (
		<Card className="shadow-sm">
			<Card.Header className="bg-dark text-white">
				<h5 className="mb-0">Campaign Characters</h5>
			</Card.Header>
			<Card.Body className="p-0">
				<Stack>
					{characters.map((character) => {
						const controlType = campaign.characters[character.id];
						const isCurrentTurn = currentTurn === character.id;

						return (
							<div
								key={character.id}
								className={`p-3 border-bottom ${isCurrentTurn ? 'bg-light' : ''}`}
							>
								<div className="d-flex align-items-center gap-3">
									<CharacterImage character={character} />
									<div className="flex-grow-1">
										<div className="d-flex justify-content-between align-items-start">
											<div>
												<h6 className="mb-0 d-flex align-items-center gap-2">
													{character.name}
													{isCurrentTurn && (
														<LuSword className="text-primary" title="Current Turn" />
													)}
												</h6>
												<small className="text-muted">
													Level {character.level} {character.race} {character.class}
												</small>
											</div>
											<Badge
												bg={controlType === 'user' ? 'primary' : 'secondary'}
												className="d-flex align-items-center gap-1"
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
										<div className="d-flex gap-2 mt-1 text-muted small">
											<span>HP: {character.hp}/{character.maxHp}</span>
											<span>•</span>
											<span>AC: {10 + Math.floor((character.stats.dexterity - 10) / 2)}</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</Stack>
			</Card.Body>
		</Card>
	);
};
