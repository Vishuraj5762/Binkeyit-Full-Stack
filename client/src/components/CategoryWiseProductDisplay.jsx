import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";
import '../index.css'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'

const CategoryWiseProductDisplay = ({id,name}) => {
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(false)
    const containerRef=useRef()
    const subCategoryData=useSelector(state=>state.product.allSubCategory)
    const loadingCardNumber=new Array(6).fill(null)

    const fetchCategoryWiseProduct=async()=>{
        try {
            
            setLoading(true)
            const response=await Axios({
                ...SummaryApi.getProductByCategory,
                   data: { 
                    id:id 
                }
            })

            const {data:responseData}=response
            if(responseData.success){
                setData(responseData.data)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }
   useEffect(() => {
    if (id) {
        fetchCategoryWiseProduct();
    }
}, [id]);

const handleScrollRight=()=>{
    containerRef.current.scrollLeft+=200
}
const handleScrollLeft=()=>{
    containerRef.current.scrollLeft-=200
}   
       
    
    
      const handleRedirectListPage=()=>{
        
         const subcategory=subCategoryData.find(sub=>{
         const filterData= sub.category.some(c=>{
          return c._id == id
         })
         return filterData ? true :null
         })
    
         const url=`/${validURLConvert(name)}-${id}/${validURLConvert(subcategory?.name)}-${subcategory?._id}`
        return url
      }

//     const handleRedirectListPage = () => {
//   const subcategory = subCategoryData.find(sub => {
//     return sub.category?.some(c => c._id === id)
//   });

//   if (!subcategory) return "#"; // or return a fallback URL

//   const url = `/${validURLConvert(name)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
//   return url;
// };

      const redirectURL=handleRedirectListPage()
  return (
     <div>
         <div className='container mx-auto p-4 lg:px-8 px-4 flex items-center justify-between'>
               <h3 className='font-semibold md:text-xl'>{name}</h3>
               <Link to={redirectURL} className='text-green-600 hover:text-green-400'>See All</Link>
         </div>
         <div className='relative flex items-center'>
            <div className='flex gap-4  md:gap-6 lg:gap-10 container mx-auto p-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
            {
                loading  &&
                 loadingCardNumber.map((loading,index)=>{
                    return (
                        <CardLoading key={index}/>
                    )
                 })
            }
            {
                data.map((p,index)=>{
                    return(
                        <CardProduct data={p} key={index}/>
                    )
                })
            }

            </div>
            
            
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between max-w-full'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-200 shadow-lg p-2 rounded-full text-lg'>
                       <FaAngleLeft/>
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-200 shadow-lg p-4 rounded-full text-lg'>
                       <FaAngleRight/>
                    </button>
                </div>
            
         </div>
     </div>
  )
}

export default CategoryWiseProductDisplay
