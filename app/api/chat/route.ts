import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  stepCountIs,
} from 'ai'
import { z } from 'zod'

export const maxDuration = 60

// Claude-style tools for code assistance
const tools = {
  readFile: tool({
    description: 'Read the contents of a file',
    inputSchema: z.object({
      path: z.string().describe('The file path to read'),
    }),
    execute: async ({ path }) => {
      return { 
        content: `[Simulated file content from: ${path}]`,
        path,
        success: true
      }
    },
  }),
  
  writeFile: tool({
    description: 'Write content to a file',
    inputSchema: z.object({
      path: z.string().describe('The file path to write'),
      content: z.string().describe('The content to write'),
    }),
    execute: async ({ path, content }) => {
      return {
        success: true,
        path,
        message: `File written successfully to ${path}`,
        bytesWritten: content.length,
      }
    },
  }),
  
  executeCode: tool({
    description: 'Execute code in a sandbox environment',
    inputSchema: z.object({
      language: z.enum(['javascript', 'typescript', 'python', 'bash']).describe('Programming language'),
      code: z.string().describe('The code to execute'),
    }),
    execute: async ({ language, code }) => {
      return {
        success: true,
        language,
        output: `[Simulated ${language} execution output]`,
        executionTime: '0.5s',
      }
    },
  }),
  
  searchWeb: tool({
    description: 'Search the web for information',
    inputSchema: z.object({
      query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
      return {
        results: [
          { title: `Result 1 for: ${query}`, url: 'https://example.com/1' },
          { title: `Result 2 for: ${query}`, url: 'https://example.com/2' },
        ],
        query,
      }
    },
  }),
  
  analyzeCode: tool({
    description: 'Analyze code for issues, patterns, and suggestions',
    inputSchema: z.object({
      code: z.string().describe('The code to analyze'),
      language: z.string().describe('The programming language'),
    }),
    execute: async ({ code, language }) => {
      return {
        language,
        issues: [],
        suggestions: ['Consider adding type annotations', 'Add error handling'],
        complexity: 'low',
        linesOfCode: code.split('\n').length,
      }
    },
  }),
}

// Claude-style system prompt for code assistance
const SYSTEM_PROMPT = `You are an advanced AI coding assistant powered by Gemini, designed to match Claude's capabilities. You have access to powerful tools for:

1. **File Operations**: Read and write files
2. **Code Execution**: Run code in multiple languages (JavaScript, TypeScript, Python, Bash)
3. **Web Search**: Search the internet for information
4. **Code Analysis**: Analyze code for issues and improvements

## Your Capabilities:
- Write clean, efficient, and well-documented code
- Debug and fix code issues
- Explain complex programming concepts
- Refactor and optimize existing code
- Help with system design and architecture
- Answer technical questions with depth

## Communication Style:
- Be concise but thorough
- Use code blocks with proper syntax highlighting
- Provide step-by-step explanations when needed
- Proactively suggest improvements
- Ask clarifying questions when requirements are unclear

## Best Practices:
- Always consider edge cases
- Write type-safe code when possible
- Follow language-specific conventions
- Include error handling
- Write testable code

When using tools, explain what you're doing and why. After tool execution, interpret the results and provide actionable insights.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    // Using Gemini via AI Gateway
    model: 'google/gemini-2.0-flash',
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
