import React from 'react';
import {
	Stack,
	Card,
	Button,
	Badge,
	Row,
	Col,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { LuCalendar, LuUsers } from 'react-icons/lu';

interface LoadCampaignProps {
	onComplete?: () => void;
}

export const LoadCampaign: React.FC<LoadCampaignProps> = ({ onComplete }) => {
	const { campaigns, loadCampaign } = useGameStore();
	const { getCharactersByIds } = useCharacterStore();

	const handleLoadCampaign = (id: string) => {
		loadCampaign(id);
		onComplete?.();
	};

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
				const characters = getCharactersByIds(Object.keys(campaign.characters));
				const lastPlayed = new Date(campaign.lastPlayed).toLocaleDateString();
				const userCharacters = characters.filter(c => campaign.characters[c.id] === 'user').length;
				const aiCharacters = characters.filter(c => campaign.characters[c.id] === 'ai').length;

				return (
					<Card key={campaign.id} className="shadow-sm">
						<Card.Body>
							<Stack gap={3}>
								<div className="d-flex justify-content-between align-items-start">
									<h5 className="mb-0">{campaign.name}</h5>
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

								<Button
									variant="primary"
									size="sm"
									onClick={() => handleLoadCampaign(campaign.id)}
								>
									Load Campaign
								</Button>
							</Stack>
						</Card.Body>
					</Card>
				);
			})}
		</Stack>
	);
};
