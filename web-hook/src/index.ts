import { Hono } from 'hono'
import { nanoid } from 'nanoid'

const app = new Hono()

type ConnectionType = 'sender' | 'receiver'

interface WebSocketConnection {
  type: ConnectionType | null
  partnerId: string | null
  socket: WebSocket
}

interface WebSocketMessage {
  type: 'sender' | 'receiver' | 'createOffer' | 'createAnswer' | 'iceCandidate'
  sdp?: any
  candidate?: any
}

const connections = new Map<string, WebSocketConnection>()

app.get('/ws', async (c) => {
  const upgradeHeader = c.req.header('Upgrade')

  if (upgradeHeader !== 'websocket') {
    return c.text('Expected Upgrade: websocket', 400)
  }

  const pair = new WebSocketPair()
  const [client, server] = Object.values(pair)

  server.accept()

  const connectionId = nanoid()
  let connection: WebSocketConnection = {
    type: null,
    partnerId: null,
    socket: server
  }

  connections.set(connectionId, connection)

  server.addEventListener('message', (event) => {
    handleMessage(connectionId, event.data as string)
  })

  server.addEventListener('close', () => {
    handleClose(connectionId)
  })

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
})

function handleMessage(connectionId: string, data: string) {
  try {
    const message = JSON.parse(data) as WebSocketMessage
    const connection = connections.get(connectionId)

    if (!connection) return

    if (message.type === 'sender' || message.type === 'receiver') {
      connection.type = message.type
      findAndSetPartner(connectionId)
    } else if (['createOffer', 'createAnswer', 'iceCandidate'].includes(message.type)) {
      if (connection.partnerId) {
        const partnerConnection = connections.get(connection.partnerId)
        if (partnerConnection) {
          partnerConnection.socket.send(JSON.stringify(message))
        }
      }
    }
  } catch (error) {
    console.error('Error processing message:', error)
  }
}

function handleClose(connectionId: string) {
  const connection = connections.get(connectionId)
  if (connection && connection.partnerId) {
    const partnerConnection = connections.get(connection.partnerId)
    if (partnerConnection) {
      partnerConnection.partnerId = null
      partnerConnection.socket.send(JSON.stringify({ type: 'partnerDisconnected' }))
    }
  }
  connections.delete(connectionId)
}

function findAndSetPartner(connectionId: string) {
  const connection = connections.get(connectionId)
  if (!connection || connection.type === null) return

  for (const [id, potentialPartner] of connections) {
    if (id !== connectionId && 
        potentialPartner.type !== null &&
        potentialPartner.type !== connection.type && 
        !potentialPartner.partnerId) {
      connection.partnerId = id
      potentialPartner.partnerId = connectionId
      
      // Notify both partners that they've been connected
      connection.socket.send(JSON.stringify({ type: 'partnerConnected', partnerType: potentialPartner.type }))
      potentialPartner.socket.send(JSON.stringify({ type: 'partnerConnected', partnerType: connection.type }))
      
      break
    }
  }
}

export default app