import React, { useState } from 'react';
import {
	Form,
	Button,
	Stack,
	Alert,
	Row,
	Col,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CharacterSchema, Character, CharacterStats } from '@/schemas/character';
import { useCharacterStore } from '@/stores/character-store';
import { generateRandomCharacter } from '@/utils/character-generator';
import { LuDices } from 'react-icons/lu';

type CharacterFormData = Omit<Character, 'id'>;

const CLASSES = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin'];
const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Half-Elf'];
const BASE_STAT = 8;
const MAX_POINTS = 10;

interface CreateCharacterProps {
	onComplete?: () => void;
}

const STAT_DESCRIPTIONS = {
	strength: 'Physical power, melee attacks, and carrying capacity',
	dexterity: 'Agility, ranged attacks, and reflexes',
	constitution: 'Endurance, health points, and resistance',
	intelligence: 'Knowledge, arcane magic, and investigation',
	wisdom: 'Perception, divine magic, and insight',
	charisma: 'Social influence, leadership, and force of personality',
};

const getModifier = (value: number): number => Math.floor((value - 10) / 2);

const formatModifier = (mod: number): string => {
	if (mod > 0) return `(+${mod})`;
	return `(${mod})`;
};

export const CreateCharacter: React.FC<CreateCharacterProps> = ({ onComplete }) => {
	const { createCharacter } = useCharacterStore();
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [stats, setStats] = useState<CharacterStats>({
		strength: BASE_STAT,
		dexterity: BASE_STAT,
		constitution: BASE_STAT,
		intelligence: BASE_STAT,
		wisdom: BASE_STAT,
		charisma: BASE_STAT,
	});
	const [remainingPoints, setRemainingPoints] = useState(MAX_POINTS);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isValid },
	} = useForm<CharacterFormData>({
		resolver: zodResolver(CharacterSchema.omit({ id: true })),
		mode: 'onChange',
		defaultValues: {
			type: 'player',
			controlType: 'user',
			hp: 10,
			maxHp: 10,
			level: 1,
			position: { x: 0, y: 0 },
			stats: {
				strength: BASE_STAT,
				dexterity: BASE_STAT,
				constitution: BASE_STAT,
				intelligence: BASE_STAT,
				wisdom: BASE_STAT,
				charisma: BASE_STAT,
			},
		},
	});

	const handleStatChange = (stat: keyof CharacterStats, value: number) => {
		const oldValue = stats[stat];
		const pointDiff = value - oldValue;

		if (remainingPoints - pointDiff < 0 || remainingPoints - pointDiff > MAX_POINTS) {
			return;
		}

		if (value < BASE_STAT || value > BASE_STAT + MAX_POINTS) {
			return;
		}

		const newStats = {
			...stats,
			[stat]: value,
		};

		setStats(newStats);
		setValue('stats', newStats, { shouldValidate: true });
		setRemainingPoints(prev => prev - pointDiff);
	};

	const onSubmit = (data: CharacterFormData) => {
		createCharacter(data);
		setShowSuccess(true);
		setTimeout(() => {
			setShowSuccess(false);
			reset();
			setStats({
				strength: BASE_STAT,
				dexterity: BASE_STAT,
				constitution: BASE_STAT,
				intelligence: BASE_STAT,
				wisdom: BASE_STAT,
				charisma: BASE_STAT,
			});
			setRemainingPoints(MAX_POINTS);
			onComplete?.();
		}, 2000);
	};

	const handleRandomize = () => {
		const race = RACES[Math.floor(Math.random() * RACES.length)];
		const characterClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
		const { name, stats: randomStats } = generateRandomCharacter(race, characterClass);

		setValue('name', name);
		setValue('race', race);
		setValue('class', characterClass);
		setValue('stats', randomStats);
		setValue('gender', Math.random() < 0.5 ? 'male' : 'female');
		setStats(randomStats);
		setRemainingPoints(0);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap={3}>
				<div className="d-flex justify-content-end">
					<Button
						variant="outline-secondary"
						size="sm"
						onClick={handleRandomize}
						title="Generate Random Character"
					>
						<LuDices className="me-2" />
						Randomize
					</Button>
				</div>

				{showSuccess && (
					<Alert variant="success">
						Character created successfully!
					</Alert>
				)}

				<Row>
					<Col>
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
					</Col>
					<Col md={3}>
						<Form.Group>
							<Form.Label>Gender</Form.Label>
							<Form.Select {...register('gender')} isInvalid={!!errors.gender} required>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</Form.Select>
							{errors.gender && (
								<Form.Control.Feedback type="invalid">
									{errors.gender.message}
								</Form.Control.Feedback>
							)}
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Race</Form.Label>
							<Form.Select {...register('race')} isInvalid={!!errors.race} required>
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
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Class</Form.Label>
							<Form.Select {...register('class')} isInvalid={!!errors.class} required>
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
					</Col>
				</Row>

				<div>
					<div className="d-flex justify-content-between align-items-center mb-3">
						<Form.Label className="mb-0">Ability Scores</Form.Label>
						<small className="text-muted">
							Points Remaining: {remainingPoints}
						</small>
					</div>
					<Row xs={1} md={2} className="g-3">
						{(Object.keys(stats) as Array<keyof CharacterStats>).map((stat) => (
							<Col key={stat}>
								<Form.Group>
									<Form.Label>
										<div className="d-flex justify-content-between">
											<span className="text-capitalize">
												{stat} {formatModifier(getModifier(stats[stat]))}
											</span>
										</div>
										<small className="text-muted d-block">
											{STAT_DESCRIPTIONS[stat]}
										</small>
									</Form.Label>
									<Form.Control
										type="number"
										value={stats[stat]}
										onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
										min={BASE_STAT}
										max={BASE_STAT + MAX_POINTS}
									/>
								</Form.Group>
							</Col>
						))}
					</Row>
				</div>

				<Button
					type="submit"
					variant="primary"
					disabled={remainingPoints > 0}
					onClick={() => {
						console.log('Submitting form');
						if (!isValid) {
							console.log('Form validation failed:', Object.entries(errors).map(([field, error]) => `${field}: ${error?.message}`).join(', '));
						}
					}}
				>
					Create Character
				</Button>
			</Stack>
		</Form>
	);
};
