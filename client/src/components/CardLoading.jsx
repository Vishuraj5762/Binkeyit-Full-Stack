import React from 'react'

const CardLoading = () => {
  return (
    <div className='lg:p-4 py-2 border shadow-lg border-gray-400 grid gap-2 lg:gap-3  min-w-30 lg:max-w-60 lg:min-w-40 rounded bg-white animate-pulse'>
        <div className='lg:min-h-24 min-h-20  bg-blue-100 rounded'>

        </div>
          <div className='p-2 lg:p-3  bg-blue-100 rounded w-20'>

        </div>
        <div className='p-2 lg:p-3  bg-blue-100 rounded '>

        </div>
        <div className='p-2 lg:p-3 bg-blue-100 rounded w-14'>

        </div>

      <div className='flex items-center justify-between gap-3'>
         <div className='p-2 lg:p-3  bg-blue-100 rounded w-20'>

        </div>
         <div className='p-2 lg:p-3  bg-blue-100 rounded w-20'>

        </div>
      </div>
      
    </div>
  )
}

export default CardLoading
