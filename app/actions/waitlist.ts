export async function joinWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Ensure the email is valid before making the request
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/sadd/waitlist_emails/${encodeURIComponent(email)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from Upstash (sadd):', errorData);
      throw new Error(errorData.error || 'Failed to add email to waitlist');
    }

    return { success: true, message: 'Successfully joined the waitlist' };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/scard/waitlist_emails`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from Upstash (scard):', errorData);
      throw new Error(errorData.error || 'Failed to fetch waitlist count');
    }

    const data = await response.json();
    return data.result || 0;
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return 0;
  }
}