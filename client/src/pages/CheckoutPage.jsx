import React, { useState } from "react";
import DisplayPriceInRupees from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js'

const CheckoutPage = () => {
    const {notDiscountTotalPrice,totalPrice,totalQty,fetchCartItem,fetchOrder}=useGlobalContext()
    const [openAddress,setOpenAddress]=useState(false)
    const addressList=useSelector(state=>state.addresses.addressList)
    const [selectedAddress,setSelectedAddress]=useState(0)
    const cartItemList=useSelector(state=>state.cartItem.cart)
    const navigate=useNavigate()
    

     const handleCashOnDelivery=async()=>{
    try {
       const response=await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data:{
          list_item:cartItemList,
          addressId:addressList[selectedAddress]?._id,
          totalAmt:totalPrice,
          subTotalAmt:totalPrice
        }
       })
       const {data:responseData}=response
       if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate('/success',{
          state:{
           text:"Order"
          }
        })
       }
    } catch (error) {
      AxiosToastError(error)
    }
     }

     const handleOnlinePayment=async()=>{
     try {
        toast.loading("Loading...")
        const stripePublicKey=import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise=await loadStripe(stripePublicKey)

          const response=await Axios({
             ...SummaryApi.payment_url,
           data:{
            list_item:cartItemList,
          addressId:addressList[selectedAddress]?._id,
          totalAmt:totalPrice,
          subTotalAmt:totalPrice
        }
       })

       const {data:responseData}=response
       stripePromise.redirectToCheckout({sessionId:responseData.id})

       if(fetchCartItem){
        fetchCartItem()
       }

       if(fetchOrder){
        fetchOrder()
       }

     } catch (error) {
      AxiosToastError(error)
     }
     }

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex w-full gap-5 justify-between flex-col lg:flex-row">
        <div className="w-full">
          {/* address */}
          <h3 className="text-lg font-semibold">Choose your address</h3>

           <div className="bg-white p-2 grid gap-4">
            {
              addressList.map((address,index)=>{
                return(
                  <label key={index} htmlFor={index} className={!address.status && "hidden"}>
                  <div className="border rounded flex  p-3 gap-3 hover:bg-blue-100">
                    <div>
                      <input
                      id={index}
                       type="radio"
                       name="address"
                       value={index}
                       onChange={(e)=>setSelectedAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                    </div>
                    
                  </div>
                  </label>
                )
              })
            }
            <div onClick={()=>setOpenAddress(true)} className="lg:h-12 h-10 cursor-pointer hover:bg-blue-300 bg-blue-100 border border-dashed flex justify-center items-center">
            Add address
          </div>
           </div>

          
        </div>
        <div className="w-full lg max-w-md bg-white py-4 px-2">
          {/* summary */}
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-3">
                <span className="line-through text-neutral-400">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quantity total</p>
              <p className="flex items-center gap-3">{totalQty} item</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-3">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4">
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full  flex flex-col gap-4">
            <button onClick={handleOnlinePayment} className="py-2 px-4 bg-green-600  hover:bg-green-700 rounded  text-white font-semibold">Online Payment</button>
          <button onClick={handleCashOnDelivery} className="py-2 px-4  border-2 hover:text-white border-green-600  hover:bg-green-700  rounded text-green-600 font-semibold">Cash on Delivery</button>
          </div>
        </div>
      </div>
      {
        openAddress &&(
            <AddAddress close={()=>setOpenAddress(false)}/>
        )
      }
    </section>
  );
};

export default CheckoutPage;
