import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';



const LatestCollection = () => {

  let { products } = useContext(ShopContext);
  // console.log(products)
  let [latestProducts,setLatestProducts] = useState([])


  useEffect(()=>{
    setLatestProducts(products.slice(0,10))
  },[products])

  return (
    <div className='text-center flex flex-col items-center justify-center py-14'>
      <Title title1={"LATEST"} title2={"COLLECTION"} />
      <p className='text-gray-600 text-lg py-1'>Discover our latest collections, blending timeless style with modern elegance.</p>

      {/* redering latest products */}
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 py-4">
        {
          latestProducts.map((item,index)=>{
            return <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
          })
        }
      </div>
    </div>
  )
}

export default LatestCollection
