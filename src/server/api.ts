import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleChat } from './ai';

const api = new Hono();

api.use('*', cors());

api.post('/api/chat', async (c) => {
	try {
		const { messages } = await c.req.json();
		return handleChat(messages);
	} catch (error: any) {
		return c.json({ error: error.message }, 500);
	}
});

export default api;
