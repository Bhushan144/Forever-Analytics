import React from 'react'
import heroImg from "../assets/hero_img.png"

const Hero = () => {
    return (
        <div className='border border-gray-400 w-full h-full sm:h-[500px]  sm:flex-row flex-col flex '>
            {/* hero left side  */}
            <div className=" w-full h-full flex items-center justify-center">
                <div className="">
                    <div className=" flex items-center justify-center gap-2 py-1">
                        <p className='w-8 md:w-12 h-[2px] bg-gray-700 mt-1'></p>
                        <p className='font-light text-sm sm:text-xl'>OUR BESTSELLERS</p>
                    </div>
                    <div className=" flex items-center justify-center  py-1">
                        <p className='latestText text-3xl lg:text-5xl sm:py-3'>Latest Arrivals</p>
                    </div>
                    <div className=" flex items-center justify-center gap-2 py-1">
                        <p className='font-light text-sm sm:text-2xl'>shop now</p>
                        <div className='w-8 md:w-12 h-[2px] bg-gray-700 mt-1'></div>
                    </div>
                </div>
            </div>

            {/* hero right side */}
            <div className="w-full h-full">
                <img className='object-cover aspect-auto w-[100%] h-[81%] sm:w-full sm:h-full' src={heroImg} alt="" />
            </div>
        </div>
    )
}

export default Hero
