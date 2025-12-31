// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
// import dotenv from "dotenv";
// dotenv.config();

// const redis = new Redis({
//   url: "https://amazing-redbird-6555.upstash.io",
//   token: "ARmbAAImcDIyYWYzOTY0N2JmYzA0YTgwODg5YjQ3NTNkOTcyMGI2Y3AyNjU1NQ",
// });

// // create limiter allowing 10 requests per 20 s
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(100, "60 s"),
// });

// export default ratelimit;
