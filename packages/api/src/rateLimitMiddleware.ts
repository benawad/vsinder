import { RateLimiterRedis } from "rate-limiter-flexible";

export const rateLimitMiddleware = (
  rateLimiter: RateLimiterRedis,
  m = "Too many requests, slow down"
) => (req: any, res: any, next: any) => {
  rateLimiter
    .consume(req.userId)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send(m);
    });
};
