import { W as WINNER_COMBOS, T as TURNS } from "../../../../chunks/consts.js";
import { e as error } from "../../../../chunks/index.js";
import { EventEmitter } from "node:events";
const checkWinner = (board, turn) => {
  return WINNER_COMBOS.some((combo) => {
    return combo.every((pos) => {
      return board[pos] === turn;
    });
  });
};
const checkDraw = (movements, winner) => {
  return movements === 9 && !winner;
};
const turns = [TURNS.O, TURNS.X];
function restartGame(game) {
  const { board, turn, movements, winner, empate } = initBoard();
  game.board = board;
  game.turn = turn;
  game.movements = movements;
  game.winner = winner;
  game.empate = empate;
}
function initBoard() {
  const board = Array(9).fill("");
  const turn = turns[Math.floor(Math.random() * turns.length)];
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
function initGame() {
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
function initRoom(slots2, room) {
  const game = initGame();
  const bus = new EventEmitter();
  slots2.set(room, { bus, game });
  return { bus, game };
}
function addPlayer(game, id) {
  if (game.full)
    return;
  if (!game.p1)
    game.p1 = id;
  else if (!game.p2)
    game.p2 = id;
}
function createStream(room, id, slots2) {
  const { readable, writable } = new TransformStream({
    start(controller) {
      const { game = null } = slots2.get(room) || {};
      if (game) {
        const data = JSON.stringify(game);
        controller.enqueue(`data: ${data}

`);
      }
    },
    transform({ data }, controller) {
      if (data) {
        controller.enqueue(`data: ${data}

`);
      }
    }
  });
  const writer = writable.getWriter();
  console.log("stream created for id ", id);
  async function subscribe(eventEmitter, event) {
    function listener(data) {
      writer.write({ data });
    }
    eventEmitter.on(event, listener);
    await writer.closed.catch(() => {
      console.log("stream closed for id", id);
      eventEmitter.off(event, listener);
      const { game = null } = slots2.get(room) || {};
      if (room && game) {
        if (game.p1 === id)
          game.p1 = null;
        if (game.p2 === id)
          game.p2 = null;
        console.log("Some player left", "player1:", game.p1, "player2", game.p2);
        if (!game.p1 && !game.p2) {
          slots2.delete(room);
          console.log("Room deleted");
        }
      }
    });
  }
  return { readable, subscribe };
}
const slots = /* @__PURE__ */ new Map();
const GET = async ({ locals, url }) => {
  const room = url.searchParams.get("room");
  const id = (await locals.getSession())?.user.id;
  let { bus = null, game = null } = slots.get(room) || {};
  if (game?.full)
    throw error(405, { message: "Room is full" });
  if (game?.p1 === id || game?.p2 === id)
    throw error(401, { message: "You are already playing" });
  if (!game || !bus) {
    console.log("Initializing Room");
    ({ game, bus } = initRoom(slots, room));
  }
  addPlayer(game, id);
  console.log("player1:", game.p1, "player2", game.p2);
  const { readable, subscribe } = createStream(room, id, slots);
  subscribe(bus, "movement");
  return new Response(readable, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache"
    }
  });
};
const POST = async ({ request, url }) => {
  const room = url.searchParams.get("room");
  const { bus, game } = slots.get(room);
  const data = await request.json();
  const { idx } = data;
  game.board[idx] = game.turn;
  game.movements++;
  game.winner = checkWinner(game.board, game.turn);
  game.empate = checkDraw(game.movements, game.winner);
  if (!game.empate && !game.winner) {
    game.turn = game.turn === TURNS.X ? TURNS.O : TURNS.X;
  }
  bus.emit("movement", JSON.stringify(game));
  return new Response(null, { status: 200 });
};
const DELETE = async ({ url }) => {
  const room = url.searchParams.get("room");
  const { game, bus } = slots.get(room);
  restartGame(game);
  bus.emit("movement", JSON.stringify(game));
  return new Response(null, { status: 200 });
};
export {
  DELETE,
  GET,
  POST
};
