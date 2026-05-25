# Fresh Reroute Middleware

Create alias routes all over your app

```ts
// /user/by-email/[email]/[...path].ts

export const handler = freshReroute(app, async (ctx) => {
	const id = await user.byEmail(ctx.params.email);
	if (!id) return new Response(null, { status: 404 });
	return `/user/${id}/${ctx.params.path}`;
}, { trailingSlash: false });
```
