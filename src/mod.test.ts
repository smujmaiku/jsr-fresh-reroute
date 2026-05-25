import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import freshReroute, { fixTrailingSlash } from './mod.ts';

describe('fixTrailingSlash', () => {
	it('should add a trailing slash', () => {
		expect(fixTrailingSlash('/foo', true)).toEqual('/foo/');
	});

	it('should remove a trailing slash', () => {
		expect(fixTrailingSlash('/foo//', false)).toEqual('/foo');
	});

	it('should do nothing', () => {
		expect(fixTrailingSlash('///')).toEqual('///');
	});
});

describe('freshReroute', () => {
	it('should resolve the aliased route', async () => {
		const handler = (req: Request) =>
			Promise.resolve(new Response(new URL(req.url).pathname));
		const app = { handler: () => handler };

		const reroute = freshReroute(app, (c) => `/target/${c.params.path}`);
		const res = await reroute({
			req: new Request('http://localhost/origin'),
			state: {},
			params: { path: 'path' },
			next: () => new Response(),
		});

		expect(await res.text()).toEqual('/target/path');
	});
});
