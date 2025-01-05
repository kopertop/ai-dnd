import React from 'react';
import {
	Stack,
	Card,
	Button,
	Badge,
	Row,
	Col,
	ButtonGroup,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { LuCalendar, LuUsers } from 'react-icons/lu';

export const CampaignList: React.FC = () => {
	const { campaigns, loadCampaign, currentCampaign, exitCampaign } = useGameStore();
	const { getCharactersByIds } = useCharacterStore();

	if (campaigns.length === 0) {
		return (
			<Stack gap={2} className="text-center p-4">
				<p className="text-muted mb-0">No campaigns found</p>
				<small className="text-muted">
					Create a new campaign to get started
				</small>
			</Stack>
		);
	}

	return (
		<Stack gap={3}>
			{campaigns.map((campaign) => {
				const characters = getCharactersByIds(campaign.characters);
				const lastPlayed = new Date(campaign.lastPlayed).toLocaleDateString();
				const userCharacters = characters.filter(c => c.controlType === 'user').length;
				const aiCharacters = characters.filter(c => c.controlType === 'ai').length;
				const isActive = currentCampaign?.id === campaign.id;

				return (
					<Card
						key={campaign.id}
						className={`shadow-sm ${isActive ? 'border-primary' : ''}`}
					>
						<Card.Body>
							<Stack gap={3}>
								<div className="d-flex justify-content-between align-items-start">
									<h5 className="mb-0">
										{campaign.name}
										{isActive && (
											<Badge bg="primary" className="ms-2">
												Active
											</Badge>
										)}
									</h5>
									<Badge bg="success">
										{characters.length} Characters
									</Badge>
								</div>

								<p className="text-secondary mb-0">
									{campaign.description}
								</p>

								<Row className="text-muted small align-items-center">
									<Col className="d-flex align-items-center">
										<LuCalendar className="me-1" />
										Last played: {lastPlayed}
									</Col>
									<Col className="d-flex align-items-center">
										<LuUsers className="me-1" />
										{userCharacters} Players, {aiCharacters} AI
									</Col>
								</Row>

								<ButtonGroup>
									{isActive ? (
										<Button
											variant="outline-danger"
											size="sm"
											onClick={exitCampaign}
										>
											Exit Campaign
										</Button>
									) : (
										<Button
											variant="primary"
											size="sm"
											onClick={() => loadCampaign(campaign.id)}
										>
											Load Campaign
										</Button>
									)}
								</ButtonGroup>
							</Stack>
						</Card.Body>
					</Card>
				);
			})}
		</Stack>
	);
};
