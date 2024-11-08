'use client'

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { AlertCircle, Camera, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Button } from "@repo/ui/button"

type WebSocketMessage = {
  type: string
  sdp?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidate
}

export default function Component() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [pc, setPC] = useState<RTCPeerConnection | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState<'disconnected' | 'connected'>('disconnected')
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const connectWebSocket = () => {
    const newSocket = new WebSocket("ws://127.0.0.1:8787/ws")
    setSocket(newSocket)

    newSocket.onopen = () => {
      console.log("Sender WebSocket connected")
      newSocket.send(JSON.stringify({ type: "sender" }))
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

    newPC.onicecandidate = (event) => {
      if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
        console.log("Sender: Sending ICE candidate", event.candidate)
        socket.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }))
      }
    }

    newPC.oniceconnectionstatechange = () => {
      console.log("Sender: ICE connection state changed to", newPC.iceConnectionState)
    }

    newPC.onconnectionstatechange = () => {
      console.log("Sender: Connection state changed to", newPC.connectionState)
      if (newPC.connectionState === 'connected') {
        setConnectionStatus('connected')
      } else if (newPC.connectionState === 'disconnected' || newPC.connectionState === 'failed') {
        setConnectionStatus('disconnected')
        setError("WebRTC connection failed")
      }
    }

    return newPC
  }

  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log("Sender: Received message", message)

      if (message.type === "createAnswer" && message.sdp && pc) {
        console.log("Sender: Setting remote description")
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
        console.log("Sender: Remote description set successfully")
      } else if (message.type === "iceCandidate" && message.candidate && pc) {
        console.log("Sender: Adding ICE candidate")
        await pc.addIceCandidate(new RTCIceCandidate(message.candidate))
        console.log("Sender: ICE candidate added successfully")
      }
    } catch (error) {
      console.error("Error processing message:", error)
      setError("Failed to process incoming message. Please try reconnecting.")
    }
  }

  const getCameraStreamAndSend = async (pc: RTCPeerConnection) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      stream.getTracks().forEach((track) => {
        console.log("Sender: Adding track to PeerConnection", track.kind)
        pc.addTrack(track, stream)
      })
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      console.log("Sender: Camera stream added to RTCPeerConnection")
      setCameraStatus('connected')

      console.log("Sender: Creating offer")
      const offer = await pc.createOffer()
      console.log("Sender: Setting local description")
      await pc.setLocalDescription(offer)
      console.log("Sender: Sending offer")
      socket?.send(JSON.stringify({ type: "createOffer", sdp: offer }))
    } catch (error) {
      console.error("Error accessing camera:", error)
      setError("Failed to access camera. Please ensure you have granted camera permissions.")
      setCameraStatus('disconnected')
    }
  }

  useEffect(() => {
    connectWebSocket()
    const peerConnection = createPeerConnection()
    getCameraStreamAndSend(peerConnection)

    return () => {
      peerConnection.close()
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
    const newPC = createPeerConnection()
    getCameraStreamAndSend(newPC)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sender Component</CardTitle>
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
        <div className="flex items-center space-x-2">
          <span>Camera Status:</span>
          <Badge 
            variant={cameraStatus === 'connected' ? "default" : "secondary"}
          >
            {cameraStatus}
          </Badge>
          <Camera className={`h-4 w-4 ${cameraStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`} />
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
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  )
}