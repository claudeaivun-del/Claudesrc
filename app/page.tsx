'use client'

import { useState } from 'react'

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [infoStatus, setInfoStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testHealth = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealthStatus(data)
    } catch (error) {
      setHealthStatus({ error: String(error) })
    }
    setLoading(false)
  }

  const testInfo = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/info')
      const data = await res.json()
      setInfoStatus(data)
    } catch (error) {
      setInfoStatus({ error: String(error) })
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CCProxy v2</h1>
          <p className="text-gray-600 mb-8">Claude Code CLI powered by Gemini</p>

          <div className="space-y-6">
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={testHealth}
                    disabled={loading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
                  >
                    Test GET /api/health
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={testInfo}
                    disabled={loading}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
                  >
                    Test GET /api/info
                  </button>
                </div>
              </div>
            </div>

            {healthStatus && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Health Response:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                  {JSON.stringify(healthStatus, null, 2)}
                </pre>
              </div>
            )}

            {infoStatus && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Info Response:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                  {JSON.stringify(infoStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
