"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Camera, CameraOff, Video, Wifi, WifiOff } from "lucide-react";

export function Sender2() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`wss://webrtc-csfa.onrender.com`);
    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({ type: "sender" }));
      setIsConnected(true);
    };
    newSocket.onclose = () => setIsConnected(false);
    setSocket(newSocket);

    return () => {
      newSocket.close();
      if (pc) pc.close();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }

  async function StartSendingVideo() {
    if (!socket || !stream) return;

    setIsSending(true);

    const peerConnection = new RTCPeerConnection();
    setPc(peerConnection);

    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    peerConnection.onnegotiationneeded = async () => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.send(
          JSON.stringify({
            type: "createoffer",
            sdp: peerConnection.localDescription,
          }),
        );
      } catch (error) {
        console.error("Error during negotiation:", error);
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "iceCandidate", candidate: event.candidate }),
        );
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "createanswer") {
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.sdp),
        );
      } else if (data.type === "iceCandidate") {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Video Sender
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-2">Connection Status</p>
              {isConnected ? (
                <div className="flex items-center text-green-500">
                  <Wifi className="w-5 h-5 mr-2" />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <WifiOff className="w-5 h-5 mr-2" />
                  <span>Disconnected</span>
                </div>
              )}
            </div>
            <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={stream ? stopCamera : startCamera}
                className={
                  stream
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }
              >
                {stream ? (
                  <CameraOff className="w-5 h-5 mr-2" />
                ) : (
                  <Camera className="w-5 h-5 mr-2" />
                )}
                {stream ? "Stop Camera" : "Start Camera"}
              </Button>
              <Button
                onClick={StartSendingVideo}
                disabled={!isConnected || isSending || !stream}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Video className="w-5 h-5 mr-2" />
                {isSending ? "Sending Video" : "Start Sending Video"}
              </Button>
            </div>
            {isSending && (
              <p className="text-sm text-emerald-600">
                Video stream is being sent...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
