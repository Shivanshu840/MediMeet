'use client'

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Button } from "@repo/ui/button"

type WebSocketMessage = {
  type: string
  sdp?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidate
}

export default function Component() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [pc, setPC] = useState<RTCPeerConnection | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = useState<string | null>(null)

  const connectWebSocket = () => {
    const newSocket = new WebSocket("ws://127.0.0.1:8787/ws")
    setSocket(newSocket)

    newSocket.onopen = () => {
      console.log("Receiver WebSocket connected")
      newSocket.send(JSON.stringify({ type: "receiver" }))
      setConnectionStatus('connecting')
      setError(null)
    }

    newSocket.onerror = (event) => {
      console.error("WebSocket error:", event)
      setError("WebSocket connection failed. Please check your internet connection and try again.")
      setConnectionStatus('disconnected')
    }

    newSocket.onclose = () => {
      console.log("WebSocket closed")
      setConnectionStatus('disconnected')
    }

    newSocket.onmessage = handleWebSocketMessage
  }

  const createPeerConnection = () => {
    const newPC = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
    setPC(newPC)

    newPC.ontrack = (event) => {
      console.log("Receiver: Track received", event.track.kind)
      if (event.streams && event.streams[0]) {
        console.log("Receiver: Setting video stream")
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0]
        }
      }
    }

    newPC.onicecandidate = (event) => {
      if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
        console.log("Receiver: Sending ICE candidate", event.candidate)
        socket.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }))
      }
    }

    newPC.oniceconnectionstatechange = () => {
      console.log("Receiver: ICE connection state changed to", newPC.iceConnectionState)
    }

    newPC.onconnectionstatechange = () => {
      console.log("Receiver: Connection state changed to", newPC.connectionState)
      if (newPC.connectionState === 'connected') {
        setConnectionStatus('connected')
      } else if (newPC.connectionState === 'disconnected' || newPC.connectionState === 'failed') {
        setConnectionStatus('disconnected')
        setError("WebRTC connection failed. The sender may have disconnected.")
      }
    }

    return newPC
  }

  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log("Receiver: Received message", message)

      if (message.type === "createOffer" && message.sdp && pc) {
        console.log("Receiver: Setting remote description")
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
        console.log("Receiver: Creating answer")
        const answer = await pc.createAnswer()
        console.log("Receiver: Setting local description")
        await pc.setLocalDescription(answer)
        console.log("Receiver: Sending answer")
        socket?.send(JSON.stringify({ type: "createAnswer", sdp: answer }))
      } else if (message.type === "iceCandidate" && message.candidate && pc) {
        console.log("Receiver: Adding ICE candidate")
        await pc.addIceCandidate(new RTCIceCandidate(message.candidate))
        console.log("Receiver: ICE candidate added successfully")
      }
    } catch (error) {
      console.error("Error processing message:", error)
      setError("Failed to process incoming message. Please try reconnecting.")
    }
  }

  useEffect(() => {
    connectWebSocket()
    createPeerConnection()

    return () => {
      pc?.close()
      socket?.close()
    }
  }, [])

  const handleReconnect = () => {
    if (socket) {
      socket.close()
    }
    if (pc) {
      pc.close()
    }
    connectWebSocket()
    createPeerConnection()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Receiver Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Connection Status:</span>
            <Badge 
              variant={connectionStatus === 'connected' ? "default" : "secondary"}
            >
              {connectionStatus}
            </Badge>
          </div>
          <Button onClick={handleReconnect} size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reconnect
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  )
}