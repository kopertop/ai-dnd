import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleChat } from './ai';

type Bindings = {
	// Add any bindings here if needed
};

const api = new Hono<{ Bindings: Bindings }>();

api.use('*', cors());

api.post('/api/chat', async (c) => {
	try {
		const { messages } = await c.req.json();
		const response = await handleChat(messages);
		return c.json(response);
	} catch (error: any) {
		return c.json({ error: error.message }, 500);
	}
});

export default api;
