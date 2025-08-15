import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from 'react-icons/fa'

const AddToCartButton = ({data}) => {
      const {fetchCartItem,updateCartItem,deleteCartItem}=useGlobalContext()

      const [loading,setLoading]=useState(false)
      const cartItem=useSelector(state=>state.cartItem.cart)
      const [isAvailableCart,setIsAvailableCart]=useState(false)
      const [qty,setQty]=useState(0)
      const [cartItemDetails,setCartItemDetails]=useState()
    
      const handleADDToCart=async(e)=>{
       e.preventDefault()
       e.stopPropagation()
    
       try {
        setLoading(true)
       
        const response=await Axios({
          ...SummaryApi.addToCart,
          data:{
            productId:data?._id
          }
        })
    
        const {data:responseData}=response
    
        if(responseData.success){
          toast.success(responseData.message)
          if(fetchCartItem){
            fetchCartItem()
          }
        }
    
       } catch (error) {
        AxiosToastError(error)
       }finally{
        setLoading(false)
       }
      }

      useEffect(()=>{
         const checkingitem=cartItem.some(item=>item.productId._id === data._id)
         setIsAvailableCart(checkingitem)

         const product=cartItem.find(item=>item.productId._id === data._id)
         setQty(product?.quantity)
         setCartItemDetails(product)

      },[data,cartItem])


      const increaseQty=async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        
       const response= await updateCartItem(cartItemDetails?._id,qty+1)
        if(response.success){
          toast.success("Item added")
        }
      }

      const decreaseQty=async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        if(qty===1){
            deleteCartItem(cartItemDetails?._id)
        }else{
          const response=await  updateCartItem(cartItemDetails?._id,qty-1)
            if(response.success){
          toast.success("Item remove")
        }
        }
      }


  return (
    <div className='w-full max-w-[150px]'>
        {
            isAvailableCart ? (
               <div className='flex gap-1 -ml-1 '>
                  <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1  w-full p-1  rounded  flex items-center justify-center'><FaMinus/></button>
                  <p className='flex-1 w-full font-semibold lg:px-2 flex items-center justify-center'>{qty}</p>
                  <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full   p-1 rounded  flex items-center justify-center'><FaPlus/></button>
               </div>
            ):(
               <button onClick={handleADDToCart} className='bg-green-600 text-white px-2 lg:px-4 py-1 pr-2 lg:pr-4  hover:bg-green-700 rounded' >
                     {loading ? <Loading/> :"Add"}
               </button>
            )
        }
         
    </div>
  )
}

export default AddToCartButton
