import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    let { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

    let location = useLocation();
    let [visible, setVisible] = useState(false);

    useEffect(() => {
        if (location.pathname.includes("Collection")) {
            setVisible(true);
        }else{
            setVisible(false);
        }
    },[location])

    //using ternary operator while returning , return only when showSearch is true
    return showSearch && visible ? (
        <div className='border-t border-b border-gray-300 bg-gray-50 text-center flex items-center justify-center gap-5'>
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 ">
                <input value={search} onChange={(event) => { setSearch(event.target.value) }} className='flex-1 outline-none bg-inherit text-sm ' type="text" placeholder='Search' />
                <img className='w-4 cursor-pointer' src={assets.search_icon} alt="" />
            </div>
            <img onClick={() => { setShowSearch(false) }} className='w-4 h-4 cursor-pointer' src={assets.cross_icon} alt="" />
        </div>
    ) : null
}

export default SearchBar
