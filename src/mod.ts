/** Fresh-ish App */
interface App<S = unknown> {
	handler: () => (req: Request) => Promise<Response>;
	use?: (
		...middleware: ((ctx: { state: S }) => Response | Promise<Response>)[]
	) => unknown;
}

/** Fresh-ish Context */
interface Context<
	S = unknown,
	P extends Record<string, string> = Record<string, string>,
> {
	req: Request;
	state: S;
	params: P;
	next: () => Promise<Response> | Response;
}

type CallbackRes = string | Response;

export type Callback<
	S = unknown,
	P extends Record<string, string> = Record<string, string>,
> = (
	ctx: Context<S, P>,
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
export function freshReroute<
	S = unknown,
	P extends Record<string, string> = Record<string, string>,
>(
	app: App<S>,
	cb: Callback<S, P>,
	opts?: Opts,
): (ctx: Context<S, P>) => Promise<Response> {
	return async (ctx: Context<S, P>): Promise<Response> => {
		const pathname = await cb(ctx);
		if (pathname instanceof Response) return pathname;

		const url = new URL(ctx.req.url);
		url.pathname = fixTrailingSlash(pathname, opts?.trailingSlash);

		return app.handler()(new Request(url, ctx.req));
	};
}

export default freshReroute;
