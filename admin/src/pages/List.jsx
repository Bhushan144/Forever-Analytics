import React, { useEffect, useState } from 'react';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const List = ({ currency }) => {
  const [list, setList] = useState([]);
  // State to track the ID of the product being deleted
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`${backendURL}/api/product/list`);
      const data = await res.json();
      if (data.success) {
        setList(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch product list:", error);
      toast.error("An error occurred while fetching the list.");
    }
  };

  const removeProduct = async (id) => {
    // Set the ID of the product being deleted to show the loader
    setDeletingProductId(id);
    try {
      let res = await fetch(backendURL + '/api/product/remove', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'id': id
        })
      });
      let data = await res.json();
      if (data.success) {
        toast.success(data.message);
        // fetchData is called to refresh the list after successful deletion
        await fetchData(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Failed to remove product:", error);
        toast.error("An error occurred while removing the product.");
    } finally {
      // Reset the state to hide the loader, regardless of success or failure
      setDeletingProductId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='w-full p-4 box-border'>
      <p className='text-lg font-semibold mb-4'>All Products List</p>
      <div className="w-full">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 py-3 px-4 border-b border-gray-300 text-sm font-semibold bg-gray-50 rounded-t-md">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {/* Product List Container */}
        <div className="flex flex-col gap-3 mt-3 md:mt-0">
          {list.length > 0 ? (
            list.map((item, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center p-3 border border-gray-200 rounded-lg md:grid-cols-[1fr_3fr_1fr_1fr_1fr] md:gap-3 md:p-2 md:border-b md:border-x-0 md:border-t-0 md:rounded-none" >
                
                {/* Image */}
                <img className='w-16 h-16 object-contain row-span-3 self-center md:w-12 md:h-12 md:row-span-1' src={item.image[0]} alt={item.name} />

                {/* Product Details */}
                <p className='font-semibold text-gray-800 md:font-normal'>{item.name}</p>
                <p className='text-sm text-gray-500'>{item.category}</p>
                <p className='text-gray-700'>{currency}{item.price}</p>

                {/* Action with Loader */}
                <div className='row-span-3 self-center justify-self-center md:row-span-1 flex items-center justify-center h-full w-full'>
                  {deletingProductId === item._id ? (
                    // Simple Tailwind CSS spinner
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  ) : (
                    // Show 'X' icon when not deleting
                    <p 
                      onClick={() => !deletingProductId && removeProduct(item._id)} 
                      className={`cursor-pointer text-xl hover:text-red-600 ${deletingProductId ? 'cursor-not-allowed' : ''}`}>
                      &times;
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-8 text-gray-500">No products to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;