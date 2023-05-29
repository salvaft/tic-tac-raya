import type { RequestHandler } from './$types';
import { TURNS } from '$lib/consts';
import { checkDraw, checkWinner } from '$lib/server/logic';
import { error } from '@sveltejs/kit';
import { addPlayer, restartGame, initRoom, createStream } from '$lib/server/utils';
import { slots } from '$lib/server/db';

export const GET = (async ({ locals, url }) => {
	const room = url.searchParams.get('room') as string;
	const session = await locals.getSession();

	const id = session?.user?.email as string;

	let { bus = null, game = null } = slots.get(room) || {};

	if (game?.full) throw error(405, { message: 'Room is full' });
	if (game?.p1 === id || game?.p2 === id) throw error(401, { message: 'You are already playing' });

	if (!game || !bus) {
		console.log('Initializing Room');
		({ game, bus } = initRoom(slots, room));
	}

	addPlayer(game, id);
	console.log('player1:', game.p1, 'player2', game.p2);

	const { readable, subscribe } = createStream(room, id, slots);
	subscribe(bus, 'movement');

	return new Response(readable, {
		headers: {
			'content-type': 'text/event-stream',
			'cache-control': 'no-cache'
		}
	});
}) satisfies RequestHandler;

export const POST: RequestHandler = async ({ request, url }) => {
	const room = url.searchParams.get('room') as string;

	const { bus, game } = slots.get(room) as IRoom;

	const data = await request.json();
	const { idx } = data;
	game.board[idx] = game.turn;

	game.movements++;
	game.winner = checkWinner(game.board, game.turn);
	game.empate = checkDraw(game.movements, game.winner);

	if (!game.empate && !game.winner) {
		game.turn = game.turn === TURNS.X ? TURNS.O : TURNS.X;
	}

	bus.emit('movement', JSON.stringify(game));

	return new Response(null, { status: 200 });
};

export const DELETE = (async ({ url }) => {
	const room = url.searchParams.get('room') as string;
	const { game, bus } = slots.get(room) as IRoom;
	restartGame(game);
	bus.emit('movement', JSON.stringify(game));
	return new Response(null, { status: 200 });
}) satisfies RequestHandler;
