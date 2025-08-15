import React from 'react'
import DisplayPriceInRupees from '../utils/DisplayPriceInRupees.js'
import { Link } from 'react-router-dom'
import { validURLConvert } from '../utils/validURLConvert.js'
import { priceWithDiscount } from '../utils/PriceWithDiscount.js'
import AxiosToastError from '../utils/AxiosToastError.js'
import { useState } from 'react'
import Axios from '../utils/Axios.js'
import SummaryApi from '../common/SummaryApi.js'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider.jsx'
import AddToCartButton from './AddToCartButton.jsx'

const CardProduct = ({data}) => {
  const url=`/product/${validURLConvert(data.name)}-${data._id}`
  const [loading,setLoading]=useState(false)


  return (
      <Link to={url} className='lg:p-4 py-2 border shadow-lg border-gray-400 grid gap-2 lg:gap-3  min-w-34 lg:min-w-50 rounded bg-white '>
        <div className='min-h-20 w-full max-h-20 lg:max-h-22 rounded overflow-hidden'>
               <img 
                 src={data.image[0]}
                 className='w-full h-full object-scale-down lg:scale-125'
               />
        </div>
         <div className='lg:flex lg:items-center gap-2'>
             <div className='text-xs w-fit p-[1px] px-2 lg:px-0.5 rounded  text-green-600 bg-green-200 '>
               10 min
            </div>
             <div>
               {
                   Boolean(data.discount) &&(
                  <p className='text-green-600 bg-green-200 px-2 w-fit rounded text-xs mt-2 lg:mt-0 '>{data.discount}%<span className='ml-1'>Discount</span></p>
                 )
               }
            </div>
         </div>
        <div className='px-2 font-medium lg:px-0.5 text-ellipsis lg:text-base  text-sm  line-clamp-2  rounded '>
          {data.name}
        </div>
        <div className='w-fit gap-2 px-2 lg:px-0.5 text-sm lg:text-base'>
          {data.unit}
        </div>

      <div className='flex items-center justify-between  text-sm lg:text-base '>
         <div className='flex items-center '>
          <div className=' font-semibold rounded w-20  lg:px-0.5'>
              {DisplayPriceInRupees(priceWithDiscount(data.price,data.discount))}
          </div>
         </div>
         <div className="">
          {
            data.stock == 0 ?(
              <p className='lg:text-sm text-red-500 text-[13px] '>Out of stock</p>
            ):(
              <AddToCartButton data={data} />
            )
          }
         </div>
      </div>
      
    </Link>
  )
}

export default CardProduct
