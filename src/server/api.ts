import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleChat } from './ai';
import { generateThematicItems } from './items';

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

api.post('/api/generate-items', async (c) => {
	try {
		const { scenario } = await c.req.json();
		const items = await generateThematicItems(scenario);
		return c.json({ items });
	} catch (error: any) {
		return c.json({ error: error.message }, 500);
	}
});

export default api;
