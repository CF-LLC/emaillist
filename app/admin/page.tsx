"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface WaitlistStats {
  total: number
  lastMonth: number
  lastWeek: number
  today: number
}

interface AdminData {
  emails: string[]
  stats: WaitlistStats
  total: number
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/waitlist/admin', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        const adminData = await response.json()
        setData(adminData)
        setIsAuthenticated(true)
      } else {
        setError('Invalid password')
      }
    } catch (error) {
      setError('Failed to authenticate')
    } finally {
      setLoading(false)
    }
  }

  const removeEmail = async (email: string) => {
    if (!confirm(`Remove ${email} from waitlist?`)) return

    try {
      const response = await fetch('/api/waitlist/admin', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        // Refresh data
        const refreshResponse = await fetch('/api/waitlist/admin', {
          headers: {
            'Authorization': `Bearer ${password}`
          }
        })
        
        if (refreshResponse.ok) {
          const refreshedData = await response.json()
          setData(refreshedData)
        }
      } else {
        setError('Failed to remove email')
      }
    } catch (error) {
      setError('Failed to remove email')
    }
  }

  const exportCSV = () => {
    if (!data) return

    const csvContent = [
      'Email,Joined Date',
      ...data.emails.map(email => `${email},${new Date().toISOString()}`)
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter admin password to continue</p>
          </div>
          
          <form onSubmit={authenticate} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
            
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </form>
          
          <div className="text-center mt-6">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Waitlist
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Waitlist Admin</h1>
          <div className="flex gap-4">
            <button
              onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Export CSV
            </button>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              View Waitlist
            </Link>
          </div>
        </div>

        {data && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Total Subscribers</h3>
                <p className="text-3xl font-bold text-blue-600">{data.stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
                <p className="text-3xl font-bold text-green-600">{data.stats.lastMonth}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">This Week</h3>
                <p className="text-3xl font-bold text-yellow-600">{data.stats.lastWeek}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Today</h3>
                <p className="text-3xl font-bold text-purple-600">{data.stats.today}</p>
              </div>
            </div>

            {/* Email List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Email Subscribers ({data.emails.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.emails.map((email, index) => (
                      <tr key={email} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => removeEmail(email)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {data.emails.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No subscribers yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}