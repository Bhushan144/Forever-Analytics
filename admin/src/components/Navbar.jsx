import React from 'react'
import {assets} from '../assets/assets.js'
import { backendURL } from '../App.jsx'
import { toast } from 'react-toastify';

const Navbar = ({setUser}) => {

  const handleLogout =async ()=>{
    try {
      const res = await fetch(`${backendURL}/api/user/logoutAdmin`,{
        method:'POST',
        credentials:'include',
        headers:{
          'content-type':'Application/json'
        }
      })
      const data = await res.json();
      if(res.ok){
        toast.success(data.message);
        setUser(null);
      }else{
        toast.error(data.message);
      }
    } catch (error) { 
      console.log("error while loging out.",error)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 px-10 sm:px-14">
        <img className='w-[90px] sm:w-[130px]' src={assets.logo} alt="" />
        <div className="">
            <button onClick={()=>{handleLogout()}} className='sm:text-md border rounded-3xl p-1 px-4 bg-gray-600 text-white tracking-wide hover:bg-gray-500 hover:cursor-pointer'>logout</button>
        </div>
      </div>
    </>
  )
}

export default Navbar
