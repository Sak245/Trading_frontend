import { WebSocketServer, WebSocket } from 'ws';
import { Token } from '../types';

// Mock initial data
const TOKENS: Token[] = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 65000, change24h: 2.5, volume24h: 35000000000, marketCap: 1200000000000 },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3500, change24h: 1.8, volume24h: 15000000000, marketCap: 400000000000 },
    { id: '3', name: 'Solana', symbol: 'SOL', price: 145, change24h: 5.2, volume24h: 4000000000, marketCap: 65000000000 },
    { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: -0.5, volume24h: 300000000, marketCap: 16000000000 },
    { id: '5', name: 'Ripple', symbol: 'XRP', price: 0.60, change24h: 0.2, volume24h: 1200000000, marketCap: 33000000000 },
    { id: '6', name: 'Polkadot', symbol: 'DOT', price: 7.20, change24h: 1.1, volume24h: 200000000, marketCap: 10000000000 },
    { id: '7', name: 'Dogecoin', symbol: 'DOGE', price: 0.16, change24h: 8.5, volume24h: 2500000000, marketCap: 23000000000 },
    { id: '8', name: 'Chainlink', symbol: 'LINK', price: 18.50, change24h: 3.4, volume24h: 600000000, marketCap: 11000000000 },
    { id: '9', name: 'Avalanche', symbol: 'AVAX', price: 48.00, change24h: 4.1, volume24h: 700000000, marketCap: 18000000000 },
    { id: '10', name: 'Polygon', symbol: 'MATIC', price: 0.95, change24h: -1.2, volume24h: 400000000, marketCap: 9000000000 },
];

let currentTokens = [...TOKENS];

export const getTokens = () => currentTokens;

export const startPriceUpdates = (wss: WebSocketServer) => {
    setInterval(() => {
        // Update prices randomly
        currentTokens = currentTokens.map(token => {
            const changePercent = (Math.random() - 0.5) * 0.02; // +/- 1% change
            const newPrice = token.price * (1 + changePercent);
            return {
                ...token,
                price: Number(newPrice.toFixed(2)),
                change24h: Number((token.change24h + changePercent * 100).toFixed(2))
            };
        });

        // Broadcast updates
        const updateMessage = JSON.stringify({ type: 'PRICE_UPDATE', data: currentTokens });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(updateMessage);
            }
        });
    }, 1000); // Update every second
};
