import redis from '../config/redis.js';

const CACHE_EXPIRATION_TIME = 60 * 60; // Cache expiration time in seconds (e.g., 1 hour)

export const getCache = async (key) => {
  const cachedData = await redis.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};

export const setCache = async (key, data) => {
  await redis.set(key, JSON.stringify(data), 'EX', CACHE_EXPIRATION_TIME);
};

export const deleteCache = async (key) => {
  await redis.del(key);
};
