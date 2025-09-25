import { z } from 'zod'
import { getRedis } from '@/lib/redis'
import { EmailSchema } from '@/lib/schemas'
import { sendWelcomeEmail } from '@/lib/email'

export interface WaitlistResponse {
  success: boolean
  message: string
  data?: any
}

export async function joinWaitlist(email: string): Promise<WaitlistResponse> {
  try {
    // Validate email using Zod schema
    const validation = EmailSchema.safeParse({ email })
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.errors[0]?.message || 'Invalid email address'
      }
    }

    const redis = getRedis()
    if (!redis) {
      return {
        success: false,
        message: 'Service temporarily unavailable'
      }
    }

    const validatedEmail = validation.data.email.toLowerCase().trim()

    // Check if email already exists
    const exists = await redis.sismember('waitlist_emails', validatedEmail)
    if (exists) {
      return {
        success: false,
        message: 'This email is already on our waitlist!'
      }
    }

    // Add email to Redis set
    const added = await redis.sadd('waitlist_emails', validatedEmail)
    if (!added) {
      throw new Error('Failed to add email to waitlist')
    }

    // Add timestamp for analytics
    await redis.zadd('waitlist_signups', {
      score: Date.now(),
      member: validatedEmail
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: validatedEmail }).catch(error => {
      console.error('Failed to send welcome email:', error)
      // Don't fail the signup if email fails
    })

    return {
      success: true,
      message: 'Successfully joined the waitlist! Check your email for confirmation.'
    }

  } catch (error) {
    console.error('Error joining waitlist:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const redis = getRedis()
    if (!redis) return 0

    const count = await redis.scard('waitlist_emails')
    return count || 0
  } catch (error) {
    console.error('Error fetching waitlist count:', error)
    return 0
  }
}

export async function getAllEmails(): Promise<string[]> {
  try {
    const redis = getRedis()
    if (!redis) return []

    const emails = await redis.smembers('waitlist_emails')
    return emails || []
  } catch (error) {
    console.error('Error fetching all emails:', error)
    return []
  }
}

export async function removeFromWaitlist(email: string): Promise<WaitlistResponse> {
  try {
    const validation = EmailSchema.safeParse({ email })
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid email address'
      }
    }

    const redis = getRedis()
    if (!redis) {
      return {
        success: false,
        message: 'Service temporarily unavailable'
      }
    }

    const validatedEmail = validation.data.email.toLowerCase().trim()

    // Remove from both sets
    const removed = await redis.srem('waitlist_emails', validatedEmail)
    await redis.zrem('waitlist_signups', validatedEmail)

    if (!removed) {
      return {
        success: false,
        message: 'Email not found in waitlist'
      }
    }

    return {
      success: true,
      message: 'Successfully removed from waitlist'
    }

  } catch (error) {
    console.error('Error removing from waitlist:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export async function getWaitlistStats() {
  try {
    const redis = getRedis()
    if (!redis) {
      return {
        total: 0,
        lastMonth: 0,
        lastWeek: 0,
        today: 0
      }
    }

    const total = await redis.scard('waitlist_emails')
    
    // Get signups from last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const recentSignups = await redis.zcount('waitlist_signups', thirtyDaysAgo, Date.now())
    
    // Get signups from last 7 days  
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    const weeklySignups = await redis.zcount('waitlist_signups', sevenDaysAgo, Date.now())
    
    // Get signups from today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todaySignups = await redis.zcount('waitlist_signups', todayStart.getTime(), Date.now())

    return {
      total: total || 0,
      lastMonth: recentSignups || 0,
      lastWeek: weeklySignups || 0,
      today: todaySignups || 0
    }
  } catch (error) {
    console.error('Error fetching waitlist stats:', error)
    return {
      total: 0,
      lastMonth: 0,
      lastWeek: 0,
      today: 0
    }
  }
}