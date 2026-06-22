import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';

const Orders = () => {

  let { currency, products } = useContext(ShopContext);

  return (
    <>
      <div className="">
        <div className="">
          <Title title1={"My"} title2={"Orders"} />
        </div>
        <div className="">
          {
            products.slice(1, 4).map((item, index) => {
              return <div key={index} className="">
                <div className="w-full h-[1px] bg-gray-200 mt-5"></div>
                <div key={index} className=" p-2 mt-5 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 flex gap-5">
                    <img className='w-20 aspect-square' src={item.image[0]} alt="" />
                    <div className="flex flex-col text-sm gap-1">
                      <p className="font-medium text-gray-700 text-lg">{item.name}</p >
                      <div className="flex gap-2">
                        <p className="">{currency}{item.price}</p>
                        <p className="">Quantity:1</p>
                        <p className="">Size:L</p>
                      </div>
                      <p className="text-gray-700">Date:<span className='text-gray-400'>July 31 2025</span></p>
                      <p className="text-gray-700">payment: <span className='text-gray-400'>COD</span></p>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 flex justify-start sm:justify-between items-center mt-4 sm:mt-0">
                    <div className="flex items-center justify-center gap-2 w-1/2">
                      <p className="w-3 h-3 bg-green-400 rounded-full "></p>
                      <p className="">Order Placed</p>
                    </div>
                    <div className="">
                      <button className="border border-gray-300 px-3 py-1.5 font-medium text-sm">Track Order</button>
                    </div>
                  </div>
                  
                </div>
              </div>
            })
          }
        </div>
      </div>
    </>
  )
}

export default Orders
