import React, { useState } from 'react';
import Overview from '../components/analytics/Overview';
import Sessions from '../components/analytics/Sessions';
import Products from '../components/analytics/Products';
import Search from '../components/analytics/Search';     
import Heatmap from '../components/analytics/Heatmap';

const Analytics = () => {
    // Tab Navigation State
    const [activeTab, setActiveTab] = useState('Overview');
    
    // List of available tabs
    const tabs = ['Overview', 'Sessions', 'Heatmap', 'Products', 'Search'];

    return (
        <div className='w-full'>
            <h1 className='text-2xl font-bold mb-4'>Analytics Dashboard</h1>

            {/* Tab Navigation */}
            <div className='flex gap-4 border-b-2 border-gray-200 mb-6 pb-2 text-sm md:text-base overflow-x-auto'>
                {tabs.map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-medium whitespace-nowrap transition-colors ${
                            activeTab === tab 
                            ? 'text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[10px]' 
                            : 'text-gray-500 hover:text-black pb-2'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Rendering based on Active Tab */}
            <div className='mt-4'>
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