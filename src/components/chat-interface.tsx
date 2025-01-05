import React, { useState, useRef, useEffect } from 'react';
import {
	Card,
	Form,
	Button,
	Stack,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { GameMessageSchema } from '@/schemas/game';

export const ChatInterface: React.FC = () => {
	const [input, setInput] = useState('');
	const { messages, sendMessage } = useGameStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = () => {
		if (input.trim()) {
			try {
				sendMessage(input);
				setInput('');
			} catch (error) {
				console.error('Failed to send message:', error);
			}
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<Card className="shadow-sm h-100">
			<Card.Body className="d-flex flex-column">
				<Stack gap={3} className="h-100">
					<div
						className="bg-light p-3 rounded flex-grow-1"
						style={{
							minHeight: '300px',
							maxHeight: '500px',
							overflowY: 'auto',
						}}
					>
						{messages.map((msg) => {
							try {
								GameMessageSchema.parse(msg);
								const messageClass = msg.type === 'system'
									? 'text-muted'
									: msg.type === 'dm'
										? 'text-danger'
										: 'text-dark';

								return (
									<p key={msg.id} className={`mb-2 ${messageClass}`}>
										<strong>{msg.sender}:</strong> {msg.content}
									</p>
								);
							} catch (error) {
								console.error('Invalid message format:', error);
								return null;
							}
						})}
						<div ref={messagesEndRef} />
					</div>

					<Form.Group>
						<Form.Control
							as="textarea"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Describe your action..."
							rows={2}
						/>
					</Form.Group>

					<Button onClick={handleSend} variant="primary">
						Send
					</Button>
				</Stack>
			</Card.Body>
		</Card>
	);
};
