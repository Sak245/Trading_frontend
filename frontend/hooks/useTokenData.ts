import { useState, useEffect, useRef } from 'react';

export interface Token {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
}

export function useTokenData() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Fetch initial data
        const fetchInitialData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/tokens');
                if (!response.ok) throw new Error('Failed to fetch initial data');
                const data = await response.json();
                setTokens(data);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsLoading(false);
            }
        };

        fetchInitialData();

        // Setup WebSocket
        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'PRICE_UPDATE') {
                    setTokens(message.data);
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    return { tokens, isLoading, error };
}
