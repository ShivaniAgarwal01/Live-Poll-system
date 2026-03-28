import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
// const API_URL = import.meta.env.VITE_API_URL;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL)
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
}
