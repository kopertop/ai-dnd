import React, { useState } from 'react';
import {
	Form,
	Button,
	Stack,
	Alert,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CampaignSchema } from '@/schemas/menu';
import { useGameStore } from '@/stores/game-store';
import { CreateCharacter } from './create-character';

interface CreateCampaignProps {
	onComplete?: () => void;
}

type CampaignFormData = {
	name: string;
	description: string;
};

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ onComplete }) => {
	const { createCampaign } = useGameStore();
	const [showAddCharacter, setShowAddCharacter] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CampaignFormData>({
		resolver: zodResolver(
			CampaignSchema.pick({ name: true, description: true })
		),
	});

	const onSubmit = (data: CampaignFormData) => {
		createCampaign({
			...data,
			dmId: 'current-user',
			characters: [],
		});
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 3000);
		setShowAddCharacter(true);
	};

	return (
		<Stack gap={4}>
			{showSuccess && (
				<Alert variant="success">
					Campaign created successfully!
				</Alert>
			)}

			{!showAddCharacter ? (
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Stack gap={3}>
						<Form.Group>
							<Form.Label>Campaign Name</Form.Label>
							<Form.Control
								{...register('name')}
								isInvalid={!!errors.name}
							/>
							{errors.name && (
								<Form.Control.Feedback type="invalid">
									{errors.name.message}
								</Form.Control.Feedback>
							)}
						</Form.Group>

						<Form.Group>
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								{...register('description')}
								isInvalid={!!errors.description}
							/>
							{errors.description && (
								<Form.Control.Feedback type="invalid">
									{errors.description.message}
								</Form.Control.Feedback>
							)}
						</Form.Group>

						<Button type="submit" variant="primary">
							Create Campaign
						</Button>
					</Stack>
				</Form>
			) : (
				<>
					<h4>Add Characters to Campaign</h4>
					<p className="text-muted">
						Add at least one character to begin your campaign
					</p>
					<hr />
					<CreateCharacter onComplete={onComplete} />
					<Button variant="link" onClick={onComplete}>
						Skip for now
					</Button>
				</>
			)}
		</Stack>
	);
};
