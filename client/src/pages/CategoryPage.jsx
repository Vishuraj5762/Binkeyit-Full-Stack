import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory]=useState(false)
 const [loading,setLoading]=useState(false)
 const [categoryData,setCategoryData]=useState([])
 const [openEdit,setOpenEdit]=useState(false)
 const [editData,setEditData]=useState({
         name:"",
         image:"",
 })

  const [openConfirmBoxDelete,setOpenConfirmBoxDelete]=useState(false)
  const [deleteCategory,setDeleteCategory]=useState({_id:""})
  const allCategory=useSelector(state=>state.product.allCategory)

  useEffect(()=>{
    setCategoryData(allCategory)
  },[allCategory])

 
     const fetchCategory=async()=>{
      try {
        setLoading(true)
       const response = await Axios({
        ...SummaryApi.getCategory
       })
        const {data:responseData}=response
        if(responseData.success){
          setCategoryData(responseData.data)
          fetchCategory()
        }
      } catch (error) {

      }finally{
        setLoading(false)
      }
    }

    useEffect(()=>{
      fetchCategory()
    },[])

    const handleDeleteCategory=async()=>{
        try {
          const response=await Axios({
            ...SummaryApi.deleteCategory,
            data:deleteCategory
          })
          const {data:responseData}=response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCategory()
            setOpenConfirmBoxDelete(false)
          }
        } catch (error) {
          AxiosToastError(error)
        }
    }

  return (
    <section>
        <div className='p-2  bg-white shadow-md flex items-center justify-between '>
            <h2 className='font-semibold'> Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border  border-amber-300 hover:bg-amber-300 px-3 py-1 rounded'>Add category</button>
        </div>
        
          {
            !categoryData[0]&& !loading && (
            <NoData/>
  )
          }
         <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
           {
            categoryData.map((category,index)=>{
              return (
                                                                                      //  group provide tailwind css
                <div className='w-32 h-54 group shadow-lg rounded ' key={category._id}>                  
                    <img
                    
                     alt={category.name}
                     src={category.image}
                     className='w-full  object-scale-down  '
                    />
                    <div className='items-center h-6 hidden gap-2 group-hover:flex'>
                      <button onClick={()=>{
                        setOpenEdit(true) 
                        setEditData(category)
                        }} className='flex-1  font-semibold bg-green-200 text-green-600 rounded hover:bg-green-300'>Edit</button>
                      <button onClick={()=>{
                        setOpenConfirmBoxDelete(true)
                        setDeleteCategory(category)
                      }} className='pr-2 pl-2 font-semibold bg-red-200 text-red-600 rounded hover:bg-red-300'>Delete</button>
                    </div>
                </div>
              )
            })
          }
         </div>

        {
          loading&&(
            <Loading/>
          )
        }


            
        {
            openUploadCategory &&(
            <UploadCategoryModel   fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }

        {
          openEdit && (
            <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
          )
        }

        {
          openConfirmBoxDelete && (
            <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
          )
        }
        
    </section>
  )
}

export default CategoryPage
