import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <>
      <div className="w-full h-[1px] bg-gray-200"></div>
      <div className="mt-7 flex justify-center">
        <Title title1={"Contact"} title2={"Us"} />
      </div>
      <div className="flex flex-col sm:flex-row gap-15 justify-center mt-8">
        <img className='w-full md:max-w-[480px] h-auto' src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-start">
          <p className="font-medium text-xl sm:mt-10">Our Store</p>
          <p className="mt-6 text-gray-500">54709 Willms Station</p>
          <p className="text-gray-500">Suite 350, Washington, USA</p>
          <p className="text-gray-500 mt-6">Tel: (415) 555-0132</p>
          <p className="text-gray-500">Email: admin@forever.com</p>
          <p className="text-xl text-gray-500 font-medium mt-5">Careers at Forever</p>
          <p className="mt-4 sm:mt-8">Learn more about our teams and job openings.</p>
          <button className="border border-black w-max px-6 py-4 mt-8 transition-all duration-300 ease-in-out hover:text-white hover:bg-black">Explore Jobs</button>
        </div>
      </div>
      <div className="mt-15">
        <NewsLetterBox/>
      </div>
    </>
  )
}

export default Contact
