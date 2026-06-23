import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

const Overview = ({ token }) => {
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/analytics/overview`, { 
                    headers: { token } 
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
            }
        };

        if (token) {
            fetchOverview();
        }
    }, [token]);

    if (loading) {
        return <p className="text-gray-500 animate-pulse">Loading overview metrics...</p>;
    }

    if (!overviewData) return null;

    return (
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
    );
};

export default Overview;