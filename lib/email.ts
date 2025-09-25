import { Resend } from 'resend'
import { EmailTemplate } from '@/app/components/email-template'

let resend: Resend | null = null

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured')
      return null
    }
    
    resend = new Resend(apiKey)
  }
  
  return resend
}

export interface EmailOptions {
  to: string
  subject?: string
  from?: string
}

export async function sendWelcomeEmail({ to, subject, from }: EmailOptions) {
  try {
    const resendClient = getResend()
    
    if (!resendClient) {
      console.warn('Resend client not configured, skipping email send')
      return { success: false, message: 'Email service not configured' }
    }

    const emailHtml = EmailTemplate({ email: to })
    
    const result = await resendClient.emails.send({
      from: from || 'Waitlist <noreply@yourdomain.com>',
      to: [to],
      subject: subject || 'Welcome to our waitlist! 🎉',
      html: emailHtml,
    })

    if (result.error) {
      console.error('Error sending welcome email:', result.error)
      return { success: false, message: 'Failed to send welcome email' }
    }

    console.log('Welcome email sent successfully:', result.data?.id)
    return { success: true, message: 'Welcome email sent', id: result.data?.id }
    
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, message: 'Failed to send welcome email' }
  }
}

export async function sendUnsubscribeConfirmation({ to, from }: Omit<EmailOptions, 'subject'>) {
  try {
    const resendClient = getResend()
    
    if (!resendClient) {
      console.warn('Resend client not configured, skipping email send')
      return { success: false, message: 'Email service not configured' }
    }

    const result = await resendClient.emails.send({
      from: from || 'Waitlist <noreply@yourdomain.com>',
      to: [to],
      subject: 'You\'ve been unsubscribed',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Unsubscribed</title>
        </head>
        <body style="font-family: system-ui, sans-serif; line-height: 1.5; padding: 20px;">
          <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px;">
            <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">You've been unsubscribed</h1>
            <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
              Your email address (${to}) has been successfully removed from our waitlist.
            </p>
            <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
              We're sorry to see you go! If you change your mind, you can always sign up again.
            </p>
            <p style="color: #374151; font-size: 14px;">
              If you didn't request this unsubscription, please reply to this email.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Error sending unsubscribe confirmation:', result.error)
      return { success: false, message: 'Failed to send confirmation email' }
    }

    return { success: true, message: 'Unsubscribe confirmation sent', id: result.data?.id }
    
  } catch (error) {
    console.error('Error sending unsubscribe confirmation:', error)
    return { success: false, message: 'Failed to send confirmation email' }
  }
}