import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({data,fetchProductData}) => {
  const [openDelete,setOpenDelete]=useState(false)
  const [editOpen,setEditOpen]=useState(false)

  const handleDeleteCancle=()=>{
    setOpenDelete(false)
  }

  const handleDelete=async()=>{
   try {
    const response=await Axios({
      ...SummaryApi.deleteProduct,
      data:{
        _id:data._id
      }
    })

    const {data:responseData}=response
    if(responseData.success){
      toast.success(responseData.message)
      if(fetchProductData){
        fetchProductData()
      }
      setOpenDelete(false)
    }
   } catch (error) {
    AxiosToastError(error)
   }
  }
  return (
    <div className='w-36 p-3 bg-white rounded'>
      <div>
        <img
         src={data?.image[0]}
         alt={data?.name}
         className='w-full h-full object-scale-down'
        />
      </div>
      <p className='text-ellipsis line-clamp-2 font-semibold'>{data?.name}</p>
      <p className='text-slate-500'>{data?.unit}</p>
      <div className='grid grid-cols-2 gap-3 py-2'>
        <button onClick={()=>setEditOpen(true)} className='border px-1 text-sm border-green-600 bg-green-100 py-1 text-green-800 hover:bg-green-400 hover:text-white  rounded'>Edit</button>
        <button onClick={()=>setOpenDelete(true)} className='border px-1 text-sm border- py-1 text-red-600 bg-red-100 rounded hover:bg-red-400 hover:text-white'>Delete</button>
      </div>
      {
        editOpen &&(
          <EditProductAdmin fetchProductData={fetchProductData}  data={data} close={()=>setEditOpen(false)}/> 
        )
      }

      {
        openDelete && (
          <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 opacity-95 p-4 flex justify-center items-center ' >
               <div className='bg-white p-4 w-full max-w-md rounded-md'>
                  <div className='flex items-center justify-between gap-4'>
                    <h3 className='font-semibold'>Permanent Delete</h3>
                    <button onClick={()=>setOpenDelete(false)}><IoClose size={25}/></button>
                  </div>
                  <p className='my-2'>Are you sure want to delete permanent</p>
                  <div className='flex justify-end gap-5 py-3'>
                    <button onClick={handleDeleteCancle} className='border px-3 py-1 rounded bg-red-100 border-red-600 text-red-500 hover:bg-red-400 hover:text-white'>Cancle</button>
                    <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-600 text-green-500 hover:bg-green-400 hover:text-white'>Delete</button>
                  </div>
               </div>
          </section>
        )
      }
    </div>
  )
}

export default ProductCardAdmin
