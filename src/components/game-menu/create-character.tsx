import React from 'react';
import {
	Form,
	Button,
	Stack,
	Alert,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CharacterSchema, Character } from '@/schemas/game';
import { useCharacterStore } from '@/stores/character-store';

type CharacterFormData = Omit<Character, 'id'>;

const CLASSES = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin'];
const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Half-Elf'];

interface CreateCharacterProps {
	onComplete?: () => void;
}

export const CreateCharacter: React.FC<CreateCharacterProps> = ({ onComplete }) => {
	const { createCharacter } = useCharacterStore();
	const [showSuccess, setShowSuccess] = React.useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CharacterFormData>({
		resolver: zodResolver(CharacterSchema.omit({ id: true })),
		defaultValues: {
			type: 'player',
			controlType: 'user',
			hp: 10,
			maxHp: 10,
			level: 1,
			startingPoints: 10,
			stats: {
				strength: 10,
				dexterity: 10,
				constitution: 10,
				intelligence: 10,
				wisdom: 10,
				charisma: 10,
			},
		},
	});

	const onSubmit = (data: CharacterFormData) => {
		createCharacter(data);
		setShowSuccess(true);
		setTimeout(() => {
			setShowSuccess(false);
			reset();
			onComplete?.();
		}, 2000);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap={3}>
				{showSuccess && (
					<Alert variant="success">
						Character created successfully!
					</Alert>
				)}

				<Form.Group>
					<Form.Label>Character Name</Form.Label>
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
					<Form.Label>Race</Form.Label>
					<Form.Select {...register('race')} isInvalid={!!errors.race}>
						<option value="">Select Race</option>
						{RACES.map((race) => (
							<option key={race} value={race}>
								{race}
							</option>
						))}
					</Form.Select>
					{errors.race && (
						<Form.Control.Feedback type="invalid">
							{errors.race.message}
						</Form.Control.Feedback>
					)}
				</Form.Group>

				<Form.Group>
					<Form.Label>Class</Form.Label>
					<Form.Select {...register('class')} isInvalid={!!errors.class}>
						<option value="">Select Class</option>
						{CLASSES.map((cls) => (
							<option key={cls} value={cls}>
								{cls}
							</option>
						))}
					</Form.Select>
					{errors.class && (
						<Form.Control.Feedback type="invalid">
							{errors.class.message}
						</Form.Control.Feedback>
					)}
				</Form.Group>

				<Form.Group>
					<Form.Label>Character Control</Form.Label>
					<div>
						<Form.Check
							type="radio"
							label="User Controlled"
							value="user"
							{...register('controlType')}
							inline
							defaultChecked
						/>
						<Form.Check
							type="radio"
							label="AI Controlled"
							value="ai"
							{...register('controlType')}
							inline
						/>
					</div>
				</Form.Group>

				<Form.Group>
					<Form.Label>Starting Points</Form.Label>
					<Form.Control
						type="number"
						{...register('startingPoints', { valueAsNumber: true })}
						isInvalid={!!errors.startingPoints}
					/>
					<Form.Text className="text-muted">
						Points available for character creation
					</Form.Text>
					{errors.startingPoints && (
						<Form.Control.Feedback type="invalid">
							{errors.startingPoints.message}
						</Form.Control.Feedback>
					)}
				</Form.Group>

				<Button type="submit" variant="primary">
					Create Character
				</Button>
			</Stack>
		</Form>
	);
};
