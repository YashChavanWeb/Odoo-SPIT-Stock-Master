import NodeCache from 'node-cache';

// TTL = 5 seconds (bucket resets after 5 seconds)
const WINDOW_SIZE = 5000;
const MAX_REQUESTS = 5;

const rateLimitCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

const rateLimiter = (req, res, next) => {
  const userIp = req.ip || req.connection.remoteAddress;

  let userBucket = rateLimitCache.get(userIp);

  const now = Date.now();

  if (!userBucket) {
    // Create bucket for this IP
    userBucket = {
      requests: 0,
      windowStart: now,
    };
  }

  const elapsed = now - userBucket.windowStart;

  // If 5 seconds passed → reset bucket
  if (elapsed > WINDOW_SIZE) {
    userBucket.requests = 0;
    userBucket.windowStart = now;
  }

  // Check limit
  if (userBucket.requests >= MAX_REQUESTS) {
    return res.status(429).json({
      message: 'Rate limit reached. Try again later.',
    });
  }

  // Add request to bucket
  userBucket.requests += 1;

  // Save bucket
  rateLimitCache.set(userIp, userBucket);

  next();
};

export default rateLimiter;
