interface EmailTemplateProps {
  email: string
}

export function EmailTemplate({ email }: EmailTemplateProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to Our Waitlist</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px; text-align: center;">Welcome to Our Waitlist! 🎉</h1>
          
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            Thank you for joining our waitlist! We've received your email address (${email}) and will keep you updated on our progress.
          </p>
          
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            We're working hard to create something amazing and can't wait to share it with you when we launch!
          </p>
          
          <div style="background-color: #f3f4f6; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>What's next?</strong><br/>
              • Keep an eye on your inbox for updates<br/>
              • Follow us on social media for the latest news<br/>
              • Tell your friends about our upcoming launch
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">Best regards,</p>
          <p style="color: #111827; font-size: 16px; font-weight: 500; margin-bottom: 32px;">The Team</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            If you didn't sign up for this waitlist, you can safely ignore this email.<br/>
            To unsubscribe, <a href="${baseUrl}/unsubscribe" style="color: #6b7280;">click here</a>.
          </p>
        </div>
      </body>
    </html>
  `
}

