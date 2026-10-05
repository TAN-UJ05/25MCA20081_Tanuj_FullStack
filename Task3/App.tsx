import { useState, useEffect } from 'react';

export default function App() {
    // TODO 1: Initialize rawUsers, filteredUsers, loading, error, searchQuery, domainFilter, and stats states
    const [rawUsers, setRawUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [domainFilter, setDomainFilter] = useState('ALL');
    const [stats, setStats] = useState({
        totalCount: 0,
        orgDomainCount: 0,
        otherDomainCount: 0,
    });

    // TODO 2: Fetch user data from JSONPlaceholder inside useEffect on mount
    // Hint: Use async/await or fetch().then() inside useEffect. Handle errors and reset loading state.
    async function fetchData() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await response.json();
            setRawUsers(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        // Write your API fetch logic here
        fetchData();
    }, []);

    // TODO 3: Create a useEffect to filter rawUsers based on searchQuery and domainFilter, then update filteredUsers
    // Suggested String Helper Methods to use:
    //  - string.trim() -> removes whitespace from both ends
    //  - string.toLowerCase() -> converts text to lowercase for case-insensitive comparisons
    //  - string.includes(query) -> checks if string contains matching text
    //  - string.endsWith('.org') -> checks if domain string ends with .org suffix
    function filterData() {
        const q = searchQuery.trim().toLowerCase();
        return rawUsers.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(q) ||
                user.username.toLowerCase().includes(q);

            const matchesDomain =
                domainFilter === 'ALL' ||
                user.website.toLowerCase().endsWith('.org');

            return matchesSearch && matchesDomain;
        });
    }
    useEffect(() => {
        // Write your filtering pipeline here using loop/filter and update filteredUsers state
        const result = filterData();
        setFilteredUsers(result);
    }, [rawUsers, searchQuery, domainFilter]);

    // TODO 4: Create a separate useEffect to calculate metrics from filteredUsers and update stats state
    // Suggested logic: Loop through filteredUsers array, count total length, .org websites, and other websites.
    useEffect(() => {
        // Write your stats computation pipeline here and update stats state object
        let orgCount = 0;
        filteredUsers.forEach((user) => {
            if (user.website.toLowerCase().endsWith('.org')) {
                orgCount++;
            }
        });
        setStats({
            totalCount: filteredUsers.length,
            orgDomainCount: orgCount,
            otherDomainCount: filteredUsers.length - orgCount
        });
    }, [filteredUsers]);

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif', padding: '0 15px' }}>
            <h2>User Directory Analytics</h2>

            {/* Control Bar */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: '#f5f5f5', padding: '15px', borderRadius: '6px' }}>
                <input
                    type="text"
                    data-testid="search-input"
                    placeholder="Search by name or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: '8px', fontSize: '14px' }}
                />
                <select
                    data-testid="domain-filter-select"
                    value={domainFilter}
                    onChange={(e) => setDomainFilter(e.target.value)}
                    style={{ padding: '8px', fontSize: '14px' }}
                >
                    <option value="ALL">All Domains</option>
                    <option value="ORG">.org Domains Only</option>
                </select>
            </div>

            {/* Summary Metrics Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-around', background: '#e3f2fd', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                <div>Total Matching: <strong data-testid="total-count">{stats.totalCount}</strong></div>
                <div>.org Websites: <strong data-testid="org-count">{stats.orgDomainCount}</strong></div>
                <div>Other Websites: <strong data-testid="other-count">{stats.otherDomainCount}</strong></div>
            </div>

            {/* Loading State */}
            {loading && <p data-testid="loading-indicator">Loading user profiles from API...</p>}

            {/* Error State */}
            {error && (
                <div data-testid="error-message" style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>
                    Error loading users: {error}
                </div>
            )}

            {/* User Cards Grid */}
            {!loading && !error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' }}>
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            data-testid="user-card"
                            style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '12px', background: '#fff' }}
                        >
                            <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
                            <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>@{user.username}</p>
                            <p style={{ margin: '0 0 5px 0', fontSize: '13px' }}>📧 {user.email}</p>
                            <p style={{ margin: '0', fontSize: '13px', color: '#1976d2' }}>🌐 {user.website}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
