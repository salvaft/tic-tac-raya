import { e as error } from "../../../../chunks/index.js";
const match = (param) => {
  if (param)
    return /^[0-5]$/.test(param);
};
const load = async ({ locals, url }) => {
  console.log(`load function en ${url.pathname}`);
  if (!match(url.pathname.split("/").at(-1))) {
    throw error(404, {
      message: "Room Not found"
    });
  }
  const id = (await locals?.getSession())?.user.id;
  return { id, path: url.pathname };
};
export {
  load
};
