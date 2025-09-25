import { NextRequest, NextResponse } from 'next/server'
import { joinWaitlist } from '@/app/actions/waitlist'
import { EmailSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validation = EmailSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error.errors[0]?.message || 'Invalid email address' 
        },
        { status: 400 }
      )
    }

    const { email } = validation.data
    const result = await joinWaitlist(email)
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    })
    
  } catch (error) {
    console.error('Error joining waitlist:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 }
    )
  }
}