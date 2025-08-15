import React, { useEffect, useRef, useState } from 'react'
import {useParams} from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import DisplayPriceInRupees from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/express-courier-delivery-professional-postal-service-cargo-transportation-business-gods-distribution-home-delivering-idea-design-element_335657-1635.avif'
import image2 from '../assets/160869596-police-officer-man-and-gold-coin-money-dollar-cartoon-doodle-flat-design-style-vector-illustration.jpg'
import image3 from '../assets/images4.jpeg'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params=useParams()
  let productId=params?.product?.split("-")?.slice(-1)[0]
  const [data,setData]=useState({
    name:"",
    image:[]
  })
  const [image,setImage]=useState(0)
  const [loading,setLoading]=useState(false)
  const imageContainer=useRef()

  const fetchProductDetails=async()=>{
    try {
      const response=await Axios({
        ...SummaryApi.getProductDetails,
        data:{
          productId:productId
        }
      })

      const {data:responseData}=response
      if(responseData.success){
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])

  const handleScrollRight=()=>{
    imageContainer.current.scrollLeft+=100
  }
  const handleScrollLeft=()=>{
    imageContainer.current.scrollLeft-=100
  }


  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
      <div className=''>
        <div className='min-h-56 lg:min-h-[65vh] lg:max-h-[65vh]  max-h-56 rounded  bg-white h-full w-full'>
          <img
          src={data.image[image]}
          className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center justify-center rounded gap-3 my-2'>
          {
            data.image.map((img,index)=>{
              return(
                <div key={index} className={`bg-slate-300 h-3 w-3 lg:w-5 lg:h-5 rounded-full ${index===image && "bg-slate-500"} `}>
                </div>
              )
            })
          }
        </div>
      <div className='grid relative '>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none '>
            {
            data.image.map((img,index)=>{
              return(
               <div className='h-20 w-20 min-h-20 min-w-20 cursor-pointer shadow-2xl rounded' key={index}>
                <img
                 src={img}
                 alt='mini-product'
                 onClick={()=>setImage(index)}
                 className='w-full h-full object-scale-down'
                />
               </div>
              )
            })
          } 
          
        </div>
        <div className='flex justify-between absolute w-full h-full -ml-4'>
           <button className='bg-white  p-1 shadow-lg rounded-full items-center'>
            <FaAngleLeft onClick={handleScrollLeft} />
           </button>
          <button>
             <FaAngleRight onClick={handleScrollRight} className=' bg-white'/>
          </button>
        </div>
      </div>
      <div>  
      </div>
          <div className='my-4 hidden  lg:grid gap-3'>
             <div>
                <p className='font-semibold'>Description :</p>
                <p className='text-base'>{data.description}</p>
             </div>
             <div>
                <p className='font-semibold'>Unit:</p>
                <p className='text-base'>{data.unit}</p>
             </div>
             {
              data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
                return(
                  <div key={index}>
                    <p className='font-semibold'>{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                 </div>
                )
              })
             }
         </div>
      </div>

      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-200 w-fit px-2 rounded-full'>10 min</p>
         <h2 className='text-lg font-semibold lg:text-2xl'>{data.name}</h2>
         <p className='bg-green-300 w-fit px-2 rounded-full'>Unit: {data.unit}</p>
          <Divider/>
         <div>
          <p className=''>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 p-4 rounded bg-green-100 w-fit px-4 py-2'>
              <p className='font-semibold text-lg lg:text-2xl'>{DisplayPriceInRupees(priceWithDiscount(data.price,data.discount))}</p>
           </div>
           {
            data.discount &&(
              <p className='line-through '>{DisplayPriceInRupees(data.price)}</p>
            )
           }
           {
            Boolean(data.discount) &&(
             <p className='lg:text-2xl font-bold text-green-600'>{data.discount}%<span className='text-base text-neutral-500 ml-1'>Discount</span></p>
            )
           }
          </div>

         </div>
         {
          data.stock ===0 ?(
            <p className='text-lg text-red-400'>Out of Stock</p>
          ):(
              //  <button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add</button>
              <div className='my-4 max-w-24 lg:ml-3'>
                <AddToCartButton data={data}/>
              </div>
          )
         }
         
         <Divider/>

         <h2 className='font-semibold'>Why shop from binkeyit ?</h2>
         <div>
           <div className='flex items-center gap-4 my-4'>
             <img
               src={image1}
               alt='superfast delivery'
               className='w-18 h-18 rounded'
             />
             <div className='text-sm'>
                 <div className='font-semibold'>superfast delivery</div>
                 <p>Get your order delivered to your doorstep at the earliest from dark store near you</p>
             </div>
           </div>
            <div className='flex items-center gap-4 my-4'>
             <img
               src={image2}
               alt='Best price and offers'
               className='w-18 h-18 rounded'
             />
             <div className='text-sm'>
                 <div className='font-semibold'>Best price & offers</div>
                 <p>Best price destination with offers directly from the manufacturers.</p>
             </div>
           </div>
           <div className='flex items-center gap-4 my-4'>
             <img
               src={image3}
               alt='Wide Assortment'
               className='w-18 h-18 rounded'
             />
             <div className='text-sm'>
                 <div className='font-semibold'>Wide Assortment</div>
                 <p>Choose from 5000+ products across food personal care, household and other categories</p>
             </div>
           </div>
         </div>

        <Divider/>

         {/* only mobile */}

         <div className='my-4 lg:hidden grid gap-3'>
             <div>
                <p className='font-semibold'>Description :</p>
                <p className='text-base'>{data.description}</p>
             </div>
             <div>
                <p className='font-semibold'>Unit:</p>
                <p className='text-base'>{data.unit}</p>
             </div>
             {
              data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
                return(
                  <div key={index}>
                    <p className='font-semibold'>{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                 </div>
                )
              })
             }
         </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
