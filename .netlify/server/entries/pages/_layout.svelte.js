import { c as create_ssr_component, e as escape } from "../../chunks/index2.js";
const app = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "a.svelte-k9ribt{margin:0.7rem 1rem}nav.svelte-k9ribt{display:flex;justify-content:space-around;align-items:center}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<nav class="svelte-k9ribt"><a href="/" class="svelte-k9ribt">Home</a>
	${!data.session ? `<button>Login</button>` : `<p>Hello ${escape(data.session.user.email)}</p>
		<button>Logout</button>`}</nav>
${``}
${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
