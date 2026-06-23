import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

const Search = () => {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSearches = async (showRefreshSpinner = false) => {
        if (showRefreshSpinner) setIsRefreshing(true);
        try {
            const response = await axios.get(`${backendURL}/api/analytics/search`, { withCredentials: true });
            if (response.data.success) {
                setSearches(response.data.topSearches);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSearches();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden max-w-2xl">
                <div className="p-5 border-b border-gray-100">
                    <div className="h-5 bg-gray-100 rounded w-44 animate-pulse"></div>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-6 p-4 border-b border-gray-50 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-6"></div>
                        <div className="h-4 bg-gray-100 rounded w-32"></div>
                        <div className="h-4 bg-gray-100 rounded flex-1"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Max count for volume bar scaling
    const maxCount = searches.length > 0 ? Math.max(...searches.map(s => s.count)) : 1;

    // Rank badge colors
    const getRankStyle = (index) => {
        if (index === 0) return { backgroundColor: '#C586A5', color: 'white' };  // Gold → brand pink
        if (index === 1) return { backgroundColor: '#A78BBA', color: 'white' };  // Silver → purple
        if (index === 2) return { backgroundColor: '#7BAFCF', color: 'white' };  // Bronze → blue
        return { backgroundColor: '#f0f0f0', color: '#999' };
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Top Search Queries</h2>
                <button 
                    onClick={() => fetchSearches(true)} disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
                    style={{ 
                        border: '1px solid #C586A5', 
                        color: '#C586A5',
                        background: isRefreshing ? '#ffebf5' : 'white'
                    }}
                >
                    <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: '#ffebf5' }}>
                            <th className="p-4 font-semibold text-gray-700 w-14">#</th>
                            <th className="p-4 font-semibold text-gray-700">Search Term</th>
                            <th className="p-4 font-semibold text-gray-700 min-w-[180px]">Search Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searches.map((search, index) => (
                            <tr key={index} className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <td className="p-4">
                                    <span 
                                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                                        style={getRankStyle(index)}
                                    >
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-gray-800 font-medium">
                                        <span className="text-gray-400">"</span>
                                        <span className="capitalize">{search._id}</span>
                                        <span className="text-gray-400">"</span>
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-700 w-8 text-right">{search.count}</span>
                                        {/* Visual volume bar */}
                                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#ffebf5' }}>
                                            <div 
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ 
                                                    width: `${(search.count / maxCount) * 100}%`,
                                                    backgroundColor: '#C586A5'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {searches.length === 0 && (
                    <div className="p-12 text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No searches recorded yet</p>
                        <p className="text-gray-400 text-sm mt-1">Search queries will appear here as visitors use the search feature.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;