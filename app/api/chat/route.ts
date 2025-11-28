import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    console.log('Received message:', message)

    // Try different payload formats for n8n
    const payloads = [
      { chatInput: message },
      { message: message },
      { text: message },
      { query: message },
      { input: message }
    ]

    let lastError = null

    // Try each payload format
    for (const payload of payloads) {
      try {
        console.log('Trying payload:', payload)
        
        const response = await fetch(
          'https://teamhack2025.app.n8n.cloud/webhook/a2dbb0bd-9d3e-4736-a5d4-bc97913a6aa0/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          }
        )

        console.log('Response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('Response data:', data)

          // Extract the actual message from various possible formats
          const botMessage = 
            data.output ||
            data.response ||
            data.message ||
            data.text ||
            data.reply ||
            data.result ||
            (typeof data === 'string' ? data : JSON.stringify(data))

          return NextResponse.json({ 
            success: true,
            message: botMessage 
          })
        }

        lastError = `HTTP ${response.status}: ${response.statusText}`
      } catch (err) {
        console.error('Error with payload:', payload, err)
        lastError = err
      }
    }

    // If all attempts failed, return the last error
    return NextResponse.json(
      { 
        success: false, 
        message: 'The AI assistant is currently unavailable. Please check the n8n workflow configuration.',
        error: lastError 
      },
      { status: 500 }
    )

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process your message. Please try again.' 
      },
      { status: 500 }
    )
  }
}
