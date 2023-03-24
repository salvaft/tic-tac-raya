// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';
import { TURNS } from '$lib/consts';
import type EventEmitter from 'events';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		// interface PageData {}
		// interface Platform {}
	}
	interface IGame {
		board: string[];
		turn: TURN;
		movements: number;
		winner: boolean;
		empate: boolean;
		p1: null | string;
		p1turn: TURN;
		p2: null | string;
		p2turn: TURN;
		readonly full: boolean;
	}
	interface IRoom {
		game: IGame;
		bus: EventEmitter;
	}
	type keys = keyof typeof TURNS;
	type TURN = (typeof TURNS)[keys];
}

export {};
