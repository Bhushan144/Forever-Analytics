import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  let { productId } = useParams();

  let { products, currency,addToCart } = useContext(ShopContext)
  let [productData, setProductData] = useState(null);
  let [firstImage, setFirstImage] = useState(""); //will store the path of first image

  let [size, setSize] = useState("");

  let fetchProductData = () => {
    products.map((item) => {
      if (item._id == productId) {
        setProductData(item);
        setFirstImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <>
      <div className="w-full bg-gray-200 h-[1px] mb-7 "></div>

      <div className="flex flex-col lg:flex-row  gap-6">

        <div className="h-full flex items-center justify-center md:flex-row flex-col-reverse">
          {/* Product mini images */}
          <div className="flex p-2 flex-row md:flex-col gap-2 justify-center h-full min-w-[25%] ">
            {
              productData.image.map((item, index) => {
                return <img onClick={() => { setFirstImage(item) }} key={index} src={item} className='w-[15%] sm:w-28'></img>
              })
            }
          </div>
          {/* product main large image */}
          <div className=" sm:flex-none aspect-square flex items-center justify-center h-[300px] md:h-[540px] w-[50%] lg:w-[70%]">
            <img src={firstImage} alt="" className='aspect-square h-[90%] w-[100%] sm:h-[100%] sm:w-[100%]' />
          </div>
        </div>

        {/* product info */}
        <div className="w-full pt-4 pl-4 flex-col flex justify-start">
          <h1 className=' text-lg md:text-xl lg:text-2xl font-medium'>{productData.name}</h1>
          <div className="flex w-full aspect-square mt-1 h-[30px] gap-1 items-center justify-start" >
            <img className='w-3' src={assets.star_icon} alt="" />
            <img className='w-3' src={assets.star_icon} alt="" />
            <img className='w-3' src={assets.star_icon} alt="" />
            <img className='w-3' src={assets.star_icon} alt="" />
            <img className='w-3' src={assets.star_dull_icon} alt="" />
            <p className='pl-2'>(122)</p>
          </div>
          <div className="mt-7 mb-3">
            <p className='text-3xl font-medium'>{currency}{productData.price}</p>
          </div>
          <div className="mt-5">
            <p className='text-gray-500 text-lg'>{productData.description}</p>
          </div>
          <div className="mt-8 ">
            <p className='font-medium'>Select Size</p>
            <div className="flex gap-3 mt-3">
              {
                productData.sizes.map((item, index) => {
                  return <button onClick={() => { setSize(item) }} key={index} className={`border border-gray-300 py-2 px-4 cursor-pointer bg-gray-100 ${item === size ? "border-orange-400" : ""}`}>{item}</button>
                })
              }
            </div>
            <div className="mt-7">
              <button onClick={()=>{addToCart(productData._id,size)}} className='border active:bg-gray-700 cursor-pointer bg-black text-white px-6 py-3'>Add to cart</button>
            </div>
            <div className="w-2/3 bg-gray-300 mt-7 h-[1px]"></div>
            <div className="mt-5">
              <p className='text-sm text-gray-500'>100% Original product.</p>
              <p className='text-sm text-gray-500'>Cash on delivery is available on this product.</p>
              <p className='text-sm text-gray-500'>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>

        </div>
      </div>

        {/* discription and review secition */}
      <div className="mt-20">
        <div className="flex gap-0 ">
          <p className='border border-gray-300 px-4 py-2 w-30 text-center font-medium'>Description</p>
          <p className='border border-gray-300 px-4 py-2 w-30 text-center'>Review(122)</p>
        </div>
        <div className="w-full border border-gray-400">
          <p className='text-gray-500 text-sm p-3'>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
          <p className='text-gray-500 text-sm p-3'>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
        </div>
      </div>

        <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>

    </>
  ) : <div className='opacity-0'></div>
}

export default Product
