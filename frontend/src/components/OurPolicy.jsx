import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-center gap-18 md:gap-28 md:py-22 py-12'>
        <div className="flex flex-col items-center justify-center gap-y-1">
            <img className='w-12' src={assets.exchange_icon} alt="" />
            <p className='font-semibold tracking-wide'>Easy Exchange Policy</p>
            <p className='text-gray-400 tracking-wide'>We offer hassle free exchange policy</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-1">
            <img className='w-12' src={assets.quality_icon} alt="" />
            <p className='font-semibold tracking-wide'>Easy Exchange Policy</p>
            <p className='text-gray-400 tracking-wide'>We offer hassle free exchange policy</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-1">
            <img className='w-12' src={assets.support_img} alt="" />
            <p className='font-semibold tracking-wide'>Easy Exchange Policy</p>
            <p className='text-gray-400 tracking-wide'>We offer hassle free exchange policy</p>
        </div>
    </div>
  )
}

export default OurPolicy
