import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchProducts = async (showRefreshSpinner = false) => {
        if (showRefreshSpinner) setIsRefreshing(true);
        try {
            const response = await axios.get(`${backendURL}/api/analytics/products`, { withCredentials: true });
            if (response.data.success) {
                setProducts(response.data.products);
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
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="h-5 bg-gray-100 rounded w-52 animate-pulse"></div>
                </div>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-6 p-4 border-b border-gray-50 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-40"></div>
                        <div className="h-4 bg-gray-100 rounded w-16"></div>
                        <div className="h-4 bg-gray-100 rounded w-16"></div>
                        <div className="h-4 bg-gray-100 rounded w-28"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Find max views for the visual bar scaling
    const maxViews = products.length > 0 ? Math.max(...products.map(p => p.views)) : 1;

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Product Funnel Performance</h2>
                <button 
                    onClick={() => fetchProducts(true)} disabled={isRefreshing}
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
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: '#ffebf5' }}>
                            <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">#</th>
                            <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Product Name</th>
                            <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Views</th>
                            <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Added to Cart</th>
                            <th className="p-4 font-semibold text-gray-700 whitespace-nowrap min-w-[180px]">Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => {
                            const rate = product.conversionRate || 0;
                            const barColor = rate > 20 ? '#6BAD8E' : rate > 10 ? '#C586A5' : '#D4956B';
                            const barBg = rate > 20 ? '#edf7f1' : rate > 10 ? '#ffebf5' : '#fdf2ec';

                            return (
                                <tr key={index} className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <td className="p-4">
                                        <span 
                                            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                            style={{ backgroundColor: index < 3 ? '#C586A5' : '#ccc' }}
                                        >
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-800 font-medium">
                                        {product.productName || 'Unknown Product'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700 font-semibold">{product.views}</span>
                                            {/* Mini bar showing relative view volume */}
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ 
                                                        width: `${(product.views / maxViews) * 100}%`,
                                                        backgroundColor: '#A78BBA'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" style={{ color: '#6BAD8E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                            </svg>
                                            <span className="text-gray-700 font-medium">{product.carts}</span>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold" style={{ color: barColor }}>
                                                {rate.toFixed(1)}%
                                            </span>
                                            {/* Visual conversion bar */}
                                            <div className="flex-1 max-w-[80px] h-2 rounded-full overflow-hidden" style={{ backgroundColor: barBg }}>
                                                <div 
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{ 
                                                        width: `${Math.min(rate, 100)}%`,
                                                        backgroundColor: barColor
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="p-12 text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No product views recorded yet</p>
                        <p className="text-gray-400 text-sm mt-1">Product analytics will populate as visitors view and interact with products.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;