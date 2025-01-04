import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	Input,
	Button,
	VStack,
	Text,
} from '@chakra-ui/react';
import { useGameStore } from '../stores/game-store';
import { GameMessageSchema } from '../schemas/game';

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

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
			<VStack gap={4} alignItems="stretch">
				<Box height="300px" overflowY="auto" p={2}>
					{messages.map((msg) => {
						try {
							GameMessageSchema.parse(msg);
							return (
								<Text
									key={msg.id}
									color={msg.type === 'system' ? 'gray.500' :
										msg.type === 'dm' ? 'red.500' :
											'black'}
								>
									<strong>{msg.sender}:</strong> {msg.content}
								</Text>
							);
						} catch (error) {
							console.error('Invalid message format:', error);
							return null;
						}
					})}
					<div ref={messagesEndRef} />
				</Box>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Describe your action..."
					size="lg"
				/>
				<Button onClick={handleSend} colorScheme="blue">
					Send
				</Button>
			</VStack>
		</Box>
	);
};
