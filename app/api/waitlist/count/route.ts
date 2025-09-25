import { NextRequest, NextResponse } from 'next/server'
import { getWaitlistCount } from '@/app/actions/waitlist'

export async function GET() {
  try {
    const count = await getWaitlistCount()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching waitlist count:', error)
    return NextResponse.json({ error: 'Failed to fetch count' }, { status: 500 })
  }
}