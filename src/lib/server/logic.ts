import { WINNER_COMBOS } from '../consts';

export const checkWinner = (board: string[], turn: TURN) => {
	return WINNER_COMBOS.some((combo) => {
		return combo.every((pos) => {
			return board[pos] === turn;
		});
	});
};

export const checkDraw = (movements: number, winner: boolean) => {
	return movements === 9 && !winner;
};
