import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	preview: {
		port: 5173,
		host: '0.0.0.0'
	},
	plugins: [sveltekit()]
});
