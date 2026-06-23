import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

const Heatmap = () => {
    const pages = ['/', '/collection', '/about', '/contact', '/cart'];
    
    const [selectedUrl, setSelectedUrl] = useState('/');
    const [clickCount, setClickCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);

    const fetchHeatmap = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendURL}/api/analytics/heatmap?page_url=${encodeURIComponent(selectedUrl)}`, { 
                withCredentials: true 
            });
            if (response.data.success) {
                setClickCount(response.data.count);
                drawHeatmap(response.data.clicks);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Heatmap Fetch Error:", error);
            toast.error("Failed to load heatmap data.");
        } finally {
            setLoading(false);
        }
    };

    // Refetch whenever the dropdown changes
    useEffect(() => {
        fetchHeatmap();
    }, [selectedUrl]);

    // Native HTML5 Canvas Renderer (Handling Thermal Clustering natively!)
    const drawHeatmap = (clicks) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // 1. Clear the canvas for fresh drawing
        ctx.clearRect(0, 0, width, height);

        // 2. Draw a clean background with wireframe gridlines
        ctx.fillStyle = '#f8fafc'; // Light gray slate
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for(let i=0; i<width; i+=50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
        for(let i=0; i<height; i+=50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

        // 3. THE MAGIC: This tells the canvas to physically mix overlapping colors.
        // As transparent colors stack on top of each other, they multiply into deep, dark "hot" spots.
        ctx.globalCompositeOperation = 'multiply';

        // 4. Paint the clicks
        clicks.forEach(click => {
            if (!click.metadata) return;
            
            // Map percentage to physical canvas pixels
            const x = click.metadata.x_percent * width;
            const y = click.metadata.y_percent * height;

            // Create a soft, fading thermal dot
            const radius = 35; 
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            // Thermal colors: Red center fading out to orange and transparent blue
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');     // Tailwind Red-500
            gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');  // Tailwind Amber-500
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');      // Transparent Blue

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Reset composition mode so future draws aren't affected
        ctx.globalCompositeOperation = 'source-over';
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold text-gray-700">Click Density Heatmap</h2>
                
                <div className="flex gap-4 items-center">
                    <select 
                        value={selectedUrl} 
                        onChange={(e) => setSelectedUrl(e.target.value)}
                        className="p-2 border border-gray-300 rounded shadow-sm outline-none text-sm bg-white"
                    >
                        {pages.map(page => (
                            <option key={page} value={page}>{page === '/' ? '/ (Home)' : page}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={fetchHeatmap} disabled={loading}
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? 'Plotting...' : '↻ Refresh Data'}
                    </button>
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-4">
                Displaying <span className="font-bold text-blue-600">{clickCount}</span> recorded clicks for the selected route.
            </p>

            {/* The Canvas Wrapper */}
            <div className="w-full max-w-4xl border-4 border-gray-200 rounded shadow-sm bg-white overflow-hidden relative">
                {/* Fixed internal resolution (720p) scales perfectly to any responsive width */}
                <canvas 
                    ref={canvasRef} 
                    width="1280" 
                    height="720" 
                    className="w-full h-auto block"
                ></canvas>
                
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                        <span className="text-gray-800 font-bold animate-pulse">Rendering thermal layer...</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">* Thermal layer represents normalized viewport coordinates.</p>
        </div>
    );
};

export default Heatmap;