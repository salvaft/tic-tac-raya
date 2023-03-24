import { c as create_ssr_component, b as subscribe, d as each, f as add_attribute, e as escape } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "h1.svelte-so9sd2,p.svelte-so9sd2{margin-inline:auto}section.svelte-so9sd2{display:flex}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const rooms = [
    { href: "/game/1", name: "Room 1" },
    { href: "/game/2", name: "Room 2" },
    { href: "/game/3", name: "Room 3" },
    { href: "/game/4", name: "Room 4" },
    { href: "/game/5", name: "Room 5" }
  ];
  $$result.css.add(css);
  $$unsubscribe_page();
  return `<h1 class="svelte-so9sd2">Welcome to Tres en Raya</h1>
${!$page.data.session ? `<p class="svelte-so9sd2">Login to play!</p>` : `<p class="svelte-so9sd2">Select a room</p>
	<section class="svelte-so9sd2">${each(rooms, (room) => {
    return `<a${add_attribute("href", room.href, 0)}>${escape(room.name)}</a>`;
  })}</section>`}`;
});
export {
  Page as default
};
