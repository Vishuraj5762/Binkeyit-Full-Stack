import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory ,setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct';
import GlobalProvider from './provider/GlobalProvider';
import { FaCartPlus } from "react-icons/fa6";
import CartMobile from './components/CartMobile';

function App() {

  const dispatch=useDispatch()
   const location=useLocation()



const fetchUser=async()=>{
     const userData= await fetchUserDetails()
     dispatch(setUserDetails(userData.data))

}

   const fetchCategory=async()=>{
      try {
        dispatch(setLoadingCategory(true))
       const response = await Axios({
        ...SummaryApi.getCategory
       })
        const {data:responseData}=response
        if(responseData.success){
          dispatch(setAllCategory(responseData.data))
          setCategoryData(responseData.data)
        }
      } catch (error) {

      }finally{
         dispatch(setLoadingCategory(false))
      }
    }

    const fetchSubCategory=async()=>{
      try {
        
       const response = await Axios({
        ...SummaryApi.getSubCategory
       })
        const {data:responseData}=response
        if(responseData.success){
          dispatch(setAllSubCategory(responseData.data))
          // setCategoryData(responseData.data)
        }
      } catch (error) {

      }finally{
        
      }
    }

  // const fetchCartItem=async()=>{
  //   try {
  //     const response=await Axios({
  //       ...SummaryApi.getCartItem
  //     })
  //     const {data:responseData}=response
  //     if(responseData.success){
  //     dispatch(handleAddItemCart(responseData.data))

  //       console.log(responseData)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

useEffect(()=>{
  fetchUser()
  fetchCategory()
  fetchSubCategory()
  // fetchCartItem()
},[])

  return (
    <GlobalProvider>
    <Header/>
  <main className='min-h-[80vh] '>
   <Outlet/>
  </main>
  <Footer/>
  <Toaster/>
  {
    location.pathname !== "/checkout" &&(
      <CartMobile/>
    )
  }
  </GlobalProvider>
  )
}

export default App
