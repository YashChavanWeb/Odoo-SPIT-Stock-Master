import { prisma } from '../utils/prisma.js';
import { getCache, setCache } from '../utils/cache.js';

const getUsers = async (req, res) => {
  try {
    // Get page and limit from query params (default to page 1 and limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // Calculate the skip based on the current page
    const skip = (page - 1) * limit;

    const cacheKey = `users:page:${page}`; // Cache key based on page number

    // Check if the data is in cache
    const cachedUsers = await getCache(cacheKey);
    if (cachedUsers) {
      return res.json({
        source: 'cache',
        data: cachedUsers,
        pagination: {
          totalUsers: cachedUsers.totalUsers,
          totalPages: cachedUsers.totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    }

    // If not in cache, fetch from DB using Prisma
    const users = await prisma.Users.findMany({
      skip,
      take: limit,
    });

    const totalUsers = await prisma.Users.count();
    const totalPages = Math.ceil(totalUsers / limit);
    const cacheData = {
      users,
      totalUsers,
      totalPages,
    };

    await setCache(cacheKey, cacheData);

    return res.json({
      source: 'database',
      data: users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getUsers };
