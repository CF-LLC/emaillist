"use client"

import { useState } from "react"
import Link from "next/link"
import { removeFromWaitlist } from "@/app/actions/waitlist"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const result = await removeFromWaitlist(email)
      setMessage(result.message)
      setIsSuccess(result.success)
      
      if (result.success) {
        setEmail("")
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.")
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Unsubscribe</h1>
          <p className="text-gray-600 mt-2">
            Enter your email address to unsubscribe from our waitlist
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Unsubscribing..." : "Unsubscribe"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Successfully Unsubscribed</h2>
            <p className="text-gray-600 mb-6">
              You have been removed from our waitlist. We're sorry to see you go!
            </p>
          </div>
        )}

        {message && !isSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Waitlist
          </Link>
        </div>
      </div>
    </div>
  )
}