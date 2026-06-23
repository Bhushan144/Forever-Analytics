import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

const Overview = () => {
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // New state for the refresh button

    // Moved the fetch logic outside so the button can use it too!
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
        return <p className="text-gray-500 animate-pulse">Loading overview metrics...</p>;
    }

    if (!overviewData) return null;

    return (
        <div>
            {/* Added a Header row with a Refresh Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Store Performance</h2>
                <button 
                    onClick={() => fetchOverview(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {isRefreshing ? 'Refreshing...' : '↻ Refresh Data'}
                </button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <div className='bg-white p-5 rounded border shadow-sm flex flex-col'>
                    <p className='text-gray-500 text-xs sm:text-sm uppercase tracking-wide font-semibold'>Total Visitors</p>
                    <p className='text-2xl sm:text-3xl font-bold mt-2 text-gray-800'>{overviewData.totalVisitors || 0}</p>
                </div>

                <div className='bg-white p-5 rounded border shadow-sm flex flex-col'>
                    <p className='text-gray-500 text-xs sm:text-sm uppercase tracking-wide font-semibold'>Total Sessions</p>
                    <p className='text-2xl sm:text-3xl font-bold mt-2 text-gray-800'>{overviewData.totalSessions || 0}</p>
                </div>

                <div className='bg-white p-5 rounded border shadow-sm flex flex-col'>
                    <p className='text-gray-500 text-xs sm:text-sm uppercase tracking-wide font-semibold'>Page Views</p>
                    <p className='text-2xl sm:text-3xl font-bold mt-2 text-gray-800'>{overviewData.totalPageViews || 0}</p>
                </div>

                <div className='bg-white p-5 rounded border shadow-sm flex flex-col'>
                    <p className='text-gray-500 text-xs sm:text-sm uppercase tracking-wide font-semibold'>Total Clicks</p>
                    <p className='text-2xl sm:text-3xl font-bold mt-2 text-gray-800'>{overviewData.totalClicks || 0}</p>
                </div>

                <div className='bg-white p-5 rounded border shadow-sm flex flex-col'>
                    <p className='text-gray-500 text-xs sm:text-sm uppercase tracking-wide font-semibold'>Avg Session</p>
                    <p className='text-2xl sm:text-3xl font-bold mt-2 text-gray-800'>
                        {overviewData.avgDurationSeconds ? `${overviewData.avgDurationSeconds}s` : '0s'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Overview;