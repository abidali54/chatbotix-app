import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const reconnectCount = useRef(0);
  const maxReconnectAttempts = options.reconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCount.current = 0;
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        if (reconnectCount.current < maxReconnectAttempts) {
          reconnectCount.current += 1;
          setTimeout(connect, reconnectInterval);
        }
      };

      ws.current.onerror = (event) => {
        setError('WebSocket connection error');
        console.error('WebSocket error:', event);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (e) {
          setError('Invalid message format');
        }
      };
    } catch (error) {
      setError('Failed to establish WebSocket connection');
    }
  }, [url, maxReconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => {
      ws.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify(message));
      } catch (e) {
        setError('Failed to send message');
      }
    } else {
      setError('WebSocket is not connected');
    }
  }, []);

  return { isConnected, lastMessage, sendMessage, error };
}