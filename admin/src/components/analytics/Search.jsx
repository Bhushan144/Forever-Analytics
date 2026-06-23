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

    if (loading) return <p className="text-gray-500 animate-pulse">Loading search metrics...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Top Search Queries</h2>
                <button 
                    onClick={() => fetchSearches(true)} disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    {isRefreshing ? 'Refreshing...' : '↻ Refresh Data'}
                </button>
            </div>

            <div className="bg-white rounded border shadow-sm overflow-hidden w-full md:w-2/3 lg:w-1/2">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b text-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Search Term</th>
                            <th className="p-4 font-semibold">Search Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searches.map((search, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-gray-800 font-medium capitalize">"{search._id}"</td>
                                <td className="p-4 text-gray-600 font-bold">{search.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {searches.length === 0 && <p className="p-6 text-center text-gray-500">No searches recorded yet.</p>}
            </div>
        </div>
    );
};

export default Search;