import React from 'react'

const NewsLetterBox = () => {

    let onSubmitHandler = (event)=>{
        event.preventDefault();
    }

  return (
    <div className='w-full flex flex-col items-center justify-center gap-y-2 mb-6'>
      <p className="font-semibold text-2xl">Subscribe now & get 20% off</p>
      <p className="text-gray-400">Stay stylish and never miss an update — subscribe for the latest fashion drops, offers, and trends!</p>
      <form onSubmit={onSubmitHandler} className="flex w-full sm:max-w-lg  pt-3 ">
        <input className='w-full border border-gray-300  outline-gray-300 p-3' type="email" placeholder='Enter your email' required/>
        <button type="submit" className='cursor-pointer text-white bg-black text-sm p-3 px-4 '>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetterBox
