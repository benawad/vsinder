import { RateLimiterRedis } from "rate-limiter-flexible";

export const rateLimitMiddleware = (
  rateLimiter: RateLimiterRedis,
  m = "Too many requests, slow down",
  showTime = false
) => (req: any, res: any, next: any) => {
  rateLimiter
    .consume(req.userId)
    .then(() => {
      next();
    })
    .catch(({ msBeforeNext }) => {
      let tmpM = m;
      if (showTime) {
        let minutes = Math.floor(msBeforeNext / 1000 / 60);
        let hours = 0;
        if (minutes > 60) {
          hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
        }
        const parts = [];
        if (hours) {
          parts.push(`${hours} hours`);
        }
        if (minutes) {
          parts.push(`${minutes} mins`);
        }
        tmpM += `resets in ${parts.join(" and ")}`;
      }
      res.status(429).send(tmpM);
    });
};
