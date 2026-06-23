import React, { useState } from 'react';
import Overview from '../components/analytics/Overview';
import Sessions from '../components/analytics/Sessions';
import Products from '../components/analytics/Products';
import Search from '../components/analytics/Search';     
import Heatmap from '../components/analytics/Heatmap';

const tabConfig = [
    {
        key: 'Overview',
        label: 'Overview',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
        )
    },
    {
        key: 'Sessions',
        label: 'Sessions',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        key: 'Heatmap',
        label: 'Heatmap',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
        )
    },
    {
        key: 'Products',
        label: 'Products',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        )
    },
    {
        key: 'Search',
        label: 'Search',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )
    }
];

const Analytics = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className='w-full max-w-7xl'>
            {/* Header */}
            <div className="mb-6">
                <h1 className='text-2xl font-bold text-gray-800 tracking-tight'>Analytics Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Track visitor behavior, product performance, and search trends.</p>
            </div>

            {/* Tab Navigation — Forever Brand Styled */}
            <div className='flex gap-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto'>
                {tabConfig.map((tab) => (
                    <button 
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                            activeTab === tab.key 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        style={activeTab === tab.key ? { borderBottom: '2px solid #C586A5' } : {}}
                    >
                        <span className={activeTab === tab.key ? 'text-[#C586A5]' : 'text-gray-400'}>
                            {tab.icon}
                        </span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Rendering based on Active Tab */}
            <div>
                {activeTab === 'Overview' && <Overview/>}
                {activeTab === 'Sessions' && <Sessions/>}
                {activeTab === 'Heatmap' && <Heatmap />}    
                {activeTab === 'Products' && <Products />}   
                {activeTab === 'Search' && <Search />}
            </div>

        </div>
    )
}

export default Analytics;