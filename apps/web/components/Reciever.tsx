'use client'

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { AlertCircle, RefreshCw, Maximize, Minimize, PhoneOff, Share2, Smile, Meh, Frown, FileText, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Button } from "@repo/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@repo/ui/dialog"
import { Label } from "@repo/ui/label"
import Textarea  from "@repo/ui/textarea"
import { Input } from "@repo/ui/input"

type WebSocketMessage = {
  type: string
  sdp?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidate
  documentUrl?: string
}

type FeedbackEmoji = 'smile' | 'meh' | 'frown'

export default function VideoCallReceiver() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [pc, setPC] = useState<RTCPeerConnection | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sharedDocument, setSharedDocument] = useState<string | null>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackEmoji, setFeedbackEmoji] = useState<FeedbackEmoji | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
        handleCallEnd()
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
      } else if (message.type === "shareDocument" && message.documentUrl) {
        setSharedDocument(message.documentUrl)
      } else if (message.type === "endCall") {
        handleCallEnd()
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleCallEnd = () => {
    if (pc) {
      pc.close()
    }
    if (socket) {
      socket.close()
    }
    setConnectionStatus('disconnected')
    setShowFeedbackDialog(true)
  }

  const submitFeedback = () => {
    console.log("Feedback submitted:", { emoji: feedbackEmoji, text: feedbackText })
    // Here you would typically send this feedback to your server
    setShowFeedbackDialog(false)
    setFeedbackEmoji(null)
    setFeedbackText('')
  }

  const handleShareDocument = () => {
    setShowShareDialog(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const submitShareDocument = () => {
    if (selectedFile && socket) {
      // In a real application, you would upload the file to a server here
      // and then send the URL of the uploaded file through the WebSocket
      // For this example, we'll just send the file name
      socket.send(JSON.stringify({ type: "shareDocument", documentUrl: selectedFile.name }))
      setShowShareDialog(false)
      setSelectedFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 py-12">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="bg-zinc-900/80 border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white">Video Call Receiver</CardTitle>
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
              <div className="space-x-2">
                <Button onClick={handleReconnect} size="sm" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reconnect
                </Button>
              </div>
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
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50"
              >
                {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <div className="space-x-2">
                <Button onClick={handleShareDocument} size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/20">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Document
                </Button>
                <Button onClick={handleCallEnd} size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                  <PhoneOff className="mr-2 h-4 w-4" />
                  End Call
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-400 text-center">
              {connectionStatus === 'connected' ? 'Connected to sender' : 'Waiting for the sender to start the video call...'}
            </p>
            {sharedDocument && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Shared Document</h3>
                <div className="flex items-center text-emerald-400">
                  <FileText className="mr-2 h-4 w-4" />
                  {sharedDocument}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Call Ended</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Please provide feedback on your call experience.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 my-4">
            <Button
              variant={feedbackEmoji === 'smile' ? 'default' : 'outline'}
              onClick={() => setFeedbackEmoji('smile')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              <Smile className="h-6 w-6" />
            </Button>
            <Button
              variant={feedbackEmoji === 'meh' ? 'default' : 'outline'}
              onClick={() => setFeedbackEmoji('meh')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              <Meh className="h-6 w-6" />
            </Button>
            <Button
              variant={feedbackEmoji === 'frown' ? 'default' : 'outline'}
              onClick={() => setFeedbackEmoji('frown')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              <Frown className="h-6 w-6" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-white">Additional Comments</Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts about the call..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
            />
          </div>
          <DialogFooter>
            <Button onClick={submitFeedback} className="bg-emerald-600 hover:bg-emerald-700 text-white">Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Share Document</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Select a file to share with the other participant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-white">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="bg-zinc-800 border-zinc-700 text-white file:bg-zinc-700 file:text-white file:border-0"
            />
          </div>
          <DialogFooter>
            <Button onClick={submitShareDocument} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Share File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}