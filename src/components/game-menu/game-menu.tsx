import React from 'react';
import {
	Container,
	Row,
	Col,
	Stack,
	Button,
	Card,
} from 'react-bootstrap';
import { CampaignList } from './campaign-list';
import { CharacterList } from './character-list';
import { useGameStore } from '@/stores/game-store';

export const GameMenu: React.FC = () => {
	const { currentCampaign } = useGameStore();

	return (
		<Container>
			<Row className="g-4">
				<Col md={8}>
					<Card className="shadow-sm h-100">
						<Card.Body>
							<Stack gap={4}>
								<div className="d-flex justify-content-between align-items-center">
									<h4 className="mb-0">Campaigns</h4>
									<Button variant="primary" size="sm">
										New Campaign
									</Button>
								</div>
								<CampaignList />
							</Stack>
						</Card.Body>
					</Card>
				</Col>

				<Col md={4}>
					<Card className="shadow-sm h-100">
						<Card.Body>
							<Stack gap={4}>
								<div className="d-flex justify-content-between align-items-center">
									<h4 className="mb-0">Characters</h4>
									<Button
										variant="primary"
										size="sm"
										disabled={!currentCampaign}
									>
										New Character
									</Button>
								</div>
								<CharacterList />
							</Stack>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
