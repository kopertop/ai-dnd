import React, { useState } from 'react';
import {
	Stack,
	Card,
	Button,
	Badge,
	Row,
	Col,
	ButtonGroup,
	Modal,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { Campaign } from '@/schemas/menu';
import { LuCalendar, LuUsers, LuTrash2 } from 'react-icons/lu';

export const CampaignList: React.FC<{ onCampaignSelect: (campaign: Campaign) => void }> = ({ onCampaignSelect }) => {
	const { campaigns, loadCampaign, currentCampaign, deleteCampaign } = useGameStore();
	const { getCharactersByIds } = useCharacterStore();
	const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

	const handleDelete = () => {
		if (campaignToDelete) {
			deleteCampaign(campaignToDelete.id);
			setCampaignToDelete(null);
		}
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
				const characterIds = Object.keys(campaign.characters);
				const characters = getCharactersByIds(characterIds);
				const lastPlayed = new Date(campaign.lastPlayed).toLocaleDateString();
				const userCharacters = characterIds.filter(id => campaign.characters[id] === 'user').length;
				const aiCharacters = characterIds.filter(id => campaign.characters[id] === 'ai').length;
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
											onClick={() => setCampaignToDelete(campaign)}
										>
											Exit Campaign
										</Button>
									) : (
										<>
											<Button
												className="me-2"
												variant="primary"
												size="sm"
												onClick={() => {
													loadCampaign(campaign.id);
													onCampaignSelect(campaign);
												}}
											>
												Load Campaign
											</Button>
											<Button
												variant="outline-danger"
												size="sm"
												onClick={() => setCampaignToDelete(campaign)}
											>
												<LuTrash2 />
											</Button>
										</>
									)}
								</ButtonGroup>
							</Stack>
						</Card.Body>
					</Card>
				);
			})}

			<Modal
				show={!!campaignToDelete}
				onHide={() => setCampaignToDelete(null)}
				centered
				className="modal-blur"
			>
				<Modal.Header closeButton>
					<Modal.Title>Delete Campaign</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete "{campaignToDelete?.name}"? This action cannot be undone.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setCampaignToDelete(null)}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleDelete}>
						Delete Campaign
					</Button>
				</Modal.Footer>
			</Modal>
		</Stack>
	);
};
