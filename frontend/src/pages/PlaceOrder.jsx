import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const PlaceOrder = () => {

  let [method, setMethod] = useState('cod');

  let { navigate } = useContext(ShopContext);

  return (
    <div className='w-full mt-10 flex flex-col sm:flex-row'>
      {/* left side  */}
      <div className=" flex flex-col gap-4 sm:w-1/2">
        <div className="">
          <Title title1={"Delivery"} title2={"Information"} />
        </div>
        <div className="flex gap-3">
          <input className='w-full border p-2 outline-none border-gray-300' type="text" placeholder='First name' />
          <input className='w-full border p-2 outline-none border-gray-300' type="text" placeholder='Last name' />
        </div>

        <input className='w-full border p-2 outline-none border-gray-300' type="email" placeholder='Email Address' />

        <input className='w-full border p-2 outline-none border-gray-300' type="text" placeholder='Street' />

        <div className="flex gap-3">
          <input className='w-full border p-2 outline-none border-gray-300' type="text" placeholder='City' />
          <input className='w-full border p-2 outline-none border-gray-300' type="text" placeholder='State' />
        </div>
        <div className="flex gap-3">
          <input className='w-full border p-2 outline-none border-gray-300' type="number" placeholder='Zipcode' />
          <input className='w-full border p-2 outline-none border-gray-300' type="text" placeholder='Country' />
        </div>

        <input className='w-full border p-2 outline-none border-gray-300' type="Phone" placeholder='Phone' />

      </div>

      {/* right side  */}
      <div className=" sm:w-1/2">
        <div className="w-full ml-5 ">
          <CartTotal />
        </div>

        <div className="flex justify-end mt-5">
          <Title title1={"Payment"} title2={"Method"} />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 items-center lg:justify-end mt-2">
          <div onClick={() => { setMethod("stripe") }} className="border border-gray-300 flex items-center gap-3 px-2 py-1 w-full h-10 ml-3 lg:ml-4">
            <p className={`border border-gray-300 rounded-full p-2 w-1 h-1 ${method === 'stripe' ? 'bg-green-400' : ""}`}></p>
            <img className='w-15' src={assets.stripe_logo} alt="" />
          </div>
          <div onClick={() => { setMethod("razorpay") }} className="border border-gray-300 flex items-center gap-3 px-2 py-1 w-full h-10 ml-3 lg:ml-4">
            <p className={`border border-gray-300 rounded-full p-2 w-1 h-1 ${method === 'razorpay' ? 'bg-green-400' : ""}`}></p>
            <img className='w-20' src={assets.razorpay_logo} alt="" />
          </div>
          <div onClick={() => { setMethod("cod") }} className="border border-gray-300 flex items-center gap-3 px-2 py-1 w-full h-10 ml-3 lg:ml-4">
            <p className={`border border-gray-300 rounded-full p-2 w-1 h-1 ${method === 'cod' ? 'bg-green-400' : ""}`}></p>
            <p className='text-sm'>Cash On Delivery</p>
          </div>
        </div>

        <div className="flex justify-end items-center mt-5">
          <button onClick={() => { navigate('/Orders') }} className='border bg-black text-white px-5 py-3 sm:py-2 w-50 text-sm  sm:text-lg'>Place Order</button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
