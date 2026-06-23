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

    if (loading) return <p className="text-gray-500 animate-pulse">Loading product metrics...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Product Funnel Performance</h2>
                <button 
                    onClick={() => fetchProducts(true)} disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {isRefreshing ? 'Refreshing...' : '↻ Refresh Data'}
                </button>
            </div>

            <div className="bg-white rounded border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b text-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Product Name</th>
                            <th className="p-4 font-semibold">Total Views</th>
                            <th className="p-4 font-semibold">Added to Cart</th>
                            <th className="p-4 font-semibold">Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-gray-800 font-medium">{product.productName}</td>
                                <td className="p-4 text-gray-600">{product.views}</td>
                                <td className="p-4 text-gray-600">{product.carts}</td>
                                <td className="p-4 text-gray-800 font-bold">
                                    <span className={product.conversionRate > 10 ? 'text-green-600' : 'text-orange-500'}>
                                        {product.conversionRate.toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <p className="p-6 text-center text-gray-500">No product views recorded yet.</p>}
            </div>
        </div>
    );
};

export default Products;