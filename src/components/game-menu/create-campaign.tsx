import React, { useState } from 'react';
import {
	Form,
	Button,
	Stack,
	Alert,
	Spinner,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Campaign, CampaignSchema } from '@/schemas/campaign';
import { useGameStore } from '@/stores/game-store';
import { LuWand } from 'react-icons/lu';
import { useChat } from 'ai/react';

interface CreateCampaignProps {
	onComplete?: (campaign: Campaign) => void;
}

type CampaignFormData = {
	name: string;
	description: string;
};

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ onComplete }) => {
	const { createCampaign } = useGameStore();
	const [showSuccess, setShowSuccess] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);

	const { append } = useChat({
		api: '/api/chat',
		onFinish: (response) => {
			console.log('FINISHED', response);
			if (response.content) {
				setValue('description', response.content);
			}
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CampaignFormData>({
		resolver: zodResolver(
			CampaignSchema.pick({ name: true, description: true })
		),
	});

	const campaignName = watch('name');

	const generateScenario = async () => {
		if (!campaignName) {
			return;
		}

		setIsGenerating(true);
		try {
			const response = await append({
				role: 'user',
				content: `Generate a brief but engaging D&D campaign scenario for a campaign titled "${campaignName}". Include the setting, main conflict, and potential hooks for player engagement. Keep it under 250 words.`,
				id: crypto.randomUUID(),
			});
			console.log('RESPONSE', response);

			if (response) {
				setValue('description', response);
			}
		} catch (error) {
			console.error('Failed to generate scenario:', error);
		} finally {
			setIsGenerating(false);
		}
	};

	const onSubmit = (data: CampaignFormData) => {
		const campaign = createCampaign({
			...data,
			dmId: 'current-user',
			characters: {},
			messages: [],
			inventory: [],
		});
		setShowSuccess(true);
		setTimeout(() => {
			setShowSuccess(false);
			onComplete?.(campaign);
		}, 3000);
	};

	return (
		<Stack gap={4}>
			{showSuccess && (
				<Alert variant='success'>
					Campaign created successfully!
				</Alert>
			)}

			<Form onSubmit={handleSubmit(onSubmit)}>
				<Stack gap={3}>
					<Form.Group>
						<Form.Label>Campaign Name</Form.Label>
						<Form.Control
							{...register('name')}
							isInvalid={!!errors.name}
							placeholder='Enter a name for your campaign'
						/>
						{errors.name && (
							<Form.Control.Feedback type='invalid'>
								{errors.name.message}
							</Form.Control.Feedback>
						)}
					</Form.Group>

					<Form.Group>
						<Form.Label className='d-flex justify-content-between align-items-center'>
							Description
							<Button
								variant='outline-secondary'
								size='sm'
								onClick={generateScenario}
								disabled={!campaignName || isGenerating}
								className='d-flex align-items-center gap-2'
							>
								{isGenerating ? (
									<>
										<Spinner size='sm' animation='border' />
										Generating...
									</>
								) : (
									<>
										<LuWand />
										Generate Scenario
									</>
								)}
							</Button>
						</Form.Label>
						<Form.Control
							as='textarea'
							rows={5}
							{...register('description')}
							isInvalid={!!errors.description}
							placeholder='Describe your campaign scenario...'
						/>
						{errors.description && (
							<Form.Control.Feedback type='invalid'>
								{errors.description.message}
							</Form.Control.Feedback>
						)}
					</Form.Group>

					<Button type='submit' variant='primary'>
						Create Campaign
					</Button>
				</Stack>
			</Form>
		</Stack>
	);
};
