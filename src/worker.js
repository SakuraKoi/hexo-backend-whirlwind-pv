export default {
  async fetch(request, env, ctx) {
	  const url = new URL(request.url);
    if (url.pathname === '/')
      return new Response(JSON.stringify({
        code: 200,
        message: "It's SakuraKooi's Blog PV counter here!"
      }));
      return new Response(JSON.stringify({
        code: 200,
        message: "It's SakuraKooi's Blog PV counter here!"
      }));
  },
};