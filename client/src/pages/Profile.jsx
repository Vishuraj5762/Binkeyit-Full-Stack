import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvtarEdit from '../components/UserProfileAvtarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {

  const user=useSelector(state=>state.user)
  const [openProfileAvtarEdit,setrProfileAvtarEdit] = useState(false)
  const[userData,setUserData]=useState({
    name:user.name,
    email:user.email,
    mobile:user.mobile,
  })

  useEffect(()=>{
   setUserData({
    name:user.name,
    email:user.email,
    mobile:user.mobile,
   })
  },[user])

const [loading,setLoading]=useState(false)
const dispatch=useDispatch()

  const handleonChange=(e)=>{
    const {name,value}=e.target
    setUserData((prev)=>{
      return {
        ...prev,
        [name]:value
      }
    })
  }

  const handleSubmit =async(e)=>{
 e.preventDefault()
 try {
  setLoading(true)
  const response =await Axios({
    ...SummaryApi.updateUserDetails,
    data:userData
  })
  
  const {data:responseData}=response
  if(responseData.success){
    toast.success(responseData.message)
     const userData=await fetchUserDetails()
     dispatch(setUserDetails(userData.data))
  }

 } catch (error) {
   AxiosToastError(error)
 }finally {
  setLoading(false)
 }

  }
  return (
    <div className='p-2'>

      {/* profile upload and display image */}
       <div className='w-16 h-16 overflow-hidden rounded-full flex items-center justify-center drop-shadow-lg'>
        {
          user.avtar ?(
              <img
                alt={user.name}
                src={user.avtar}
                className='w-full h-full'
              />
          ):(
              <FaRegUserCircle size={60} />
          )
        }
       </div>
       <button  onClick={()=>setrProfileAvtarEdit(true)}
       className='text-xs min-w-16 border px-3 py-1 rounded-full mt-3 border-amber-300 hover:bg-amber-300'>
        Edit Profile
       </button>
       {
         openProfileAvtarEdit &&(
          
           <UserProfileAvtarEdit close={()=>setrProfileAvtarEdit(false)}/>
        )
       }

{/* name email mobile change password */}

<form className='my-4 grid gap-4' onSubmit={handleSubmit}>
  <div className='grid'>
    <label className='ml-2'>Name</label>
    <input
     type='text'
     placeholder='Enter your name'
     className='p-2 bg-blue-100 border rounded-2xl  border-amber-300'
     value={userData.name}
     name='name'
     onChange={handleonChange}
     required
    />
  </div>
  <div className='grid'>
    <label className='ml-2' htmlFor='email'>Email</label>
    <input
     type='email'
     id='email'
     placeholder='Enter your email'
     className='p-2 bg-blue-100 border rounded-2xl  border-amber-300'
     value={userData.email}
     name='email'
     onChange={handleonChange}
     required
    />
  </div>
  <div className='grid'>
    <label className='ml-2'>Mobile</label>
    <input
     type='text'
     id='mobile'
     placeholder='Enter your mobile'
     className='p-2 bg-blue-100 border rounded-2xl  border-amber-300'
     value={userData.mobile}
     name='mobile'
     onChange={handleonChange}
     required
    />
  </div>

  <button className='border px-4 py-2 font-semibold hover:bg-amber-500 rounded-2xl'> 
    {
      loading ? "Loading...":"Submit"
    }
    </button>
</form>
    </div>
  )
}

export default Profile

