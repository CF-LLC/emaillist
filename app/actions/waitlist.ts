export async function joinWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/sadd/waitlist_emails/${email}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to add email to waitlist');
    }

    return { success: true, message: 'Successfully joined the waitlist' };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/scard/waitlist_emails`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch waitlist count');
    }

    const data = await response.json();
    return data.result || 0;
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return 0;
  }
}