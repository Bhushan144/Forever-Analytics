import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

// Helper to format numbers with commas
const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
};

// Helper to format duration nicely
const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

// Card configuration with icons and accent colors
const cardConfig = [
    {
        key: 'totalVisitors',
        label: 'Total Visitors',
        accent: '#C586A5',
        bgAccent: '#ffebf5',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        )
    },
    {
        key: 'totalSessions',
        label: 'Total Sessions',
        accent: '#A78BBA',
        bgAccent: '#f3eef8',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        key: 'totalPageViews',
        label: 'Page Views',
        accent: '#7BAFCF',
        bgAccent: '#eef5fa',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        key: 'totalClicks',
        label: 'Total Clicks',
        accent: '#D4956B',
        bgAccent: '#fdf2ec',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
        )
    },
    {
        key: 'avgDuration',
        label: 'Avg. Session',
        accent: '#6BAD8E',
        bgAccent: '#edf7f1',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        )
    }
];

const Overview = () => {
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchOverview = async (showRefreshSpinner = false) => {
        if (showRefreshSpinner) setIsRefreshing(true);
        
        try {
            const response = await axios.get(`${backendURL}/api/analytics/overview`, { 
                withCredentials: true 
            });
            if (response.data.success) {
                setOverviewData(response.data);
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

    // Runs once on mount
    useEffect(() => {
        fetchOverview();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3"></div>
                        <div className="h-3 bg-gray-100 rounded w-20 mb-2"></div>
                        <div className="h-7 bg-gray-100 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!overviewData) return null;

    const getValue = (key) => {
        if (key === 'avgDuration') return formatDuration(overviewData.avgDurationSeconds || 0);
        return formatNumber(overviewData[key] || 0);
    };

    return (
        <div>
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Store Performance</h2>
                <button 
                    onClick={() => fetchOverview(true)}
                    disabled={isRefreshing}
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

            {/* Metric Cards */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                {cardConfig.map((card) => (
                    <div 
                        key={card.key} 
                        className='bg-white rounded-xl border border-gray-100 p-5 flex flex-col transition-all duration-200 hover:shadow-md'
                        style={{ borderLeft: `3px solid ${card.accent}` }}
                    >
                        {/* Icon */}
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                            style={{ backgroundColor: card.bgAccent, color: card.accent }}
                        >
                            {card.icon}
                        </div>
                        {/* Label */}
                        <p className='text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1'>{card.label}</p>
                        {/* Value */}
                        <p className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight'>
                            {getValue(card.key)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Overview;