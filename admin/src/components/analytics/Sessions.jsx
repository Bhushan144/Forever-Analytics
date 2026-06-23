import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

// Event type color mapping for timeline dots and badges
const eventColors = {
    page_view:    { bg: '#eef5fa', text: '#7BAFCF', dot: '#7BAFCF', label: 'Page View' },
    click:        { bg: '#fdf2ec', text: '#D4956B', dot: '#D4956B', label: 'Click' },
    product_view: { bg: '#f3eef8', text: '#A78BBA', dot: '#A78BBA', label: 'Product View' },
    add_to_cart:  { bg: '#edf7f1', text: '#6BAD8E', dot: '#6BAD8E', label: 'Add to Cart' },
    search:       { bg: '#ffebf5', text: '#C586A5', dot: '#C586A5', label: 'Search' },
};

// Format duration nicely
const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // State for lazy-loaded journeys
    const [expandedSession, setExpandedSession] = useState(null);
    const [journeys, setJourneys] = useState({}); 
    const [journeyLoading, setJourneyLoading] = useState(false);

    // Fetch Session Summaries
    const fetchSessions = async (showRefreshSpinner = false) => {
        if (showRefreshSpinner) setIsRefreshing(true);
        try {
            const response = await axios.get(`${backendURL}/api/analytics/sessions`, {
                withCredentials: true
            });
            if (response.data.success) {
                setSessions(response.data.sessions);
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
        fetchSessions();
    }, []);

    // Fetch Detailed Journey (Lazy Load)
    const toggleJourney = async (sessionId) => {
        if (expandedSession === sessionId) {
            setExpandedSession(null); 
            return;
        }

        setExpandedSession(sessionId);

        if (!journeys[sessionId]) {
            setJourneyLoading(true);
            try {
                const response = await axios.get(`${backendURL}/api/analytics/sessions/${sessionId}`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setJourneys(prev => ({ ...prev, [sessionId]: response.data.journey }));
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to load journey timeline.");
            } finally {
                setJourneyLoading(false);
            }
        }
    };

    // Helper to render event details with correct formatting
    const renderEventDetails = (event) => {
        const { event_type, metadata, page_url } = event;
        const colors = eventColors[event_type] || eventColors.click;
        
        switch (event_type) {
            case 'page_view': 
                return (
                    <span className="text-gray-600">
                        Viewed Page: <b className="text-gray-800">{page_url}</b>
                    </span>
                );
            case 'click': 
                return (
                    <span className="text-gray-500">
                        Clicked <b className="text-gray-700">{metadata?.element_tag || 'element'}</b>
                        {metadata?.element_text && <span className="text-gray-400"> "{metadata.element_text}"</span>}
                        {' '}at ({(metadata?.x_percent * 100).toFixed(1)}%, {(metadata?.y_percent * 100).toFixed(1)}%)
                    </span>
                );
            case 'product_view': 
                return (
                    <span style={{ color: colors.text }}>
                        Viewed Product: <b>{metadata?.product_name || metadata?.product_id}</b>
                    </span>
                );
            case 'add_to_cart': 
                return (
                    <span style={{ color: colors.text }}>
                        Added to Cart: <b>{metadata?.product_id}</b> {metadata?.price && `($${metadata.price})`}
                    </span>
                );
            case 'search': 
                return (
                    <span style={{ color: colors.text }}>
                        Searched for: <b>"{metadata?.search_query}"</b>
                    </span>
                );
            default: 
                return <span className="text-gray-500">Unknown Action</span>;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="h-5 bg-gray-100 rounded w-40 animate-pulse"></div>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 border-b border-gray-50 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-32"></div>
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                        <div className="h-4 bg-gray-100 rounded w-36"></div>
                        <div className="h-4 bg-gray-100 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Recent Sessions</h2>
                <button 
                    onClick={() => fetchSessions(true)}
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

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr style={{ backgroundColor: '#ffebf5' }}>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Session ID</th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Visitor ID</th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Start Time</th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Duration</th>
                                <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Events</th>
                                <th className="p-4 font-semibold text-gray-700 text-right whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session, idx) => (
                                <React.Fragment key={session.session_id}>
                                    {/* Summary Row */}
                                    <tr className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="p-4 font-mono text-xs text-gray-600">{session.session_id.substring(0, 18)}...</td>
                                        <td className="p-4 font-mono text-xs text-gray-500">{session.visitor_id.substring(0, 18)}...</td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">{new Date(session.start_time).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#f3eef8', color: '#A78BBA' }}>
                                                {formatDuration(session.session_duration_seconds)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-gray-700 font-semibold">{session.event_count}</span>
                                                <span className="text-gray-400 text-xs">actions</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => toggleJourney(session.session_id)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                                                style={expandedSession === session.session_id 
                                                    ? { backgroundColor: '#C586A5', color: 'white' }
                                                    : { backgroundColor: '#ffebf5', color: '#C586A5', border: '1px solid #C586A5' }
                                                }
                                            >
                                                {expandedSession === session.session_id ? '✕ Close' : '→ View Journey'}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expandable Journey Timeline Row */}
                                    {expandedSession === session.session_id && (
                                        <tr>
                                            <td colSpan="6" className="p-0">
                                                <div className="p-6" style={{ backgroundColor: '#fdfafc', borderLeft: '4px solid #C586A5' }}>
                                                    <h3 className="font-bold text-gray-800 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
                                                        <svg className="w-4 h-4" style={{ color: '#C586A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                        User Journey Timeline
                                                    </h3>
                                                    
                                                    {journeyLoading && !journeys[session.session_id] ? (
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            Fetching events...
                                                        </div>
                                                    ) : (
                                                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-5">
                                                            {journeys[session.session_id]?.map((event) => {
                                                                const colors = eventColors[event.event_type] || eventColors.click;
                                                                return (
                                                                    <div key={event.event_id} className="relative pl-7">
                                                                        {/* Timeline Dot — color-coded by event type */}
                                                                        <span 
                                                                            className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-3"
                                                                            style={{ 
                                                                                backgroundColor: colors.dot,
                                                                                ringColor: '#fdfafc'
                                                                            }}
                                                                        ></span>
                                                                        
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-400 font-mono">
                                                                                    {new Date(event.timestamp).toLocaleTimeString()}
                                                                                </span>
                                                                                <span 
                                                                                    className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                                                                    style={{ backgroundColor: colors.bg, color: colors.text }}
                                                                                >
                                                                                    {colors.label}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-sm">
                                                                                {renderEventDetails(event)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            {journeys[session.session_id]?.length === 0 && (
                                                                <p className="pl-7 text-gray-400 text-sm italic">No events recorded in this session.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {sessions.length === 0 && (
                        <div className="p-12 text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 font-medium">No sessions recorded yet</p>
                            <p className="text-gray-400 text-sm mt-1">Sessions will appear here as visitors browse your store.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sessions;