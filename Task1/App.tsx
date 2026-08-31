// Task1

import { useState, useEffect, useMemo } from 'react';

const MOCK_COINS = [
    { id: 1, name: 'Bitcoin', ticker: 'BTC', price: 64000 },
    { id: 2, name: 'Ethereum', ticker: 'ETH', price: 3500 },
    { id: 3, name: 'Solana', ticker: 'SOL', price: 150 },
    { id: 4, name: 'Cardano', ticker: 'ADA', price: 0.60 },
    { id: 5, name: 'Polkadot', ticker: 'DOT', price: 8.50 }
];

// 1. CHILD COMPONENTS (PROPS PASSING)

const Controls = ({ searchTerm, setSearchTerm, sortBy, setSortBy, theme, setTheme }: any) => {
    return (
        <div className="controls">
            <input
                data-testid="search-input"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
                data-testid="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
            </select>

            <button
                data-testid="theme-toggle"
                onClick={() => setTheme((prev: string) => (prev === 'light' ? 'dark' : 'light'))}
            >
                Current Theme: {theme}
            </button>
        </div>
    );
};

const CryptoList = ({ coins }: { coins: any[] }) => {
    return (
        <div data-testid="crypto-list">
            {coins.map((coin) => (
                <div key={coin.id} data-testid={`coin-${coin.ticker}`}>
                    {coin.name} ({coin.ticker}) - ${coin.price}
                </div>
            ))}
        </div>
    );
};

// 2. PARENT DASHBOARD COMPONENT

export default function App() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price-desc');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setTimeout(() => {
            setCoins(MOCK_COINS);
            setLoading(false);
        }, 500);
    }, []);

    const filteredAndSortedCoins = useMemo(() => {

        const q = searchTerm.trim().toLowerCase();
        let filter = coins.filter((item) => {
            if (!q) return true;
            return (
                item.name.toLowerCase().includes(q) ||
                item.ticker.toLowerCase().includes(q)
            );
        });

        if (sortBy === 'price-asc') {
            filter = filter.slice().sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filter = filter.slice().sort((a, b) => b.price - a.price);
        }

        return filter;
    }, [coins, searchTerm, sortBy]);

    useEffect(() => {
        document.title = `Tracker - ${filteredAndSortedCoins.length} coins`;
    }, [filteredAndSortedCoins.length]);

    return (
        <div className={`app ${theme}`} data-testid="app-container">
            <h1>Crypto Tracker</h1>

            <Controls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                theme={theme}
                setTheme={setTheme}
            />

            {loading ? (
                <p data-testid="loading-text">Fetching live data...</p>
            ) : (
                <CryptoList coins={filteredAndSortedCoins} />
            )}
        </div>
    );
}
