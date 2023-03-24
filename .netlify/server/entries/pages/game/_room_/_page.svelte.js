import { c as create_ssr_component, b as subscribe, e as escape, d as each, v as validate_component } from "../../../../chunks/index2.js";
import "canvas-confetti";
import { T as TURNS } from "../../../../chunks/consts.js";
import { p as page } from "../../../../chunks/stores.js";
const Square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { idx = 0 } = $$props;
  let { updateGame = (number) => {
  } } = $$props;
  let { isSelected = false } = $$props;
  if ($$props.idx === void 0 && $$bindings.idx && idx !== void 0)
    $$bindings.idx(idx);
  if ($$props.updateGame === void 0 && $$bindings.updateGame && updateGame !== void 0)
    $$bindings.updateGame(updateGame);
  if ($$props.isSelected === void 0 && $$bindings.isSelected && isSelected !== void 0)
    $$bindings.isSelected(isSelected);
  return `<div class="${["square", isSelected ? "is-selected" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  let board = Array(9).fill("");
  data.id;
  let turn;
  let waiting = true;
  String($page.url).split("/").at(-1);
  async function updateGame(idx) {
    if (board[idx] !== "")
      return;
    return;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_page();
  return `<pre>${escape(JSON.stringify(
    {
      playerId: data?.id?.split("-")[0],
      team: "Not Asigned",
      mode: "Espectador",
      waiting
    },
    null,
    " "
  ))}
	</pre>
${`<p>Waiting for Player 2</p>`}
<main class="board"><h1>Tres en raya</h1>
	<section class="game">${each(board, (cell, idx) => {
    return `${validate_component(Square, "Square").$$render($$result, { idx, updateGame }, {}, {
      default: () => {
        return `${escape(cell)}
			`;
      }
    })}`;
  })}</section>
	<section class="turn">${validate_component(Square, "Square").$$render($$result, { isSelected: turn === TURNS.X }, {}, {
    default: () => {
      return `${escape(TURNS.X)}`;
    }
  })}
		${validate_component(Square, "Square").$$render($$result, { isSelected: turn === TURNS.O }, {}, {
    default: () => {
      return `${escape(TURNS.O)}`;
    }
  })}</section>
	<button>Reset</button>
	${``}</main>`;
});
export {
  Page as default
};
