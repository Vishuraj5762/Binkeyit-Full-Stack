import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditCategory = ({close,fetchData,data:categoryData}) => {

      const [data,setData]=useState({
        _id:categoryData._id,
            name:categoryData.name,
            image:categoryData.image
        })
    
        const[loading,setLoading]=useState(false)
    
        const handleOnchange =(e)=>{
        const {name,value}=e.target
    
        setData((prev)=>{
          return {
            ...prev,
            [name]:value
          }
        })
        }


    const handleSubmit =async(e)=>{
    e.preventDefault()
     try {
        setLoading(true)
      const response=await Axios({
      ...SummaryApi.updateCategory,
      data:data
    })
    const {data:responseData}=response
    if(responseData.success){
      toast.success(responseData.message)
      close()
      fetchData()
    }
     } catch (error) {
      AxiosToastError(error)
     }finally{
       setLoading(false)
     }

    }

       const handleUploadCategoryImage =async(e)=>{
      const file=e.target.files[0]

      if(!file){
        return
      }
      setLoading(true)
      const response=await uploadImage(file)
      const {data:ImageResponse}=response
      setLoading(false)
          setData((prev)=>{
        return {
          ...prev,
          image:ImageResponse.data.url
        }
      })


    }

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 flex items-center justify-center'>
        <div className='bg-gray-300 max-w-5xl w-full p-4 rounded'>
          <div className='flex items-center justify-between'>
           <h1 className='font-semibold'>Update Category</h1>
             <button onClick={close} className='w-fit block ml-auto'>
                 <IoCloseSharp size={23}/>
             </button>
          </div>
           <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
             <div className='grid gap-1'>
               <label id='categoryName'>Name</label>
               <input
               type='text'
               id='categoryName'
               placeholder='Enter category name'
               value={data.name}
               name='name'
               onChange={handleOnchange}
               className='bg-blue-200 p-2 border border-blue-300 rounded '
               />
             </div>
             <div className='grid gap-1'>
                 <p>Images</p>
                 <div className='flex gap-3 flex-col lg:flex-row items-center'>
                   <div className='border rounded text-neutral-500 bg-blue-100 h-36 w-full lg:w-36 flex items-center justify-center'>
                     {
                       data.image ?(
                      <img
                        alt='category'
                        src={data.image}
                        className='w-full h-full object-scale-down'
                      />
                       ):(
                           <p className='text-sm '>No Image</p>
                       )
                     }
                      
                   </div>
                     <label htmlFor='uploadCategoryImage'>
                              <div className={`
                                   ${!data.name ? "bg-gray-400 px-4 py-1 rounded":" border border-amber-500 bg-gray-300 hover:bg-amber-300 hover:font-semibold px-4 py-1 rounded cursor-pointer"}`}
                                   >
                                    {
                                        loading ? "Loading...":"Upload Image"
                                    }

                                     
                              </div>
                              <input disabled={!data.name} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden'/>
                     </label>
                 </div>
             </div>
             <button className={`${data.name && data.image ? "bg-amber-400 py-2 font-semibold":"bg-gray-400 py-2"}`} >Update Category</button>
           </form>
        </div>
      </section>
  )
}

export default EditCategory
