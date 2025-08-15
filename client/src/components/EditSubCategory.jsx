import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditSubCategory = ({close,data,fetchData}) => {

  const [subCategoryData,setSubCategoryData]=useState({
    _id:data._id,
    name:data.name,
    image:data.image,
    category:data.category || []
  })

  const allCategory=useSelector(state=>state.product.allCategory)

  const handleChange =(e)=>{
    const {name,value}=e.target
    setSubCategoryData((prev)=>{
      return {
         ...prev,
         [name]:value
      }
    })
  }

  const handleUploadSubCategoryImage =async(e)=>{
     const file=e.target.files[0]
     if(!file){
      return
     }
      const response=await uploadImage(file)
      const {data:ImageResponse}=response
          setSubCategoryData((prev)=>{
        return {
          ...prev,
          image:ImageResponse.data.url
        }
      })
  }
 
  const handleRemoveCategorySelected=(categoryId)=>{
     const index =subCategoryData.category.findIndex(el=>el._id===categoryId)
     subCategoryData.category.splice(index,1)
     setSubCategoryData((prev)=>{
      return{
         ...prev
      }
     })
  }

  const handleSubmitSubCategory=async(e)=>{
    e.preventDefault()
    try {
      const response=await Axios({
        ...SummaryApi.updateSubCategory,
        data:subCategoryData
      })

        const {data:responseData}=response
        if(responseData.success){
          toast.success(responseData.message)
          if(close){
            close()
          }
          if(fetchData){
            fetchData()
          }
        }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
   <section className='fixed w-full mb-10 top-0 bottom-0 left-0 right-0 p-4 z-50 lg:mt-0 mt-19 flex items-center justify-center'>
   <div className='w-full max-w-5xl bg-gray-400 p-4 rounded '>
      <div className='flex items-center justify-between gap-3'>
        <h1 className='font-semibold'>Edit Sub Category</h1>
        <button onClick={close}><IoCloseSharp size={25}/></button>
      </div>
      <form className='my-3 grid gap-3' onSubmit={handleSubmitSubCategory}>
           <div className='grid gap-1'>
             <label htmlFor='name'>Name</label>
             <input id='name' name='name' value={subCategoryData.name}
             onChange={handleChange} className='p-3 bg-blue-100 border outline-none focus-within:border-amber-300  rounded'></input>
           </div>
           <div className='grid gap-1'>
            <p>Image</p>
             <div className='flex flex-col gap-3 lg:flex-row items-center '>
               <div className='border rounded h-36 w-full lg:w-36 bg-blue-100 flex items-center justify-center'>
               {
                !subCategoryData.image ?(
                  <p className='text-sm text-blue-500 '>No Image</p>
                ):(
                  <img
                     alt='subCategory'
                     src={subCategoryData.image}
                     className='w-full h-full object-scale-down'
                  />
                )
               }
             </div>
             <label htmlFor='uploadSubCategoryImage'>
                <div className='px-4 py-1 rounded border cursor-pointer bg-blue-100 border-amber-500 text-black hover:bg-amber-400   hover:text-black'>
                  Upload Image
               </div>  
               <input 
                 type='file'
                 id='uploadSubCategoryImage'
                 className='hidden'
                 onChange={handleUploadSubCategoryImage}
               />
             </label>
             </div>
           </div>
           <div className='grid gap-1'>
             <label>Select Category</label>
             <div className='bg-green-200 border-amber-400 rounded border-2 focus-within:border-amber-200'>
            {/* display values */}

             <div className='flex flex-wrap gap-2'>
               {
                subCategoryData.category.map((cat,index)=>{
                  return(
                    <div key={cat._id+"selectedValue"} className='bg-amber-300 shadow-md px-1 m-1 rounded flex items-center gap-2 '>
                      {cat.name}
                      <div className='cursor-pointer hover:text-red-600' onClick={()=>handleRemoveCategorySelected(cat._id)}><IoCloseSharp size={18}/></div>
                    </div>
                  )
                })
              }
             </div>

            {/* select category */}
              <select onChange={(e)=>{
                const value=e.target.value
                const categoryDetails=allCategory.find(e1=>e1._id==value)
             setSubCategoryData((prev)=>{
              return{
                ...prev,
                category:[...prev.category,categoryDetails]
              }
             })
              }} className='  rounded  bg-transparent p-2 w-full outline-none border '>
              <option value={""} >Select Category</option>
              {
                allCategory.map((category,index)=>{
                  return(
                    <option value={category._id} key={category._id+"subcategory"}>{category?.name}</option>
                  )
                })
              }
            </select>
             </div>
           </div>
           <button className={`px-4 py-2 border ${subCategoryData.name&&subCategoryData.image&&subCategoryData.category[0]?"bg-amber-300 font-semibold  hover:bg-amber-500":"bg-gray-300 font-semibold "}`}>
            Submit
            </button>
           

      </form>
   </div>
   </section>
  )
}

export default EditSubCategory

