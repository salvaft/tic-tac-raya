import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Provider } from '@auth/core/providers';

const authorization = (async ({ event, resolve }) => {
	// Protect any routes under /authenticated
	if (event.url.pathname.startsWith('/game')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
}) satisfies Handle;

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
// export const handle: Handle = authorization;
export const handle: Handle = sequence(
	SvelteKitAuth({
		trustHost: true,
		secret: AUTH_SECRET,
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })] as Provider[]
	}),
	authorization
);
