import React, { useEffect, useState } from 'react';
import {
	Stack,
	Form,
	Button,
	Card,
	Spinner,
} from 'react-bootstrap';
import { useChat } from 'ai/react';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { LuSend, LuExpand, LuShrink } from 'react-icons/lu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDMPrompt } from '@/prompts/dm';
import { handleChatAction, ChatAction } from '@/utils/chat-actions';
import { Character } from '@/schemas/character';
import { Campaign } from '@/schemas/campaign';
import { replaceActions } from '@/utils/replace-actions';

const AIChatComponent: React.FC<{
	currentCampaign: Campaign;
	userCharacter: Character | null;
	allCharacters: Character[];
}> = ({ currentCampaign, userCharacter, allCharacters }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { updateCampaign } = useGameStore();
	const { updateCharacter } = useCharacterStore();
	const [incompleteAction, setIncompleteAction] = useState<string | null>(null);

	const {
		append,
		messages,
		setMessages,
		input,
		setInput,
		handleInputChange,
		handleSubmit,
		isLoading,
		error,
	} = useChat({
		api: '/api/chat',
		onResponse: (response) => {
			if (!response.ok) {
				throw new Error('Failed to send message');
			}
		},
		onFinish: (message) => {
			// Check if we have an incomplete action from previous message
			let messageContent = message.content;
			if (incompleteAction) {
				messageContent = incompleteAction + messageContent;
				setIncompleteAction(null);
			}

			// Check if this message ends with an incomplete action
			if (messageContent.includes('[') &&
				(messageContent.split('[').length > messageContent.split(']').length)) {
				setIncompleteAction(messageContent);
				return; // Wait for the complete message
			}

			const newMessages = [...messages, { ...message, content: messageContent }];

			// Scan for actions in the complete message
			if (messageContent.includes('[') && messageContent.includes(']')) {
				console.log('Message content:', messageContent);
				const actionPattern = /\[([^\]]+)\]([^[\]]+)\[\/\1\]/g;
				const matches = Array.from(messageContent.matchAll(actionPattern));

				console.log('Found matches:', matches);

				for (const match of matches) {
					const [fullMatch, type, value] = match;
					console.log('Processing action:', { fullMatch, type, value });

					// Split value and clean up any whitespace
					const [targetId, amount] = value.split(',').map(s => s.trim());

					handleChatAction(
						{
							type: type as ChatAction['type'],
							targetId,
							value: amount ? Number(amount) : undefined,
						},
						currentCampaign!,
							allCharacters,
							updateCampaign,
							updateCharacter,
					);
				}
			}

			// Update campaign messages
			if (currentCampaign?.id) {
				setTimeout(() => {
					updateCampaign(currentCampaign.id, {
						messages: newMessages,
					});
				}, 0);
			}
		},
		body: {
			characterName: userCharacter?.name,
			characters: allCharacters,
			inventory: currentCampaign?.inventory,
			stream: true,
			maxTokens: 2000,
		},
	});

	useEffect(() => {
		if (!currentCampaign?.messages?.filter(msg => msg.role !== 'system').length) {
			console.log('No messages found, starting new campaign');
			append({
				role: 'user',
				content: '_enters the game_',
			});
		}
	}, [currentCampaign, append]);

	if (!currentCampaign) {
		return <div>No campaign found</div>;
	}

	if (!userCharacter) {
		return <div>No user character found</div>;
	}

	return (
		<Card
			className={`p-0 shadow-sm h-100 d-flex flex-column ${isExpanded ? 'position-fixed top-0 start-0 w-100 h-100 z-3' : ''}`}
			style={{
				marginTop: isExpanded ? 75 : 0,
				maxHeight: window.innerHeight - 100,
				transition: 'all 0.3s ease',
			}}
		>
			<Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
				<h5 className="mb-0">Game Chat</h5>
				<Button
					variant="link"
					className="text-white p-0"
					onClick={() => setIsExpanded(!isExpanded)}
					title={isExpanded ? 'Collapse' : 'Expand'}
				>
					{isExpanded ? <LuShrink size={20} /> : <LuExpand size={20} />}
				</Button>
			</Card.Header>
			<Card.Body className="p-0 flex-grow-1 d-flex flex-column overflow-hidden">
				<div className="flex-grow-1 overflow-y-auto p-3" style={{ minHeight: 0 }}>
					<Stack gap={2}>
						{messages.filter(msg => msg.role !== 'system').map((msg) => (
							<div
								key={msg.id}
								className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : ''}`}
							>
								<div
									className={`
										p-2 rounded-3
										${msg.role === 'system' ? 'bg-light text-muted' : ''}
										${msg.role === 'user' ? 'bg-primary text-white' : ''}
										${msg.role === 'assistant' ? 'bg-secondary text-white' : ''}
									`}
									style={{ maxWidth: '75%' }}
								>
									<div className="small text-opacity-75 mb-1">
										{msg.role === 'assistant' ? 'DM' : userCharacter?.name || 'You'}
									</div>
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										className="markdown-content"
										components={{
											p: ({ children }) => <p className="mb-2">{children}</p>,
											blockquote: ({ children }) => (
												<blockquote className="border-start border-2 ps-3 my-2 text-italic">
													{children}
												</blockquote>
											),
										}}
									>
										{replaceActions(msg.content)}
									</ReactMarkdown>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="d-flex align-items-center gap-2 text-muted">
								<Spinner size="sm" />
								<span>DM is typing...</span>
							</div>
						)}
						{error && (
							<div className="text-danger small p-2">
								Error: {error.message}
							</div>
						)}
					</Stack>
				</div>
				<Form onSubmit={(e) => {
					e.preventDefault();
					if (input?.trim().toLowerCase() === '/reset' && currentCampaign?.id) {
						setMessages([]);
						setInput('');
						append({
							role: 'system',
							content: getDMPrompt({
								campaign: currentCampaign,
								characters: allCharacters,
								inventory: currentCampaign.inventory || [],
							}),
						});
					} else {
						handleSubmit(e);
					}
				}} className="border-top p-3">
					<div className="d-flex gap-2">
						<Form.Control
							value={input}
							onChange={handleInputChange}
							placeholder={userCharacter ? `Speak as ${userCharacter.name}...` : 'Type your message...'}
							disabled={isLoading || !currentCampaign || !userCharacter}
						/>
						<Button
							type="submit"
							disabled={isLoading || !input.trim() || !currentCampaign || !userCharacter}
							variant="primary"
						>
							<LuSend />
						</Button>
					</div>
					{!currentCampaign && (
						<small className="text-muted mt-2 d-block">
							Load a campaign to start chatting with the DM
						</small>
					)}
					{currentCampaign && !userCharacter && (
						<small className="text-muted mt-2 d-block">
							Add a player character to the campaign to start chatting
						</small>
					)}
				</Form>
			</Card.Body>
		</Card>
	);
};

export const AIChatInterface: React.FC = () => {
	const { currentCampaign } = useGameStore();
	const { getCharactersByIds } = useCharacterStore();
	const [userCharacter, setUserCharacter] = useState<Character | null>(null);
	const [allCharacters, setAllCharacters] = useState<Character[]>([]);

	// Get the user's active character
	useEffect(() => {
		if (!currentCampaign) return;
		const userCharacterId = Object.entries(currentCampaign.characters).find(([, type]) => type === 'user')?.[0]

		const currentCharacters = getCharactersByIds(Object.keys(currentCampaign.characters || {})).map((c) => ({
			...c,
			control: currentCampaign?.characters[c.id],
		}));
		setAllCharacters(currentCharacters);
		setUserCharacter(currentCharacters.find(c => c.id === userCharacterId) || null);
	}, [currentCampaign, getCharactersByIds]);

	if (!currentCampaign) {
		return <div>No campaign found</div>;
	}

	if (!userCharacter) {
		return <div>No user character found</div>;
	}


	return <AIChatComponent
		currentCampaign={currentCampaign}
		userCharacter={userCharacter}
		allCharacters={allCharacters}
	/>
}
