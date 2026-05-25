# Fresh Reroute

Alias one Fresh route to another without the redirect dance. Your URL stays put,
the response comes from somewhere else.

## Install

```sh
deno add jsr:@smujdev/fresh-reroute
```

Or just import it:

```ts
import freshReroute from 'jsr:@smujdev/fresh-reroute';
```

## Usage

Drop it in a route file and point it wherever:

```ts
// routes/user/by-email/[email]/[...path].ts
import freshReroute from '@smujdev/fresh-reroute';
import { app } from '@/main.ts';

export const handler = freshReroute(app, async (ctx) => {
	const id = await user.byEmail(ctx.params.email);

	// Reject 404
	if (!id) return new Response(null, { status: 404 });

	// Forward response from this path
	return `/user/${id}/${ctx.params.path}`;
}, { trailingSlash: false });
```

Return a `string` to reroute, or a `Response` to bail out early.

Also works as middleware:

```ts
app.use('/origin/[...path]', freshReroute(app, (ctx) => '/target'));
```

## Options

- `trailingSlash` — `true` to force one on, `false` to strip it, omit to leave
  the path alone.

## License

MIT
