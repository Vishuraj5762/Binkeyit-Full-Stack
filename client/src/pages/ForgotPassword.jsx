
import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword= () => {
    const [data,setData]=useState({
        email:""
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
    const navigate = useNavigate();

    const valideValue=Object.values(data).every(e1=>e1)


    const handleSubmit= async(e)=>{
        e.preventDefault()

        try {
            
        const response = await Axios({
            ...SummaryApi.forgot_password,
            data:data
       })
       if(response.data.error){
        toast.error(response.data.message)
       }
       if(response.data.success){
        toast.success(response.data.message)
        navigate("/verification-otp",{
            state:data
        })
        setData({
            email:"",
        })
       }
            
        } catch (error) {
            AxiosToastError(error)
        }

      
    }
    
  return (
    <section className='w-full container mx-auto px-2'>
       <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-8'>

       <p className='font-semibold text-lg mb-2'>Forgot password</p>


         <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

            <div className='grid gap-1'>
                <label htmlFor='email'>Email :</label>
                <input type='email' id='email' placeholder='Enter your email' className='bg-blue-50 p-1.5 border rounded outline-none focus:border-green-700' name='email' value={data.email} onChange={handleChange}></input>
            </div>


            <button disabled={!valideValue} className={`${valideValue ?"bg-green-700 hover:bg-green-800" :"bg-gray-500"}  text-white py-2 rounded font-semibold my-3 tracking-wide hover:`}>
               Send Otp
            </button>
         </form>
         <p>
            Already have account ?
             <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-900'> Login</Link>
         </p>
       </div>
       

    </section>
  )
}

export default ForgotPassword

