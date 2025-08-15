import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data,setData]=useState({
        email:"",
        password:""
    })

    const handleChange=(e)=>{
        const {name,value}=e.target

        setData((preve)=>{
        return {
            ...preve,
            [name]:value
        }
        })
    }
    
    const [showPassword,setShowPassord]=useState(false)
    const navigate = useNavigate();

    const dispatch = useDispatch()

    const valideValue=Object.values(data).every(e1=>e1)


    const handleSubmit= async(e)=>{
        e.preventDefault()

        try {
            
        const response = await Axios({
            ...SummaryApi.login,
            data:data
       })
       if(response.data.error){
        toast.error(response.data.message)
       }
       if(response.data.success){
        toast.success(response.data.message)
        localStorage.setItem('accesstoken',response.data.data.accesstoken)
         localStorage.setItem('refreshtoken',response.data.data.refreshtoken)

         const userDetails = await fetchUserDetails()
         dispatch(setUserDetails(userDetails.data))
        setData({
            email:"",
            password:""
        })
        navigate("/")
       }
            
        } catch (error) {
            AxiosToastError(error)
        }

      
    }
    
  return (
    <section className='w-full container mx-auto px-2'>
       <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-8'>


         <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

            <div className='grid gap-1'>
                <label htmlFor='email'>Email :</label>
                <input type='email' id='email' placeholder='Enter your email' className='bg-blue-50 p-1.5 border rounded outline-none focus:border-green-700' name='email' value={data.email} onChange={handleChange}></input>
            </div>

            <div className='grid gap-1'>
                <label htmlFor='password'>Password :</label>
                <div className='bg-blue-50 p-1.5 border rounded flex items-center focus-within:border-green-700 '>
                     <input type={showPassword ? "text":"password"} id='password'  placeholder='Enter your password' className='w-full outline-none ' name='password' value={data.password} onChange={handleChange}></input>
                     <div onClick={()=>{ setShowPassord(preve =>!preve)}} className='cursor-pointer'>
                    {
                        showPassword ?(
                            <FaEye />
                        ):(
                            <FaEyeSlash />
                        )
                    }
                    
                     </div>
               </div>
               <Link to={"/forgot-password"} className='block ml-auto hover:text-yellow-500'>Forgot Password ?</Link>
            </div>

            <button disabled={!valideValue} className={`${valideValue ?"bg-green-700 hover:bg-green-800" :"bg-gray-500"}  text-white py-2 rounded font-semibold my-3 tracking-wide hover:`}>
               Login
            </button>
         </form>
         <p>
            Don't have account ?
             <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-900'> Register</Link>
         </p>
       </div>
       

    </section>
  )
}

export default Login

