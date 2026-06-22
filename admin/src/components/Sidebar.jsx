import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <>
            <div className="flex-col border-x border-gray-300 h-screen pl-1 md:pl-15 sm:pl-10">

                <NavLink to="/add" className={({ isActive }) =>`flex gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`} >
                    <img className='w-5 h-6' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>add items</p>
                </NavLink>


                <NavLink to="/list" className={({ isActive }) =>`flex gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`}>
                    <img className='w-5 h-6' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

                <NavLink to="/orders" className={({ isActive }) => `flex gap-4 mt-4 border border-gray-300 p-2 sm:px-8 px-2 border-r-0 ${isActive ? "active" : ""}`}>
                    <img className='w-5 h-6' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
            </div>
        </>
    )
}

export default Sidebar
