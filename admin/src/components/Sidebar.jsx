import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <>
            <div className="flex-col border-x border-gray-300 h-screen pl-1 md:pl-15 sm:pl-10">

                <NavLink to="/add" className={({ isActive }) => `flex gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`} >
                    <img className='w-5 h-6' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>add items</p>
                </NavLink>


                <NavLink to="/list" className={({ isActive }) => `flex gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`}>
                    <img className='w-5 h-6' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

                <NavLink to="/orders" className={({ isActive }) => `flex gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`}>
                    <img className='w-5 h-6' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>

                {/*Analytics Link */}
                <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`}>
                    {/* Inline SVG bar chart icon */}
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3v-8zm6-4h2v12H9V9zm6-6h2v18h-2V3zm6 8h2v10h-2V11z" />
                    </svg>
                    <p className='hidden md:block'>Analytics</p>
                </NavLink>
            </div>
        </>
    )
}

export default Sidebar
