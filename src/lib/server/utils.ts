import { TURNS } from '$lib/consts';
import { EventEmitter } from 'node:events';
const turns = [TURNS.O, TURNS.X];

export function restartGame(game: IGame) {
	const { board, turn, movements, winner, empate } = initBoard();
	game.board = board;
	game.turn = turn;
	game.movements = movements;
	game.winner = winner;
	game.empate = empate;
}

export function initBoard() {
	const board: string[] = Array(9).fill('');
	const turn: TURN = turns[Math.floor(Math.random() * turns.length)];
	const movements = 0;
	const winner = false;
	const empate = false;
	return {
		board,
		turn,
		movements,
		winner,
		empate
	};
}

export function initGame(): IGame {
	const p1 = null;
	const p1turn = turns[Math.floor(Math.random() * turns.length)];
	const p2 = null;
	const p2turn = p1turn === TURNS.O ? TURNS.X : TURNS.O;
	const { board, turn, movements, winner, empate } = initBoard();
	return {
		board,
		turn,
		movements,
		winner,
		empate,
		p1,
		p1turn,
		p2,
		p2turn,
		get full() {
			return !!this.p1 && !!this.p2;
		}
	};
}

export function initRoom(slots: Map<string, IRoom>, room: string) {
	const game = initGame();
	const bus = new EventEmitter();
	slots.set(room, { bus, game });
	return { bus, game };
}

export function addPlayer(game: IGame, id: string) {
	if (game.full) return;
	if (!game.p1) game.p1 = id;
	else if (!game.p2) game.p2 = id;
}

export function createStream(room: string, id: string, slots: Map<string, IRoom>) {
	const { readable, writable } = new TransformStream({
		start(controller) {
			const { game = null } = slots.get(room) || {};
			if (game) {
				const data = JSON.stringify(game);
				controller.enqueue(`data: ${data}\n\n`);
			}
		},
		transform({ data }, controller) {
			if (data) {
				controller.enqueue(`data: ${data}\n\n`);
			}
		}
	});

	const writer = writable.getWriter();
	console.log('stream created for id ', id);

	async function subscribe(eventEmitter: EventEmitter, event: string) {
		function listener(data: string) {
			writer.write({ data });
		}
		eventEmitter.on(event, listener);
		await writer.closed.catch(() => {
			console.log('stream closed for id', id);
			eventEmitter.off(event, listener);
			const { game = null } = slots.get(room) || {};

			if (room && game) {
				if (game.p1 === id) game.p1 = null;
				if (game.p2 === id) game.p2 = null;
				console.log('Some player left', 'player1:', game.p1, 'player2', game.p2);

				if (!game.p1 && !game.p2) {
					slots.delete(room);
					console.log('Room deleted');
				}
			}
		});
	}
	return { readable, subscribe };
}
