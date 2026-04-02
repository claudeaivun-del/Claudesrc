'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

function getMessageText(parts: any[]): string {
  if (!parts || !Array.isArray(parts)) return ''
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function ToolCallDisplay({ toolCall }: { toolCall: any }) {
  const { toolName, input, output, state } = toolCall
  
  return (
    <div className="my-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-400 font-mono">{toolName}</span>
        <span className={`px-2 py-0.5 rounded text-xs ${
          state === 'output-available' ? 'bg-green-900/50 text-green-400' :
          state === 'input-streaming' ? 'bg-yellow-900/50 text-yellow-400' :
          'bg-gray-700 text-gray-400'
        }`}>
          {state}
        </span>
      </div>
      {input && (
        <div className="mb-2">
          <span className="text-gray-500 text-xs">Input:</span>
          <pre className="mt-1 text-gray-300 bg-gray-900/50 p-2 rounded overflow-x-auto">
            {JSON.stringify(input, null, 2)}
          </pre>
        </div>
      )}
      {output && (
        <div>
          <span className="text-gray-500 text-xs">Output:</span>
          <pre className="mt-1 text-green-300 bg-gray-900/50 p-2 rounded overflow-x-auto">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

function MessageContent({ parts }: { parts: any[] }) {
  if (!parts || !Array.isArray(parts)) return null
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <div key={index} className="whitespace-pre-wrap">
              {part.text.split('```').map((segment: string, i: number) => {
                if (i % 2 === 1) {
                  const [lang, ...code] = segment.split('\n')
                  return (
                    <pre key={i} className="my-2 bg-gray-900 rounded-lg p-3 overflow-x-auto">
                      <code className="text-sm text-gray-300">
                        {code.join('\n')}
                      </code>
                    </pre>
                  )
                }
                return <span key={i}>{segment}</span>
              })}
            </div>
          )
        }
        if (part.type === 'tool-invocation') {
          return <ToolCallDisplay key={index} toolCall={part} />
        }
        return null
      })}
    </>
  )
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const examplePrompts = [
    'Write a TypeScript function to validate email addresses',
    'Explain how React hooks work with examples',
    'Help me debug a Node.js async/await issue',
    'Create a REST API endpoint with error handling',
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">CCProxy Chat</h1>
              <p className="text-xs text-gray-400">Claude-style AI powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-sm text-gray-400">
              {isLoading ? 'Thinking...' : 'Ready'}
            </span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                <span className="text-white font-bold text-4xl">C</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to CCProxy Chat</h2>
              <p className="text-gray-400 mb-8 text-center max-w-md">
                An AI coding assistant with Claude-style capabilities, powered by Gemini.
                Ask me to help with code, debug issues, or explain concepts.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(prompt)
                    }}
                    className="text-left px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-colors text-sm text-gray-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">C</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <MessageContent parts={message.parts} />
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300 font-medium text-sm">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 max-w-4xl mx-auto">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {/* Input Area */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about code..."
              disabled={isLoading}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            CCProxy uses Gemini API with Claude-style tools and prompts
          </p>
        </form>
      </footer>
    </div>
  )
}
