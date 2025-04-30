"use client";

import React, { useState, useEffect } from "react";

interface WaitlistFormProps {
  onSuccess: (count: number) => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/sadd/waitlist_emails/${email}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add email to waitlist");
      }

      setMessage("Successfully added to the waitlist!");
      setEmail("");

      // Fetch the updated waitlist count
      const countResponse = await fetch(
        `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/scard/waitlist_emails`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      );

      if (countResponse.ok) {
        const countData = await countResponse.json();
        onSuccess(countData.result || 0); // Call the onSuccess callback with the updated count
      }
    } catch (error) {
      console.error("Error adding email to waitlist:", error);
      setMessage("Failed to add email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Join Waitlist"}
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}