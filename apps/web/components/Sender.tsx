'use client'

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { AlertCircle, Camera, RefreshCw, PhoneOff, Share2, Smile, Meh, Frown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Button } from "@repo/ui/button"
import Textarea from "@repo/ui/textarea"

type WebSocketMessage = {
  type: string
  sdp?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidate
}

type FeedbackEmoji = 'smile' | 'meh' | 'frown'

export default function VideoCallSender() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [cameraStatus, setCameraStatus] = useState<'disconnected' | 'connected'>('disconnected')
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    try {
      const newPC = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })

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

      peerConnectionRef.current = newPC
      return newPC
    } catch (error) {
      console.error("Failed to create PeerConnection:", error)
      setError("Failed to create PeerConnection. Please try again.")
      return null
    }
  }, [socket])

  const connectWebSocket = useCallback(() => {
    if (socket) {
      socket.close()
    }
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
  }, [])

  const handleWebSocketMessage = useCallback(async (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log("Sender: Received message", message)

      if (message.type === "partnerConnected") {
        console.log("Partner connected, creating and sending offer")
        await createAndSendOffer()
      } else if (message.type === "createAnswer" && message.sdp && peerConnectionRef.current) {
        console.log("Sender: Setting remote description")
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp))
        console.log("Sender: Remote description set successfully")
      } else if (message.type === "iceCandidate" && message.candidate && peerConnectionRef.current) {
        console.log("Sender: Adding ICE candidate")
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate))
        console.log("Sender: ICE candidate added successfully")
      }
    } catch (error) {
      console.error("Error processing message:", error)
      setError("Failed to process incoming message. Please try reconnecting.")
    }
  }, [])

  const createAndSendOffer = async () => {
    if (!peerConnectionRef.current || peerConnectionRef.current.connectionState === 'closed') {
      console.log("PeerConnection is not available or closed. Creating a new one.")
      const newPC = createPeerConnection()
      if (!newPC) return
    }

    if (peerConnectionRef.current && peerConnectionRef.current.connectionState !== 'closed') {
      try {
        await getCameraStreamAndSend()
        const offer = await peerConnectionRef.current.createOffer()
        await peerConnectionRef.current.setLocalDescription(offer)
        socket?.send(JSON.stringify({ type: "createOffer", sdp: offer }))
        console.log("Sender: Offer created and sent successfully")
      } catch (error) {
        console.error("Error creating offer:", error)
        setError("Failed to create offer. Please try reconnecting.")
      }
    } else {
      console.error("PeerConnection is still not available or closed")
      setError("Connection is not ready. Please try reconnecting.")
    }
  }

  const getCameraStreamAndSend = async () => {
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      }

      const stream = streamRef.current
      if (peerConnectionRef.current && peerConnectionRef.current.connectionState !== 'closed') {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current!.addTrack(track, stream)
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        console.log("Sender: Camera stream added to RTCPeerConnection")
        setCameraStatus('connected')
      } else {
        console.error("PeerConnection is not available or closed")
        setError("Failed to add media track. Please try reconnecting.")
        setCameraStatus('disconnected')
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setError("Failed to access camera. Please ensure you have granted camera permissions.")
      setCameraStatus('disconnected')
    }
  }

  const handleReconnect = useCallback(() => {
    if (socket) {
      socket.close()
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    connectWebSocket()
    createPeerConnection()
    getCameraStreamAndSend()
  }, [socket, connectWebSocket, createPeerConnection])

  useEffect(() => {
    connectWebSocket()
    createPeerConnection()
    getCameraStreamAndSend()

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      if (socket) {
        socket.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [connectWebSocket, createPeerConnection])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 py-12">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="bg-zinc-900/80 border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white">Video Call Sender</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-300">Connection Status:</span>
                <Badge 
                  variant={connectionStatus === 'connected' ? "default" : "secondary"}
                  className={connectionStatus === 'connected' ? "bg-emerald-500" : "bg-zinc-700"}
                >
                  {connectionStatus}
                </Badge>
              </div>
              <Button onClick={handleReconnect} size="sm" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reconnect
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-zinc-300">Camera Status:</span>
              <Badge 
                variant={cameraStatus === 'connected' ? "default" : "secondary"}
                className={cameraStatus === 'connected' ? "bg-emerald-500" : "bg-zinc-700"}
              >
                {cameraStatus}
              </Badge>
              <Camera className={`h-4 w-4 ${cameraStatus === 'connected' ? 'text-emerald-500' : 'text-red-500'}`} />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-700">
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
      </div>
    </div>
  )
}