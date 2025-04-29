export async function joinWaitlist(email: string): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const response = await fetch('/emaillist/pages/api/joinWaitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const response = await fetch('/emaillist/pages/api/waitlistCount', { method: 'GET' });

    if (!response.ok) {
      throw new Error('Failed to fetch waitlist count');
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return 0;
  }
}