import React, { use, useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  let [showFilter, setShowFilter] = useState(false)
  let { products ,search,showSearch} = useContext(ShopContext);
  let [filterProducts, setFilterProducts] = useState([])

  let [category, setCategory] = useState([])
  let [subCategory,setSubCategory] = useState([])

  let [sortType ,setSortType] = useState("");


  let toggleCategory = (event) => {
    if (category.includes(event.target.value)) {
      setCategory(category.filter((item) => {
        return item !== event.target.value;
      }))
    } else {
      setCategory((prev) => {
        return [...prev, event.target.value]
      })
    }
  }

  let toggleSubCategory = (event) => {
    if (subCategory.includes(event.target.value)) {
      setSubCategory(subCategory.filter((item) => {
        return item !== event.target.value;
      }))
    } else {
      setSubCategory((prev) => {
       return [...prev, event.target.value]
      })
    }
  }

  let applyFilter = ()=>{
    let productsCopy = products.slice();  //we will get the complete products array

    if(showSearch && search){
        productsCopy = productsCopy.filter((item)=>{
            if(item.name.toLowerCase().includes(search.toLowerCase())){
              return true;
            }else{
              return false;
            }
        })
    }

    if(category.length > 0){
      productsCopy = productsCopy.filter((item)=>{
        if(category.includes(item.category)){
          return true;
        }else{
          return false;
        }
      })
    }

    if(subCategory.length > 0){
      productsCopy = productsCopy.filter((item)=>{
        if(subCategory.includes(item.subcategory)){
          return true;
        }else{
          return false;
        }
      })
    }

    setFilterProducts(productsCopy);
  }

  let productSort = ()=>{
      let filterProductCopy = filterProducts.slice(); //creating copy of filter products

      switch(sortType){
        case 'low-high':
          setFilterProducts(filterProductCopy.sort((a,b)=>{
            return a.price - b.price;
          }));
          break;

        case 'high-low':
          setFilterProducts(filterProductCopy.sort((a,b)=>{
            return b.price - a.price;
          }));
          break;

        default:
          applyFilter();
          break;  
      }
  }


  //when component render first time,this will run cause react run every useeffect for once whether it's dependencies are change or not , hence when initially for the empty catagory and subcatagory state all products will be rendered because we have rendered the productsCopy using setFilterProducts
  useEffect(()=>{   
    applyFilter();
  },[category,subCategory,showSearch,search,products])

  useEffect(()=>{
    productSort();
  },[sortType]);

  return (
    <>
      <div className='w-full h-[1px] bg-gray-200 my-2'></div>
      <div className='flex flex-col sm:flex-row w-full py-5 gap-y-4'>
        {/* left side */}
        <div className="w-full sm:w-[25%]  flex flex-col gap-y-3">
          <div onClick={() => { setShowFilter(!showFilter) }} className="cursor-pointer">
            <p className='text-xl sm:text-xl font-medium tracking-wide flex items-center justify-start gap-3'>Filters
              <img className={`w-3 h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
            </p>
          </div>
          {/* categories */}
          <div className={`border-1 pl-3 pt-2 border-gray-300 w-[90%] h-[140px] sm:block ${showFilter ? '' : 'hidden'} `}>
            <p className=' sm:text-md font-medium '>CATEGORIES</p>
            <div className="pt-2 flex flex-col  font-light text-gray-800 justify-center items-start gap-2">
              <p className='flex gap-2'><input onChange={(event)=>{toggleCategory(event)}} type="checkbox" value={'Men'} />Men</p>
              <p className='flex gap-2'><input onChange={(event)=>{toggleCategory(event)}} type="checkbox" value={'Women'} />Women</p>
              <p className='flex gap-2'><input onChange={(event)=>{toggleCategory(event)}} type="checkbox" value={'Kids'} />Kids</p>
            </div>
          </div>
          {/* subcatogories */}
          <div className={`border-1 pl-3 pt-2 border-gray-300 w-[90%] h-[140px] sm:block ${showFilter ? '' : 'hidden'} `}>
            <p className=' sm:text-md font-medium '>TYPE</p>
            <div className="pt-2 flex flex-col font-light text-gray-800 justify-center items-start gap-2 ">
              <p className='flex gap-2'><input onChange={(event)=>{toggleSubCategory(event)}} type="checkbox" value={'Topwear'} /><span>Topwear</span></p>
              <p className='flex gap-2'><input onChange={(event)=>{toggleSubCategory(event)}} type="checkbox" value={'Bottomwear'} /><span>Bottomwear</span></p>
              <p className='flex gap-2'><input onChange={(event)=>{toggleSubCategory(event)}} type="checkbox" value={'Winterwear'} /><span>Winterwear</span></p>
            </div>
          </div>
        </div>

        {/* rightside */}
        <div className="w-full sm:w-[75%]">
          {/* right top */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-base sm:text-2xl  mb-4">
            <Title title1={'All'} title2={'COLLECTIONS'} />
            <select onChange={(event)=>{setSortType(event.target.value)}} className='text-sm border-2 border-gray-300 px-1 h-10'>
              <option value="relavent">sort by : Relavent</option>
              <option value="low-high">sort by : Low to High</option>
              <option value="high-low">sort by : High to Low</option>
            </select>
          </div>

          {/* map items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6">
            {
              filterProducts.map((item, index) => {
                return <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Collection
