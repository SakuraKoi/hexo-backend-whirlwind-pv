# hexo-backend-whirlwind-pv

用于实现 [hexo-theme-whirlwind](https://github.com/SakuraKoi/hexo-theme-whirlwind) 中网页访问量统计功能的Cloudflare worker后端

使用 `Upstash` 作为存储, 每小时同一IP仅统计一次访问



## How 2 Deploy

1. https://developers.cloudflare.com/workers/databases/native-integrations/upstash/
2. https://developers.cloudflare.com/workers/configuration/secrets/ `ACCESS_TOKEN`