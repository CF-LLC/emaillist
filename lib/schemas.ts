import { z } from 'zod'

// Email validation schema
export const EmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email address is too long')
    .refine((email) => {
      // Additional validation for common email issues
      const domain = email.split('@')[1]
      if (!domain) return false
      
      // Check for common typos in popular domains
      const popularDomains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
        'icloud.com', 'aol.com', 'protonmail.com'
      ]
      
      const commonTypos = {
        'gamil.com': 'gmail.com',
        'gmai.com': 'gmail.com', 
        'gmial.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'outlok.com': 'outlook.com',
        'hotmial.com': 'hotmail.com'
      }
      
      // Don't block, just validate format is reasonable
      return domain.includes('.') && domain.length > 3
    }, 'Please enter a valid email address'),
})

// Admin password schema
export const AdminPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required')
})

// Unsubscribe schema
export const UnsubscribeSchema = z.object({
  email: EmailSchema.shape.email,
  token: z.string().min(1, 'Unsubscribe token is required')
})

// Waitlist response types
export type EmailValidation = z.infer<typeof EmailSchema>
export type AdminPassword = z.infer<typeof AdminPasswordSchema>
export type UnsubscribeRequest = z.infer<typeof UnsubscribeSchema>