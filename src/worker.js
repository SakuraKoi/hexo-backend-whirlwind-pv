import { Redis } from '@upstash/redis/cloudflare';

async function handleCorsPreflight(env) {
	return new Response(undefined, {
		headers: {
			'Access-Control-Allow-Origin': env['CORS_DOMAIN'],
			'Access-Control-Allow-Headers': 'Sakura-Access-Token, Counter-Action',
			"Vary": "Origin",
		}
	});
}

async function handleCounter(env, key, request, shouldIncrement) {
	const redis = Redis.fromEnv(env);

	let visitTrackKey = `t_${key}_${request.headers.get('CF-Connecting-IP')}`;
	let counterKey = `c_${key}`;
	let current;
	if (await redis.get(visitTrackKey) != null || !shouldIncrement) {
		current = await redis.get(counterKey);
	} else {
		await redis.setex(visitTrackKey, 60 * 60, 1);
		current = await redis.incr(counterKey);
	}

	return new Response(JSON.stringify({
		code: 100,
		message: 'ok',
		counter: current ?? 0
	}), {
		headers: {
			'Access-Control-Allow-Origin': env['CORS_DOMAIN'],
			'Access-Control-Allow-Headers': 'Sakura-Access-Token, Counter-Action',
			"Vary": "Origin",
			"Cache-Control": "private, max-age=3600, must-revalidate",
		}
	});
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return await handleCorsPreflight(env);
		}

		const url = new URL(request.url);

		let key = url.pathname.substring(1);
		if (key === '')
			return new Response(JSON.stringify({
				code: 200,
				message: 'It\'s SakuraKooi\'s Blog PV counter here!'
			}));

		if (request.headers.get('Sakura-Access-Token') !== env['ACCESS_TOKEN'] || !request.headers.get('Counter-Action'))
			return new Response(JSON.stringify({
				code: 403,
				message: 'Access denied'
			}));

		if (key.length > 40)
			return new Response(JSON.stringify({
				code: 403,
				message: 'Illegal post key'
			}));

		return await handleCounter(env, key, request, request.headers.get('Counter-Action') === "hit");
	}
};
