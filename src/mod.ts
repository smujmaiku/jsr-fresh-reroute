/** Fresh-ish App */
interface App {
	handler: () => (req: Request) => Promise<Response>;
}

/** Fresh-ish Context */
interface Context {
	req: Request;
	next: () => Promise<Response> | Response;
}

type CallbackRes = string | Response;

export type Callback = (
	ctx: Context,
) => Promise<CallbackRes> | CallbackRes;

export interface Opts {
	trailingSlash?: boolean;
}

/** Enforce and fix trailing slash on a path */
export function fixTrailingSlash(
	pathname: string,
	opt: undefined | boolean = undefined,
): string {
	if (typeof opt !== 'boolean') return pathname;

	pathname = pathname.replace(/\/+$/, '');
	if (opt === false) return pathname;

	return `${pathname}/`;
}

/** Reroute a path back through a fresh app
 * @example
 * // /origin/[...path].ts
 * export const handler = freshReroute(app, async (ctx) => '/target');
 * @example
 * app.use('/origin/[...path]', freshReroute(app, async (ctx) => '/target'));
 */
export function freshReroute<A extends App, C extends Context>(
	app: A,
	cb: Callback,
	opts?: Opts,
): (ctx: C) => Promise<Response> {
	return async (ctx: C): Promise<Response> => {
		const pathname = await cb(ctx);
		if (pathname instanceof Response) return pathname;

		const url = new URL(ctx.req.url);
		url.pathname = fixTrailingSlash(pathname, opts?.trailingSlash);

		return app.handler()(new Request(url, ctx.req));
	};
}

export default freshReroute;
