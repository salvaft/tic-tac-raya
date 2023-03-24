import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';

const match = (param: string | undefined) => {
	if (param) return /^[0-5]$/.test(param);
};

export const load: PageServerLoad = async ({ locals, url }) => {
	console.log(`load function en ${url.pathname}`);

	if (!match(url.pathname.split('/').at(-1))) {
		throw error(404, {
			message: 'Room Not found'
		});
	}
	const id = (await locals?.getSession())?.user.id;

	return { id, path: url.pathname };
};
