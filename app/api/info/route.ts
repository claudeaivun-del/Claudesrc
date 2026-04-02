export async function GET() {
  return Response.json({
    name: 'CCProxy v2',
    version: '2.0.0',
    description: 'Claude Code CLI powered by Gemini',
    endpoints: {
      health: 'GET /api/health',
      info: 'GET /api/info'
    },
    config: {
      geminiServer: process.env.NEXT_PUBLIC_GEMINI_HOST || 'api.gemini.server',
      port: process.env.NEXT_PUBLIC_GEMINI_PORT || 443,
      protocol: process.env.NEXT_PUBLIC_GEMINI_PROTOCOL || 'https'
    }
  })
}
