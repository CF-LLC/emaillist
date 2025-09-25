import { Redis } from '@upstash/redis'

let redisInstance: Redis | null = null

export function getRedis() {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
    
    if (!url || !token) {
      console.warn('Redis credentials not found. Using mock client for build.')
      return null
    }

    redisInstance = new Redis({
      url,
      token,
    })
  }
  
  return redisInstance
}

// Export singleton instance for backward compatibility
export const redis = getRedis()

