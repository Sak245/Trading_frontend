"use client";

import { useState, useEffect } from 'react';
import { useTokenData, Token } from '../hooks/useTokenData';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function TokenTable() {
    const { tokens, isLoading, error } = useTokenData();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Token; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');
    const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});

    // Track previous prices to determine flash color
    useEffect(() => {
        const newPrevPrices: Record<string, number> = {};
        tokens.forEach(token => {
            newPrevPrices[token.id] = token.price;
        });
        setPrevPrices(newPrevPrices);
    }, [tokens]);

    if (isLoading) return <div className="p-8 text-center animate-pulse">Loading market data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    const handleSort = (key: keyof Token) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedTokens = [...tokens].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredTokens = sortedTokens.filter(token =>
        token.name.toLowerCase().includes(filter.toLowerCase()) ||
        token.symbol.toLowerCase().includes(filter.toLowerCase())
    );

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatLargeNumber = (value: number) => {
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return formatCurrency(value);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Market Overview</h2>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tokens..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">
                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('price')}>
                                    Price <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('change24h')}>
                                    24h Change <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('volume24h')}>
                                    24h Volume <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('marketCap')}>
                                    Market Cap <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {filteredTokens.map((token) => (
                                <motion.tr
                                    key={token.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{token.name}</span>
                                            <span className="text-muted-foreground text-sm">{token.symbol}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        <motion.div
                                            key={token.price}
                                            initial={{ color: prevPrices[token.id] > token.price ? '#ef4444' : '#22c55e' }}
                                            animate={{ color: 'inherit' }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {formatCurrency(token.price)}
                                        </motion.div>
                                    </TableCell>
                                    <TableCell className={`text-right font-mono ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatLargeNumber(token.volume24h)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatLargeNumber(token.marketCap)}
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
