"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Video, RefreshCw, PhoneOff, Phone } from "lucide-react";

export function Receiver2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const initializeConnection = () => {
    socketRef.current = new WebSocket(`wss://webrtc-csfa.onrender.com`);

    socketRef.current.onopen = () => {
      socketRef.current?.send(JSON.stringify({ type: "receiver" }));
    };

    socketRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "createoffer") {
        if (!pc.current) {
          pc.current = new RTCPeerConnection();

          pc.current.onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current?.send(
                JSON.stringify({
                  type: "iceCandidate",
                  candidate: event.candidate,
                }),
              );
            }
          };

          pc.current.ontrack = (event) => {
            if (videoRef.current && event.streams[0]) {
              videoRef.current.srcObject = event.streams[0];
              setIsCallActive(true);
            }
          };
        }

        await pc.current.setRemoteDescription(
          new RTCSessionDescription(message.sdp),
        );
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socketRef.current?.send(
          JSON.stringify({
            type: "createanswer",
            sdp: pc.current.localDescription,
          }),
        );
      } else if (message.type === "iceCandidate" && pc.current) {
        await pc.current.addIceCandidate(
          new RTCIceCandidate(message.candidate),
        );
      }
    };
  };

  useEffect(() => {
    initializeConnection();

    return () => {
      endCall();
    };
  }, []);

  const handleRefresh = () => {
    endCall();
    initializeConnection();
  };

  const endCall = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsCallActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Live Video Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
            {!isCallActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleRefresh}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Connection
            </Button>
            {isCallActive ? (
              <Button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <PhoneOff className="mr-2 h-4 w-4" /> End Call
              </Button>
            ) : (
              <Button
                onClick={initializeConnection}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Phone className="mr-2 h-4 w-4" /> Start Call
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
