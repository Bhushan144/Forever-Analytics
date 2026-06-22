import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  let { products, currency, cartItem, updateQuantity ,shippingFee,navigate} = useContext(ShopContext)

  let [cartData, setCartData] = useState([]);

  useEffect(() => {
    let tempData = [];
    for (let items in cartItem) { //here items is each product id
      for (let item in cartItem[items]) { //here item is each size in that specific product
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item]
          })
        }
      }
      setCartData(tempData);
    }
  }, [cartItem])

  return (
    <>
      <div className='pt-3 flex justify-start items-center'>
        <Title title1="Your" title2="Cart" />
      </div>
      <div className="">
        {
          cartData.map((item, index) => {

            let productData = products.find((product) => item._id === product._id);

            return <div key={index} className="pt-2 pb-2 flex justify-start sm:gap-5">
              <img className='w-20' src={productData.image} alt="" />
              <div className=" ml-2 w-1/4 sm:w-1/3 flex flex-col gap-2 sm:gap-3 sm:p-2">
                <p className="text-sm sm:text-sm md:text-lg sm:font-medium">{productData.name}</p>
                <div className="flex gap-2 sm:gap-5">
                  <p className="text-[12px] sm:text-sm md:text-lg font-light">{currency}{productData.price}</p>
                  <p className="border border-gray-300 w-[35px] flex items-center justify-center text-[12px] sm:text-sm px-1 sm:px-2 bg-gray-100 sm:font-medium">{item.size}</p>
                </div>
              </div>
              <div className=" ml-4 w-1/2 sm:w-1/2 flex items-center justify-end gap-6 sm:gap-30">
                <div className="w-10 sm:w-15 border border-gray-300">
                  <input onChange={(event) => { event.target.value === '' || event.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(event.target.value)) }} className='w-8 sm:w-15' type="number" min={1} defaultValue={item.quantity} />
                </div>
                <img onClick={() => { updateQuantity(item._id, item.size, 0) }} className='w-3 h-3 sm:w-5 sm:h-5' src={assets.bin_icon} alt="" />
              </div>
            </div>
          })
        }
      </div>


      {/* cart Totals */}
      <CartTotal/>

      {/* place order */}
      <div className="flex justify-end mt-5 mr-8">
        <button onClick={()=>{navigate('/place-order')}} className="rounded-full font-light text-sm sm:text-lg border text-white bg-black p-2 px-4">Proceed to checkout</button>
      </div>
    </>
  )
}

export default Cart
