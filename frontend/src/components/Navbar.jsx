import React, { useContext, useEffect, useState } from 'react'
import { assets } from "../assets/assets"
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate(); 

  const [visible, setVisible] = useState(false);

  let { setShowSearch, getCartCount, user, logout } = useContext(ShopContext);

  const handleLogout = async () => {
    logout();
  }

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to={`/`}><img className='w-36' src={assets.logo} alt="" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        {/* we used navlink because we needed an property active which is added by navlink to active element */}
        <NavLink className='flex flex-col items-center gap-1' to="/">
          <p className=''>HOME</p>
          <hr className='w-2/4 h-[1.5px] bg-gray-500 hidden' />
        </NavLink>
        <NavLink className='flex flex-col items-center gap-1' to="/Collection">
          <p className=''>COLLECTION</p>
          <hr className='w-2/4 h-[1.5px] bg-gray-500 hidden' />
        </NavLink>
        <NavLink className='flex flex-col items-center gap-1' to="/About">
          <p className=''>ABOUT</p>
          <hr className='w-2/4 h-[1.5px] bg-gray-500 hidden' />
        </NavLink>
        <NavLink className='flex flex-col items-center gap-1' to="/Contact">
          <p className=''>CONTACT</p>
          <hr className='w-2/4 h-[1.5px] bg-gray-500 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center justify-between gap-6'>

        <img onClick={() => { setShowSearch(true) }} className='w-[20px] cursor-pointer' src={assets.search_icon} alt="" />

        {!user ? (
          // If logged out, show a simple link to the login page
          <Link to='/login'><img className='w-[20px] cursor-pointer' src={assets.profile_icon} alt="" /></Link>
        ) : (
          // If logged in, show the icon with a functional dropdown
          <div className="group relative">
            <img className='w-[20px] cursor-pointer' src={assets.profile_icon} alt="" />
            <div className="hidden group-hover:block absolute right-0 pt-4 z-10">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className='cursor-pointer hover:text-black'>My profile</p>
                <p onClick={() => navigate('/Orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <hr />
                <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          </div>
        )}

        <Link to="/Cart" className='relative'>
          <img className="w-[20px] cursor-pointer" src={assets.cart_icon} alt="" />
          <p className=" flex items-center justify-center absolute right-[-5px] bottom-[-5px] w-4 text-center bg-black text-white aspect-square rounded-full text-[8px]">{getCartCount()}</p>
        </Link>

        <img onClick={() => setVisible(true)} className='w-5 cursor-pointer sm:hidden' src={assets.menu_icon} alt="" />
      </div>

      {/* side bar menu for small screens */}
      <div className={`absolute top-0 bottom-0 left-0 overflow-hidden bg-white transition-all  ${visible ? "w-full" : "w-0"}`}>
        <div className="flex flex-col text-gray-600" >
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className='h-4 ' src={assets.dropdown_icon} alt="" />
            <p>back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border-y" to="/">HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border-y" to="/Collection">COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border-y" to="/About">ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border-y" to="/Contact">CONTACT</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
