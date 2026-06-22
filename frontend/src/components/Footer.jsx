import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <>
            <div className='w-full flex flex-col lg:flex-row items-start gap-10 justify-center mt-25 p-2 mb-5'>
                <div className="lg:w-[40%] w-full">
                    <img className='w-[150px]' src={assets.logo} alt="" />
                    <p className='text-gray-500 mt-4 text-sm'>Discover the latest trends in fashion with us. From timeless classics to bold new styles, we bring you high-quality clothing for every occasion. Shop with confidence, enjoy fast delivery, and experience top-notch customer support. Stay stylish, stay unique — only at TrendWear.</p>
                </div>
                <div className="lg:w-[60%] w-full flex flex-col lg:flex-row gap-y-10 justify-end gap-x-32">
                    <div className="">
                        <p className='font-bold text-lg tracking-wider'>COMPANY</p>
                        <ul className='mt-5 text-sm text-gray-500'>
                            <li>Home</li>
                            <li>About us</li>
                            <li>Delivery</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="mr-10">
                        <p className='font-bold text-lg tracking-wider'>GET IN TOUCH</p>
                        <ul className='mt-5 text-sm text-gray-500'>
                            <li>+1-000-000-000</li>
                            <li>pagarbhushan02@gmail.com</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='w-full h-[1px] bg-gray-300 mb-5'></div>

            <div className="my-5 flex justify-center items-center text-gray-800 text-sm ">
                <p>Copyright 2024@Forever - All Right Reserved.</p>
            </div>
        </>
    )
}

export default Footer
