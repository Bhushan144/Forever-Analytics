import React, { useState } from 'react';
import Overview from '../components/analytics/Overview';

const Analytics = ({ token }) => {
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
                {activeTab === 'Overview' && <Overview token={token} />}
                
                {/* Placeholders for our next tasks! We will replace these with real components */}
                {activeTab === 'Sessions' && <p className="text-gray-500">Sessions component coming in Task 8...</p>}
                {activeTab === 'Heatmap' && <p className="text-gray-500">Heatmap component coming in Task 9...</p>}
                {activeTab === 'Products' && <p className="text-gray-500">Products component coming in Task 9...</p>}
                {activeTab === 'Search' && <p className="text-gray-500">Search component coming in Task 9...</p>}
            </div>

        </div>
    )
}

export default Analytics;