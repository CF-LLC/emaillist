import { NextRequest, NextResponse } from 'next/server'
import { getAllEmails, getWaitlistStats, removeFromWaitlist } from '@/app/actions/waitlist'
import { AdminPasswordSchema, EmailSchema } from '@/lib/schemas'

function validateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const password = authHeader.substring(7)
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  
  return adminPassword && password === adminPassword
}

// Get all emails and stats - requires admin auth
export async function GET(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const emails = await getAllEmails()
    const stats = await getWaitlistStats()
    
    return NextResponse.json({
      emails,
      stats,
      total: emails.length
    })
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// Remove email from waitlist - requires admin auth
export async function DELETE(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const validation = EmailSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email } = validation.data
    const result = await removeFromWaitlist(email)
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    })
    
  } catch (error) {
    console.error('Error removing from waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove email' },
      { status: 500 }
    )
  }
}