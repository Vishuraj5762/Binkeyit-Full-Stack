import React from 'react'
import { Link } from 'react-router-dom'

const Cancle = () => {
  return (
     <div className='m-2 w-full max-w-md bg-red-300 rounded py-4 mx-auto p-4 flex flex-col justify-center items-center gap-5'>
       <p className='text-red-800 font-bold text-lg text-center'>Order Cancle</p>
        <Link to={"/"} className='border border-red-900 px-4 py-1 rounded text-red-900 hover:bg-red-900 hover:text-white transition-all '>Go To Home</Link>
    </div>
  )
}

export default Cancle
