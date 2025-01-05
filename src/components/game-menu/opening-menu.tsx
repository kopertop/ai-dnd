import React from 'react';
import {
	Card,
	Stack,
	Button,
	Modal,
} from 'react-bootstrap';
import { CreateCampaign } from './create-campaign';
import { LoadCampaign } from './load-campaign';

export const OpeningMenu: React.FC = () => {
	const [showCreate, setShowCreate] = React.useState(false);
	const [showLoad, setShowLoad] = React.useState(false);

	return (
		<Card className="shadow-lg">
			<Card.Body className="p-4">
				<Stack gap={4}>
					<h1 className="text-center">D&D Game Master</h1>
					<p className="text-center text-muted fs-5">
						Create or load a campaign to begin your adventure
					</p>
					<Stack gap={3} className="align-items-center">
						<Button
							size="lg"
							variant="primary"
							style={{ width: '200px' }}
							onClick={() => setShowCreate(true)}
						>
							Create New Campaign
						</Button>
						<Button
							size="lg"
							variant="success"
							style={{ width: '200px' }}
							onClick={() => setShowLoad(true)}
						>
							Load Campaign
						</Button>
					</Stack>
				</Stack>
			</Card.Body>

			<Modal
				show={showCreate}
				onHide={() => setShowCreate(false)}
				size="lg"
				centered
				className="modal-blur"
			>
				<Modal.Header closeButton>
					<Modal.Title>Create New Campaign</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-4">
					<CreateCampaign onComplete={() => setShowCreate(false)} />
				</Modal.Body>
			</Modal>

			<Modal
				show={showLoad}
				onHide={() => setShowLoad(false)}
				size="lg"
				centered
				className="modal-blur"
			>
				<Modal.Header closeButton>
					<Modal.Title>Load Campaign</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-4">
					<LoadCampaign onComplete={() => setShowLoad(false)} />
				</Modal.Body>
			</Modal>
		</Card>
	);
};
