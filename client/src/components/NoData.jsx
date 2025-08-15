import React from 'react'
import noDataImage from '../assets/nothing-here-flat-illustration_418302-77.avif'

const NoData = () => {
  return (
    <div className='flex items-center flex-col justify-center p-4'>
      <img
        src={noDataImage}
        alt='no Data'
        className='w-36'
      />
      <p className='text-neutral-700 '>No Data</p>
    </div>
  )
}

export default NoData
