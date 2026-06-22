import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const BestSeller = () => {
    let {products} = useContext(ShopContext)
    let [bestSellerProducts,setBestSellerProducts] = useState([]);

    useEffect(()=>{
        let bestProduct = products.filter((item)=>{
            return item.bestseller === true;
        });
        setBestSellerProducts(bestProduct.slice(0,5))
    },[products])

    return (
        <div className='flex flex-col items-center justify-center'>
            <Title title1="BEST" title2="SELLER" />
            <p className="text-gray-600 text-lg pb-2">Explore our best-selling products, trusted and loved by countless happy customers.</p>

            {/* rendering best selled products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4 gap-y-6">
                {
                    bestSellerProducts.map((item,index)=>{
                        return <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    })
                }
            </div>
        </div>
    )
}

export default BestSeller
