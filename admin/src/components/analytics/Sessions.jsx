import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for refresh button
    
    // State for lazy-loaded journeys
    const [expandedSession, setExpandedSession] = useState(null);
    const [journeys, setJourneys] = useState({}); 
    const [journeyLoading, setJourneyLoading] = useState(false);

    // Fetch Session Summaries (Extracted so the button can use it)
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

    // Run exactly once on mount
    useEffect(() => {
        fetchSessions();
    }, []); // Removed token dependency

    //  Fetch Detailed Journey (Lazy Load)
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
                    withCredentials: true // Ensures secure cookie is sent
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

    // Helper to parse event metadata beautifully
    const renderEventDetails = (event) => {
        const { event_type, metadata, page_url } = event;
        switch (event_type) {
            case 'page_view': 
                return <span className="text-gray-600">Viewed Page: <b className="text-black">{page_url}</b></span>;
            case 'click': 
                return <span className="text-gray-500">Clicked <b className="text-gray-700">{metadata.element_tag || 'element'}</b> at ({metadata.x_percent}%, {metadata.y_percent}%)</span>;
            case 'product_view': 
                return <span className="text-blue-600">Viewed Product: <b className="text-blue-800">{metadata.product_name}</b></span>;
            case 'add_to_cart': 
                return <span className="text-green-600">Added to Cart: <b className="text-green-800">{metadata.product_id}</b> (${metadata.price})</span>;
            case 'search': 
                return <span className="text-purple-600">Searched for: <b className="text-purple-800">"{metadata.search_query}"</b></span>;
            default: 
                return <span className="text-gray-500">Unknown Action</span>;
        }
    };

    if (loading) return <p className="text-gray-500 animate-pulse">Loading sessions table...</p>;

    return (
        <div>
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Recent Sessions</h2>
                <button 
                    onClick={() => fetchSessions(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {isRefreshing ? 'Refreshing...' : '↻ Refresh Data'}
                </button>
            </div>

            <div className="bg-white rounded border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b text-gray-600">
                            <tr>
                                <th className="p-4 font-semibold">Session ID</th>
                                <th className="p-4 font-semibold">Visitor ID</th>
                                <th className="p-4 font-semibold">Start Time</th>
                                <th className="p-4 font-semibold">Duration</th>
                                <th className="p-4 font-semibold">Events</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <React.Fragment key={session.session_id}>
                                    {/* Summary Row */}
                                    <tr className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-800 font-medium">{session.session_id.substring(0, 15)}...</td>
                                        <td className="p-4 text-gray-500">{session.visitor_id.substring(0, 15)}...</td>
                                        <td className="p-4 text-gray-600">{new Date(session.start_time).toLocaleString()}</td>
                                        <td className="p-4 text-gray-600">{session.session_duration_seconds}s</td>
                                        <td className="p-4 text-gray-600">{session.event_count} actions</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => toggleJourney(session.session_id)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 border rounded hover:bg-gray-200 transition-colors"
                                            >
                                                {expandedSession === session.session_id ? 'Close' : 'View Journey'}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expandable Journey Timeline Row */}
                                    {expandedSession === session.session_id && (
                                        <tr>
                                            <td colSpan="6" className="p-0 border-b">
                                                <div className="bg-slate-50 p-6 border-l-4 border-blue-500 shadow-inner">
                                                    <h3 className="font-bold text-gray-800 mb-6 uppercase text-xs tracking-wider">User Journey Timeline</h3>
                                                    
                                                    {journeyLoading && !journeys[session.session_id] ? (
                                                        <p className="text-gray-500 animate-pulse">Fetching events...</p>
                                                    ) : (
                                                        <div className="relative border-l-2 border-gray-300 ml-3 space-y-6">
                                                            {journeys[session.session_id]?.map((event) => (
                                                                <div key={event.event_id} className="relative pl-6">
                                                                    {/* Timeline Dot */}
                                                                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-slate-50"></span>
                                                                    
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs text-gray-400 font-medium mb-1">
                                                                            {new Date(event.timestamp).toLocaleTimeString()}
                                                                        </span>
                                                                        <span className="text-sm">
                                                                            {renderEventDetails(event)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {journeys[session.session_id]?.length === 0 && (
                                                                <p className="pl-6 text-gray-500">No events recorded in this session.</p>
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
                    {sessions.length === 0 && <p className="p-6 text-center text-gray-500">No sessions recorded yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Sessions;