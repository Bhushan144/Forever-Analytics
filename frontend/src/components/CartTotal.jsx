import React, { use, useEffect, useState } from 'react'
import Title from './Title'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {

    let { products, currency, cartItem, updateQuantity, shippingFee, getCartAmount } = useContext(ShopContext)

    let [cartAmount, setCartAmount] = useState(0);

    useEffect(() => {
        let fetchCartAmount = async () => {
            let amount = await getCartAmount();
            setCartAmount(amount);
        }
        fetchCartAmount();
    }, [getCartAmount])

    return (
        <>
            <div className="flex flex-col items-end">
                <div className="flex  mr-10 sm:mr-20">
                    <Title title1={'CART'} title2={'TOTAL'} />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 mt-5 pb-2">
                    <div className="flex justify-between items-center pt-2 pb-1 pl-3 pr-10 sm:pr-5">
                        <p className="">Subtotal</p>
                        <p className="">{currency}{cartAmount}.00</p>
                    </div>
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    <div className="flex justify-between items-center pt-2 pb-1 pl-3 pr-10 sm:pr-5">
                        <p className="">Shipping Fee</p>
                        <p className="">{`${currency}${cartAmount === 0 ? "0.00" : shippingFee.toFixed(2) }`}</p>
                    </div>
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    <div className="flex justify-between items-center pt-2 pb-1 pl-3 pr-10 sm:pr-5">
                        <p className="font-medium">Total</p>
                        <p className="">
                            {`${currency}${cartAmount === 0 ? "0.00" : (cartAmount + shippingFee).toFixed(2)}`}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartTotal
