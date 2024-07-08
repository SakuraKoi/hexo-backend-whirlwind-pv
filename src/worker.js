import { Redis } from '@upstash/redis/cloudflare';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		let key = url.pathname.substring(1);
		if (key === '')
			return new Response(JSON.stringify({
				code: 200,
				message: 'It\'s SakuraKooi\'s Blog PV counter here!'
			}));

		if (request.headers.get('Sakura-Access-Token') !== env['ACCESS_TOKEN'])
			return new Response(JSON.stringify({
				code: 403,
				message: 'Access denied'
			}));

		const redis = Redis.fromEnv(env);

		let visitTrackKey = `t_${key}_${request.headers.get('CF-Connecting-IP')}`;
		let counterKey = `c_${key}`;
		let current;
		if (await redis.get(visitTrackKey) != null) {
			current = await redis.get(counterKey);
		} else {
			await redis.setex(visitTrackKey, 60 * 30, 1);
			current = await redis.incr(counterKey);
		}
		return new Response(JSON.stringify({
			code: 100,
			message: 'ok',
			counter: current
		}));
	}
};
