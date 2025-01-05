import React from 'react';
import {
	Stack,
	Form,
	Button,
	Card,
	Spinner,
} from 'react-bootstrap';
import { useChat } from 'ai/react';
import { useGameStore } from '@/stores/game-store';
import { LuSend } from 'react-icons/lu';

export const AIChatInterface: React.FC = () => {
	const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
		api: '/api/chat',
		initialMessages: [{
			id: 'system-1',
			role: 'system',
			content: 'You are a Dungeon Master in a D&D game. Respond in character, making the game engaging and fun.',
		}],
	});

	const { currentCampaign } = useGameStore();

	return (
		<Card className="shadow-sm h-100">
			<Card.Header className="bg-dark text-white">
				<h5 className="mb-0">Game Chat</h5>
			</Card.Header>
			<Card.Body className="d-flex flex-column p-0">
				<div className="flex-grow-1 overflow-auto p-3">
					<Stack gap={2}>
						{messages.map((msg) => (
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
										{msg.role === 'assistant' ? 'DM' : 'You'}
									</div>
									{msg.content}
								</div>
							</div>
						))}
						{isLoading && (
							<div className="d-flex align-items-center gap-2 text-muted">
								<Spinner size="sm" />
								<span>DM is typing...</span>
							</div>
						)}
					</Stack>
				</div>
				<Form onSubmit={handleSubmit} className="border-top p-3">
					<div className="d-flex gap-2">
						<Form.Control
							value={input}
							onChange={handleInputChange}
							placeholder="Type your message..."
							disabled={isLoading || !currentCampaign}
						/>
						<Button
							type="submit"
							disabled={isLoading || !input.trim() || !currentCampaign}
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
				</Form>
			</Card.Body>
		</Card>
	);
};
