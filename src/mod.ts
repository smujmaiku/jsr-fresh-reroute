/** Fresh-ish App */
interface App {
	handler: () => (req: Request) => Promise<Response>;
}

/** Fresh-ish Context */
interface Context<S> {
	req: Request;
	state: S;
	params: Record<string, string>;
	next: () => Promise<Response> | Response;
}

type CallbackRes = string | Response;

export type Callback<S> = (
	ctx: Context<S>,
) => Promise<CallbackRes> | CallbackRes;

export function reroute<S, A extends App, C extends Context<S>>(
	app: A,
	cb: Callback<S>,
): (ctx: C) => Promise<Response> {
	return async (ctx: C): Promise<Response> => {
		const pathname = await cb(ctx);
		if (pathname instanceof Response) return pathname;

		const url = new URL(ctx.req.url);
		url.pathname = pathname;

		return app.handler()(new Request(url, ctx.req));
	};
}

export default reroute;
