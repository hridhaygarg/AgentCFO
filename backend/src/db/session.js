import redis from 'redis';
import { getConfig } from '../config/env.js';
import { logger } from '../utils/logger.js';

let redisClient = null;

/**
 * Initialize Redis connection
 * Creates and caches a Redis client singleton
 * @returns {Promise<Object>} Redis client instance
 * @throws {Error} If Redis connection fails
 */
export async function initializeRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    const config = getConfig();
    const redisUrl = config.REDIS_URL;

    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    redisClient = redis.createClient({
      url: redisUrl
    });

    // Set up event listeners
    redisClient.on('error', (err) => {
      logger.error('Redis client error', { error: err.message });
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    // Connect to Redis
    await redisClient.connect();

    logger.info('Redis initialized successfully');
    return redisClient;
  } catch (err) {
    logger.error('Failed to initialize Redis', { error: err.message });
    throw err;
  }
}

/**
 * Get Redis client (initializes if needed)
 * @returns {Promise<Object>} Redis client instance
 */
async function getRedisClient() {
  if (!redisClient) {
    await initializeRedis();
  }
  return redisClient;
}

/**
 * Generate random session ID
 * @returns {string} 24-character random session ID
 */
function generateSessionId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sessionId = '';
  for (let i = 0; i < 24; i++) {
    sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sessionId;
}

/**
 * Create a new session in Redis
 * @param {string} userId - User ID
 * @param {Object} sessionData - Additional session data (userAgent, ipAddress, device, location, etc.)
 * @returns {Promise<Object>} { sessionId, expiresAt }
 * @throws {Error} If session creation fails
 */
export async function createSession(userId, sessionData = {}) {
  try {
    const client = await getRedisClient();
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 86400000); // 24 hours from now

    const session = {
      sessionId,
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      data: sessionData
    };

    const key = `session:${sessionId}`;
    const TTL = 86400; // 24 hours in seconds

    // Store session with TTL
    await client.setEx(key, TTL, JSON.stringify(session));

    // Also track session ID by user for batch invalidation
    const userSessionsKey = `user:${userId}:sessions`;
    await client.sAdd(userSessionsKey, sessionId);
    // Set TTL on user sessions set
    await client.expire(userSessionsKey, TTL);

    logger.info('Session created', {
      userId,
      sessionId,
      expiresAt: expiresAt.toISOString()
    });

    return {
      sessionId,
      expiresAt: expiresAt.toISOString()
    };
  } catch (err) {
    logger.error('Failed to create session', {
      userId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Get session from Redis
 * Checks if session exists and is not expired
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object|null>} Session object or null if not found/expired
 */
export async function getSession(sessionId) {
  try {
    const client = await getRedisClient();
    const key = `session:${sessionId}`;

    const sessionData = await client.get(key);

    if (!sessionData) {
      logger.debug('Session not found', { sessionId });
      return null;
    }

    const session = JSON.parse(sessionData);

    // Check if session has expired
    const expiresAt = new Date(session.expiresAt).getTime();
    if (expiresAt < Date.now()) {
      logger.info('Session expired', { sessionId });
      await client.del(key);
      return null;
    }

    logger.debug('Session retrieved', { sessionId });
    return session;
  } catch (err) {
    logger.error('Failed to get session', {
      sessionId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Update session in Redis
 * Merges updates into existing session and resets TTL
 * @param {string} sessionId - Session ID
 * @param {Object} updates - Updates to merge (shallow merge on data property)
 * @returns {Promise<Object>} Updated session object
 * @throws {Error} If session not found or update fails
 */
export async function updateSession(sessionId, updates = {}) {
  try {
    const client = await getRedisClient();
    const key = `session:${sessionId}`;

    // Get existing session
    const sessionData = await client.get(key);
    if (!sessionData) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const session = JSON.parse(sessionData);

    // Merge updates into data property
    if (updates.data) {
      session.data = { ...session.data, ...updates.data };
    }

    // Update other properties
    if (updates.expiresAt) {
      session.expiresAt = updates.expiresAt;
    }

    const TTL = 86400; // 24 hours

    // Save updated session with reset TTL
    await client.setEx(key, TTL, JSON.stringify(session));

    logger.info('Session updated', { sessionId });
    return session;
  } catch (err) {
    logger.error('Failed to update session', {
      sessionId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Invalidate a session in Redis
 * Deletes the session immediately
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} true if deleted, false if not found
 */
export async function invalidateSession(sessionId) {
  try {
    const client = await getRedisClient();

    // Get session to find userId for cleanup
    const key = `session:${sessionId}`;
    const sessionData = await client.get(key);

    if (!sessionData) {
      logger.debug('Session not found for invalidation', { sessionId });
      return false;
    }

    const session = JSON.parse(sessionData);

    // Delete session
    await client.del(key);

    // Remove from user sessions set
    const userSessionsKey = `user:${session.userId}:sessions`;
    await client.sRem(userSessionsKey, sessionId);

    logger.info('Session invalidated', {
      sessionId,
      userId: session.userId
    });

    return true;
  } catch (err) {
    logger.error('Failed to invalidate session', {
      sessionId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Invalidate all sessions for a user
 * Useful for security events like password change or logout all devices
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of sessions invalidated
 */
export async function invalidateAllUserSessions(userId) {
  try {
    const client = await getRedisClient();
    const userSessionsKey = `user:${userId}:sessions`;

    // Get all session IDs for this user
    const sessionIds = await client.sMembers(userSessionsKey);

    if (!sessionIds || sessionIds.length === 0) {
      logger.debug('No sessions found for user', { userId });
      return 0;
    }

    // Delete all sessions
    const deletePromises = sessionIds.map((sessionId) =>
      client.del(`session:${sessionId}`)
    );

    await Promise.all(deletePromises);

    // Clear the sessions set
    await client.del(userSessionsKey);

    logger.info('All user sessions invalidated', {
      userId,
      count: sessionIds.length
    });

    return sessionIds.length;
  } catch (err) {
    logger.error('Failed to invalidate all user sessions', {
      userId,
      error: err.message
    });
    throw err;
  }
}

/**
 * Close Redis connection (useful for cleanup)
 * @returns {Promise<void>}
 */
export async function closeRedis() {
  try {
    if (redisClient) {
      await redisClient.disconnect();
      redisClient = null;
      logger.info('Redis connection closed');
    }
  } catch (err) {
    logger.error('Failed to close Redis connection', { error: err.message });
    throw err;
  }
}

export default {
  initializeRedis,
  getRedisClient,
  createSession,
  getSession,
  updateSession,
  invalidateSession,
  invalidateAllUserSessions,
  closeRedis
};
