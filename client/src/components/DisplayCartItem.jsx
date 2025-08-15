import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import DisplayPriceInRupees from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/download.jpg'
import toast from 'react-hot-toast'

const DisplayCartItem = ({close}) => {
    const {notDiscountTotalPrice,totalPrice,totalQty}=useGlobalContext()
    const cartItem=useSelector(state=>state.cartItem.cart)
    const user=useSelector(state=>state.user)
    const navigate=useNavigate()

    const redirectToCheckoutPage=()=>{
      if(user?._id){
       navigate("/checkout")
       if(close){
        close()
       }
       return
      }
      toast("Please Login")
    }

  return (
    <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0  lg:opacity-98 z-50'>
        <div className='bg-white w-full lg:max-w-sm  min-h-screen max-h-screen ml-auto'> 
           <div className='flex items-center p-4 shadow-lg gap-3 justify-between'>
            <h2 className='font-semibold'>Cart</h2>
            <Link to={"/"} className='lg:hidden'>
               <IoClose size={25}/>
            </Link>
            <button className='hidden lg:block' onClick={close}><IoClose size={25}/></button>
           </div>
           <div className='max-h-[calc(98vh-120px)] lg:min-h-[80vh] min-h-[77vh] h-full bg-blue-50 p-2 flex flex-col gap-4'>
              {/* display items */}
              {
                cartItem[0] ?(
                  <>
                    <div className='flex items-center p-2 bg-blue-200 text-blue-600 rounded-full px-4 py-2 justify-between'>
                  <p>Your total savings</p>
                  <p>{DisplayPriceInRupees(notDiscountTotalPrice-totalPrice)}</p>
                     </div>
                   <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItem[0] && (
                        cartItem.map((item,index)=>{
                            return (
                                <div key={index} className='flex w-full gap-4 '>
                                    <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded border-amber-200'>
                                        <img 
                                           src={item?.productId?.image[0]}
                                           className='object-scale-down '
                                        />
                                    </div>
                                    <div className='w-full max-w-sm text-xs'>
                                        <p className='text-sm text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                        <p className='text-slate-700' >{item.productId.unit}</p>
                                        <p className='font-semibold'>{DisplayPriceInRupees(priceWithDiscount(item.productId.price,item.productId.discount))}</p>
                                    </div>
                                    <div>
                                        <AddToCartButton data={item.productId}/>
                                    </div>
                                </div>
                            )
                        })
                    )
                  }
                    </div>
                    <div className='bg-white p-4'>
                      <h3 className='font-semibold'>Bill details</h3>
                      <div className='flex gap-4 justify-between ml-1'>
                        <p>Items total</p>
                        <p className='flex items-center gap-3'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                      </div>
                       <div className='flex gap-4 justify-between ml-1'>
                        <p>Quantity total</p>
                        <p className='flex items-center gap-3'>{totalQty} item</p>
                      </div>
                       <div className='flex gap-4 justify-between ml-1'>
                        <p>Delivery Charge</p>
                        <p className='flex items-center gap-3'>Free</p>
                      </div>
                      <div className='font-semibold flex items-center justify-between gap-4'>
                        <p >Grand total</p>
                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                      </div>
                    </div>
                  </>
                ):(
                   <div className='bg-white flex flex-col justify-center items-center '>
                     <img
                      src={imageEmpty}
                      className='w-full h-full object-scale-down'
                     />
                     <Link onClick={close} to={"/"} className='block bg-green-600 px-4 py-2 text-white rounded'>Shop Now</Link>
                   </div>
                )
              }
               

           </div>

           {
            cartItem[0]&&(
               <div className='p-2'>
               <div className='bg-green-800 text-neutral-100 px-4 font-bold text-base p-2 sticky bottom-3 rounded flex items-center gap-4  justify-between py-4 '>
                 <div>
                   {DisplayPriceInRupees(totalPrice)}
                 </div>
                 <button onClick={redirectToCheckoutPage} className='flex items-center gap-1 cursor-pointer'>
                     Proceed 
                     <span className=''><FaCaretRight /></span>
                </button>
              </div>
          </div>
            )
           }

          
        </div>
    </section>
  )
}

export default DisplayCartItem
