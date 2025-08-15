import React, { useState } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory=useSelector(state=>state.product.loadingCategory)
  const categoryData=useSelector(state=>state.product.allCategory)
   const subCategoryData=useSelector(state=>state.product.allSubCategory)
   const navigate=useNavigate()


  const handleRedirectListPage=(id,cat)=>{
     const subcategory=subCategoryData.find(sub=>{
     const filterData= sub.category.some(c=>{
      return c._id == id
     })
     return filterData ? true :null
     })

     const url=`/${validURLConvert(cat)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`
     navigate(url)
  }

  

  return (
    <section className='bg-white'>
      <div className='container mx-auto px-2'>
        <div className={`w-full h-full min-h-46 bg-blue-200 ${!banner && "animate-pulse my-4"}  rounded`}>
            <img
             src={banner}
             className='w-full h-full max-h-58 hidden lg:block'
             alt='banner'
            />
            <img
             src={bannerMobile}
             className='w-full h-full lg:hidden'
             alt='banner'
            />
        </div>


      </div>
      <div className='container mx-auto px-4 lg:px-9 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
         {
          loadingCategory ? (
            new Array(12).fill(null).map((c,index)=>{
              return(
                <div key={index} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-200 min-h-24 rounded'></div>
                    <div className='bg-blue-200 h-8 rounded'></div>    
                </div>
              )
            })
          ):(
            categoryData.map((cat,index)=>{
              return(
             <div key={index} className='w-full h-full' onClick={()=>handleRedirectListPage(cat._id,cat.name)}>
              <div>
                <img
                  src={cat.image}
                  className='w-full h-full object-scale-down'
                />
              </div>
            </div>
              )
            })
           
          )
         }
      </div>

      {/* Display category product */}
      {
        categoryData.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay key={index} id={`${c._id}`} name={c.name}/>
          )
        })
      }

    </section>
  )
}

export default Home
