# Fresh Reroute Middleware

Create alias routes all over your app

```ts
// /user/by-email/[email]/[...path].ts

export const handler = reroute(app, async (ctx) => {
	const id = await user.byEmail(ctx.params.email);
	if (!id) return new Response(null, { status: 404 });
	return `/user/${id}/${ctx.params.path}`;
}, { tailingSlash: false });
```
