import { Hono } from 'hono'

const app = new Hono()

let senderSocket: WebSocket | null = null
let receiverSocket: WebSocket | null = null

const handleWebSocket = (ws: WebSocket) => {
  ws.accept()

  ws.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data as string)
      
      if (message.type === 'sender') {
        console.log('sender set')
        senderSocket = ws
      } else if (message.type === 'receiver') {
        console.log('receiver set')
        receiverSocket = ws
      } else if (message.type === 'createoffer') {
        console.log('create offer')
        if (ws !== senderSocket) {
          return
        }
        receiverSocket?.send(JSON.stringify({ type: 'createoffer', sdp: message.sdp }))
      } else if (message.type === 'createanswer') {
        console.log('create answer')
        if (ws !== receiverSocket) {
          return
        }
        senderSocket?.send(JSON.stringify({ type: 'createanswer', sdp: message.sdp }))
      } else if (message.type === 'iceCandidate') {
        if (ws === senderSocket) {
          receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }))
        } else if (ws === receiverSocket) {
          senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }))
        }
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })

  ws.addEventListener('error', (event) => {
    console.error('WebSocket error:', event)
  })
}

app.get('/ws', (c) => {
  const upgradeHeader = c.req.header('Upgrade')
  if (upgradeHeader !== 'websocket') {
    return c.text('Expected Upgrade: websocket', 426)
  }

  const pair = new WebSocketPair()
  const webSocket = pair[1]

  handleWebSocket(webSocket)

  return new Response(null, {
    status: 101,
    webSocket: pair[0]
  })
})

export default app