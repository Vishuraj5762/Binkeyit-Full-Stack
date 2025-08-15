import { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updateAvtar } from '../store/userSlice'
import { IoCloseSharp } from "react-icons/io5";

const UserProfileAvtarEdit = ({close}) => {

    const user=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(false)

    const handleSubmit=(e)=>{
        e.preventDefault()
    }

    const handleUploadAvtarImage=async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const formData= new FormData()
        formData.append('avtar',file)
        

       try {
        setLoading(true)

        const response = await Axios({
         ...SummaryApi.uploadAvtar,
         data:formData
       })

       const {data:responseData}=response
       dispatch(updateAvtar(responseData.data.avtar))

       } catch (error) {
         AxiosToastError(error)
       } finally{
          setLoading(false)
       }
          

    }

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 opacity-85 p-4 flex items-center justify-center'>

       <div className='bg-white max-w-sm w-full rounded p-4  flex flex-col items-center justify-center'>

     <button onClick={close} className='text-neutral-900 w-fit block ml-auto cursor-pointer'>
        <IoCloseSharp size={23} />
     </button>

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

            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                  <div className='border border-amber-400 cursor-pointer hover:bg-amber-400 px-4 py-1 rounded text-sm my-2'>
                       {
                        loading ? "Loading..." : "Upload"
                       }
                  </div>
                   <input onChange={handleUploadAvtarImage} type='file' id='uploadProfile' className='hidden'/>
                </label>     
            </form>

            
       </div>
    </section>
  )
}

export default UserProfileAvtarEdit
