import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import MyOrderDate from '../components/DeliveryDate'

const MyOrders = () => {
  const orders=useSelector(state=>state.orders.order)
  return (
    <div>
      <div className='bg-white shadow-2xl p-3 font-semibold'>
        <h1>Order</h1>
      </div>
      {
        !orders[0] && (
               <NoData/>
        )
      }
      {
        orders.map((order,index)=>{
          return(
            <div key={index} className='border rounded p-4 text-sm relative '>
              <p>Order No: {order?.orderId}</p>
              <div className='flex gap-3'>
                <img
                 src={order.product_details.image[0]}
                 className='w-16 h-16'
                />
                <p className='font-medium'>{order.product_details.name}</p>
               
              </div>
               <div className='hidden bg-blue-100  md:block absolute top-2 right-4 text-right'>
                  <MyOrderDate/>
                </div>
                <div className=' block md:hidden bg-blue-100 text-left'>
                  <MyOrderDate/>
                </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default MyOrders
