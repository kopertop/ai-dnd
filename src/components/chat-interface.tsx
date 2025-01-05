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

export const AIChatInterface: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { currentCampaign, updateCampaign } = useGameStore();
	const { getCharactersByIds } = useCharacterStore();

	// Get the user's active character
	const userCharacterId = currentCampaign ?
		Object.entries(currentCampaign.characters)
			.find(([_, type]) => type === 'user')?.[0]
		: undefined;

	const allCharacters = getCharactersByIds(Object.keys(currentCampaign?.characters || {})).map((c) => ({
		...c,
		control: currentCampaign?.characters[c.id],
	}));
	const userCharacter = allCharacters.find(c => c.id === userCharacterId);

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
		initialMessages: currentCampaign?.messages?.length ? currentCampaign.messages : [{
			id: 'system-1',
			role: 'system',
			content: getDMPrompt(allCharacters),
		}],
		onResponse: (response) => {
			if (!response.ok) {
				throw new Error('Failed to send message');
			}
		},
		onFinish: (currentMessage) => {
			console.log('onFinish', {
				currentMessage,
				currentCampaign,
				messages,
			});
		},
		body: {
			characterName: userCharacter?.name,
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
	}, [currentCampaign]);

	useEffect(() => {
		console.log('messages', messages);
		if (currentCampaign?.id && messages?.length) {
			console.log('Updating campaign with new messages', messages);
			updateCampaign(currentCampaign.id, {
				messages,
			});
		}
	}, [messages]);

	return (
		<Card
			className={`shadow-sm h-100 d-flex flex-column ${isExpanded ? 'position-fixed top-0 start-0 w-100 h-100 z-3' : ''}`}
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
										{msg.content}
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
							content: getDMPrompt(allCharacters),
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
