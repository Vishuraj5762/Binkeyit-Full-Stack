import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import {useSelector} from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'

const ProductListPage = () => {
  const params = useParams()
  const [data,setData]=useState([])
  const [page,setPage]=useState(1)
  const [loading,setLoading]=useState(false)
  const [totalPage,setTotalPage]=useState(1)
 const AllSubCategory=useSelector(state=>state.product.allSubCategory)
const [DisplaySubCategory,setDisplaySubCategory]=useState([])


  const subCategory=params?.subCategory?.split("-")
  const subCategoryName=subCategory?.slice(0,subCategory?.length-1).join(" ")
  const categoryId=params.category.split("-").slice(-1)[0]
  const subCategoryId=params.subCategory.split("-").slice(-1)[0]

  const fetchProductData=async()=>{

   try {
     setLoading(true)
     const response=await Axios({
      ...SummaryApi.getProductByCategoryAndSubCategory,
      data:{
        categoryId:categoryId,
        subCategoryId:subCategoryId,
        page:page,
        limit:10
      }
     })
   
     const {data:responseData}=response
     if(responseData.success){
      if(responseData.page==1){
      setData(responseData.data)
      }else{
        setData([...data,...responseData.data])
      }
      setTotalPage(responseData.totalPage)
     }
   } catch (error) {
    AxiosToastError(error)
   }finally{
    setLoading(false)
   }
  }


  useEffect(()=>{
    fetchProductData()
  },[params])


  useEffect(()=>{
     const sub = AllSubCategory.filter(s=>{
      const filterData=s.category.some(el=>{
        return el._id === categoryId
      })
      return filterData ? filterData:false
     })
     setDisplaySubCategory(sub)
  },[params,AllSubCategory])
 
  return (
    <section className='sticky top-25 lg:top-20'>
      <div className='container sticky top-25 mx-auto  flex'>
        {/* siderbar sub category */}
        <div className=' w-34 md:w-52 min-h-[88vh] max-h-[88vh] overflow-y-scroll scrollbarCustom lg:w-80 p-1 md:p-2 md:gap-3 grid gap-2 bg-red-100 '>
             {
              DisplaySubCategory.map((s,index)=>{
               const link=`/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`
                return(
                  <Link to={link} key={index} className={`w-full p-2  hover:bg-green-300 cursor-pointer rounded ${subCategoryId=== s._id?"bg-green-200":"bg-white"}`}>
                    <div className=' shadow  p-2 w-fit mx-auto rounded'>
                      <img
                        src={s.image}
                        alt='subCategory'
                        className='w-15 mt-1  h-full  object-scale-down'
                     />
                    </div>
                    <p className='-mt-1 bg-red-50'>{s.name}</p>
                  </Link>
                )
              })
             }
            
        </div>



        {/* product */}
        <div className=' w-full'>
           <div className='bg-white shadow-md p-4 '>
            <h3 className='font-semibold '>{subCategoryName}</h3>
           </div>
           <div>
            <div className='min-h-[80vh] max-h-[80vh] overflow-auto'>
             <div className="grid grid-cols-1 p-4 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {
                 data.map((p, index) =>{
                   return(
                 <CardProduct data={p} key={index} />
                 )
                })
              }
             </div>

            {
              loading&&(
                <Loading/>
              )
            }
           </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
