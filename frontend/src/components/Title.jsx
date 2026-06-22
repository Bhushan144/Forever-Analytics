import React from 'react'

const Title = ({title1,title2}) => {
  return (
    <div className='h-[60px] aspect-auto flex items-center gap-2 tracking-wider'>   
        <p className="md:text-3xl text-gray-500">{title1}</p>
        <p className="md:font-bold texl-lg md:text-3xl text-gray-700">{title2}</p>
        <p className="w-[30px] md:w-[50px] h-[3px] bg-gray-500 "></p>
    </div>
  )
}

export default Title
