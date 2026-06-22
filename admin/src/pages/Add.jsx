import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { backendURL } from '../App.jsx'
import { toast } from 'react-toastify'

const Add = () => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [price, setPrice] = useState("");

  const [sizes, setSizes] = useState([]);

  const [bestseller, setBestseller] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("price", price);
      formData.append("bestseller", bestseller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);


      const res = await fetch(backendURL + '/api/product/add', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const data = await res.json();
      // console.log(data)
      if (data.message) {
        toast.success("product added successfully.")

        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setName("");
        setDescription("");
        setBestseller(false);
        setPrice('');
        setSizes([]);

      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className="px-20 mt-3">
        <form onSubmit={onSubmitHandler} className='text-gray-700'>
          <div className="">
            <p className='text-lg'>Upload Image</p>
            <div className="flex gap-3 mt-3">
              <label htmlFor="image1">
                <input onChange={(e) => { setImage1(e.target.files[0]) }} id='image1' type="file" hidden />
                <img className='w-23 cursor-pointer' src={`${image1 ? URL.createObjectURL(image1) : assets.upload_area}`} alt="" />
              </label>

              <label htmlFor="image2">
                <input onChange={(e) => { setImage2(e.target.files[0]) }} id='image2' type="file" hidden />
                <img className='w-23 cursor-pointer' src={`${image2 ? URL.createObjectURL(image2) : assets.upload_area}`} alt="" />
              </label>

              <label htmlFor="image3">
                <input onChange={(e) => { setImage3(e.target.files[0]) }} id='image3' type="file" hidden />
                <img className='w-23 cursor-pointer' src={`${image3 ? URL.createObjectURL(image3) : assets.upload_area}`} alt="" />
              </label>

              <label htmlFor="image4">
                <input onChange={(e) => { setImage4(e.target.files[0]) }} id='image4' type="file" hidden />
                <img className='w-23 cursor-pointer' src={`${image4 ? URL.createObjectURL(image4) : assets.upload_area}`} alt="" />
              </label>
            </div>
          </div>

          <div className="mt-5">
            <p className='text-lg'>Product Name</p>
            <div className="">
              <input onChange={(e) => { setName(e.target.value) }} value={name} className='p-2 w-130' type="text" placeholder='Type here' />
            </div>
          </div>

          <div className="mt-5">
            <p className='text-lg'>Product description</p>
            <div className="">
              <textarea onChange={(e) => { setDescription(e.target.value) }} value={description} className='w-130 p-2' name="" id="" placeholder='write content here'></textarea>
            </div>
          </div>

          <div className="flex gap-10 mt-3">
            <div className="">
              <p className='text-lg'>Product category</p>
              <select onChange={(e) => { setCategory(e.target.value) }} className='py-2 px-2 text-md w-30 flex items-center justify-center' name="category" id="">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div className="">
              <p className='text-lg'>Sub category</p>
              <select onChange={(e) => { setSubcategory(e.target.value) }} className='py-2 px-2 text-md w-30 flex items-center justify-center' name="subcategory" id="">
                <option value="Topwear">Topwear</option>
                <option value="BottomWear">BottomWear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>

            <div className="">
              <p className='text-lg'>Product price</p>
              <div className="">
                <input onChange={(e) => { setPrice(e.target.value) }} value={price} className='py-2 px-2 text-md w-30 flex items-center justify-center' type="Number" placeholder='25' />
              </div>
            </div>

          </div>

          <div className="mt-5">
            <p className='text-lg'>Product sizes</p>
            <div className=" flex gap-4 mt-1">
              <p onClick={() => { setSizes(prev => prev.includes('S') ? prev.filter(item => item !== 'S') : [...prev, 'S']) }} className={`border py-2 px-2 w-12 bg-slate-200  cursor-pointer flex items-center justify-center ${sizes.includes('S') ? '!bg-pink-100 !border-pink-200' : 'border-none'}`}>S</p>
              <p onClick={() => { setSizes(prev => prev.includes('M') ? prev.filter(item => item !== 'M') : [...prev, 'M']) }} className={`border py-2 px-2 w-12 bg-slate-200  cursor-pointer flex items-center justify-center ${sizes.includes('M') ? '!bg-pink-100 !border-pink-200' : 'border-none'}`}>M</p>
              <p onClick={() => { setSizes(prev => prev.includes('L') ? prev.filter(item => item !== 'L') : [...prev, 'L']) }} className={`border py-2 px-2 w-12 bg-slate-200  cursor-pointer flex items-center justify-center ${sizes.includes('L') ? '!bg-pink-100 !border-pink-200' : 'border-none'}`}>L</p>
              <p onClick={() => { setSizes(prev => prev.includes('XL') ? prev.filter(item => item !== 'XL') : [...prev, 'XL']) }} className={`border py-2 px-2 w-12 bg-slate-200  cursor-pointer flex items-center justify-center ${sizes.includes('XL') ? '!bg-pink-100 !border-pink-200' : 'border-none'}`}>XL</p>
              <p onClick={() => { setSizes(prev => prev.includes('XXL') ? prev.filter(item => item !== 'XXL') : [...prev, 'XXL']) }} className={`border py-2 px-2 w-12 bg-slate-200  cursor-pointer flex items-center justify-center ${sizes.includes('XXL') ? '!bg-pink-100 !border-pink-200' : 'border-none'}`}>XXL</p>
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <input onChange={(e) => { setBestseller(!bestseller) }} type="checkbox" id='bestseller' />
            <label className='text-lg cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
          </div>

          <div className="flex justify-start">
            <button disabled={loading} type='submit' className='cursor-pointer w-28 h-full rounded-lg py-3 px-4 mt-4 bg-black text-white'>ADD</button>
          </div>

        </form>
      </div>
    </>
  )
}

export default Add;
