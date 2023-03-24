export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.5575d1ce.js","imports":["_app/immutable/entry/start.5575d1ce.js","_app/immutable/chunks/index.9a67abef.js","_app/immutable/chunks/singletons.dad688bc.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.6241f545.js","imports":["_app/immutable/entry/app.6241f545.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/index.9a67abef.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: "/game/api",
				pattern: /^\/game\/api\/?$/,
				params: [],
				page: null,
				endpoint: () => import('./entries/endpoints/game/api/_server.ts.js')
			},
			{
				id: "/game/[room]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"room","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
