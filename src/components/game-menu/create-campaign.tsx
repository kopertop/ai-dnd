import React from 'react';
import {
	Box,
	Button,
	Input,
	VStack,
	Textarea,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CampaignSchema } from '@/schemas/menu';
import { useGameStore } from '@/stores/game-store';

type CampaignFormData = {
	name: string;
	description: string;
};

export const CreateCampaign: React.FC = () => {
	const { createCampaign } = useGameStore();
	const toast = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CampaignFormData>({
		resolver: zodResolver(
			CampaignSchema.pick({ name: true, description: true })
		),
	});

	const onSubmit = (data: CampaignFormData) => {
		createCampaign({
			...data,
			dmId: 'current-user', // TODO: Replace with actual user ID
			characters: [],
		});
		toast({
			title: 'Campaign Created',
			description: `${data.name} has been created successfully!`,
			status: 'success',
			duration: 3000,
		});
		reset();
	};

	return (
		<Box as="form" onSubmit={handleSubmit(onSubmit)} mt={8}>
			<VStack gap={4} align="stretch">
				<FormControl isRequired isInvalid={!!errors.name}>
					<FormLabel>Campaign Name</FormLabel>
					<Input {...register('name')} />
				</FormControl>

				<FormControl isRequired isInvalid={!!errors.description}>
					<FormLabel>Description</FormLabel>
					<Textarea {...register('description')} />
				</FormControl>

				<Button type="submit" colorScheme="blue">
					Create Campaign
				</Button>
			</VStack>
		</Box>
	);
};
