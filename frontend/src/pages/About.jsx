import React from 'react'
import Title from '../components/Title'
import { assets } from "../assets/assets"
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <>
      <div className="w-full h-[1px] bg-gray-200"></div>
      <div className="flex justify-center mt-5">
        <Title title1={"About"} title2={"Us"} />
      </div>
      <div className="flex flex-col sm:flex-row mt-5">
        <img className='w-full h-auto sm:w-1/3' src={assets.about_img} alt="" />
        <div className="flex flex-col gap-6 p-14 text-gray-500">
          <p className="">Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
          </p>

          <p className="">Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>

          <p className="font-bold text-black">Our Mission</p>

          <p className="">Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
        </div>
      </div>
      <div className="mt-10">
        <Title title1={"Why"} title2={"Choose Us"} />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="border border-gray-300 px-16 py-18 flex flex-col gap-3 text-sm ">
          <p className="font-bold">Quality Assurance:</p>
          <p className="text-gray-500 tracking-wide">We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className="border border-gray-300 px-16 py-18 flex flex-col gap-3 text-sm ">
          <p className="font-bold">Convenience:</p>
          <p className="text-gray-500 tracking-wide">With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className="border border-gray-300 px-16 py-18 flex flex-col gap-3 text-sm ">
          <p className="font-bold">Exceptional Customer Service:</p>
          <p className="text-gray-500 tracking-wide">Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>
      </div>
      <div className="mt-18">
        <NewsLetterBox />
      </div>
    </>
  )
}

export default About
