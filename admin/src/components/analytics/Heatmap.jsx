import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';

const Heatmap = () => {
    // Pages must match EXACT frontend route paths (case-sensitive!)
    const pages = [
        { url: '/', label: '/ (Home)' },
        { url: '/Collection', label: '/Collection' },
        { url: '/About', label: '/About' },
        { url: '/Contact', label: '/Contact' },
        { url: '/Cart', label: '/Cart' },
    ];
    
    const [selectedUrl, setSelectedUrl] = useState('/');
    const [clickCount, setClickCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);

    // Stabilize fetchHeatmap with useCallback to fix stale closure issue
    const fetchHeatmap = useCallback(async () => {
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
    }, [selectedUrl]);

    // Refetch whenever the dropdown changes
    useEffect(() => {
        fetchHeatmap();
    }, [fetchHeatmap]);

    // Native HTML5 Canvas Renderer with Thermal Clustering
    const drawHeatmap = (clicks) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // 1. Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 2. Background with wireframe gridlines
        ctx.fillStyle = '#fdfafc';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#f3e8ef';
        ctx.lineWidth = 1;
        for(let i = 0; i < width; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
        for(let i = 0; i < height; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

        // 3. Page label watermark in center
        ctx.fillStyle = 'rgba(197, 134, 165, 0.08)';
        ctx.font = 'bold 48px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedUrl === '/' ? 'HOME' : selectedUrl.replace('/', '').toUpperCase(), width / 2, height / 2);

        // 4. Multiply composite for thermal stacking
        ctx.globalCompositeOperation = 'multiply';

        // 5. Paint the clicks
        clicks.forEach(click => {
            if (!click.metadata) return;
            
            const x = click.metadata.x_percent * width;
            const y = click.metadata.y_percent * height;

            const radius = 35; 
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            // Thermal colors using brand palette tones
            gradient.addColorStop(0, 'rgba(197, 134, 165, 0.5)');     // Brand rose
            gradient.addColorStop(0.4, 'rgba(239, 68, 68, 0.3)');     // Red hot
            gradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');   // Amber warm
            gradient.addColorStop(1, 'rgba(167, 139, 186, 0)');       // Transparent purple

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Reset composition mode
        ctx.globalCompositeOperation = 'source-over';

        // 6. "No clicks" message if empty
        if (clicks.length === 0) {
            ctx.fillStyle = '#aaa';
            ctx.font = '16px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No click data recorded for this page yet.', width / 2, height / 2 + 40);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Click Density Heatmap</h2>
                
                <div className="flex gap-3 items-center">
                    <select 
                        value={selectedUrl} 
                        onChange={(e) => setSelectedUrl(e.target.value)}
                        className="p-2 px-3 rounded-lg text-sm bg-white shadow-sm"
                        style={{ border: '1px solid #C586A5', outline: 'none', color: '#333' }}
                    >
                        {pages.map(page => (
                            <option key={page.url} value={page.url}>{page.label}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={fetchHeatmap} disabled={loading}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
                        style={{ 
                            border: '1px solid #C586A5', 
                            color: '#C586A5',
                            background: loading ? '#ffebf5' : 'white'
                        }}
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Plotting...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Click count badge */}
            <div className="flex items-center gap-2 mb-4">
                <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#ffebf5', color: '#C586A5' }}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672z" />
                    </svg>
                    {clickCount} click{clickCount !== 1 ? 's' : ''} recorded
                </span>
                <span className="text-gray-400 text-sm">for <b className="text-gray-600">{selectedUrl}</b></span>
            </div>

            {/* Canvas Wrapper */}
            <div 
                className="w-full max-w-4xl rounded-xl shadow-sm overflow-hidden relative"
                style={{ border: '2px solid #f3e8ef' }}
            >
                <canvas 
                    ref={canvasRef} 
                    width="1280" 
                    height="720" 
                    className="w-full h-auto block"
                ></canvas>
                
                {loading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <div className="flex items-center gap-2 font-medium" style={{ color: '#C586A5' }}>
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Rendering thermal layer...
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-gray-400">Intensity:</span>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(167, 139, 186, 0.3)' }}></div>
                    <span className="text-xs text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.5)' }}></div>
                    <span className="text-xs text-gray-400">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(197, 134, 165, 0.8)' }}></div>
                    <span className="text-xs text-gray-400">High</span>
                </div>
                <span className="text-xs text-gray-300 ml-auto italic">* Coordinates normalized to viewport dimensions</span>
            </div>
        </div>
    );
};

export default Heatmap;