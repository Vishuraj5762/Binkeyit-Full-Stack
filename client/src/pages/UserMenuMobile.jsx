import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";

const UserMenuMobile = () => {
  return (
    <section className='bg-white h-full w-full py-4'>
      <button onClick={()=>window.history.back()} className='text-gray-800 block w-fit ml-auto mr-2'>
        <IoClose size={25} />
      </button>
     <div className='container mx-auto p-3 pb-4'>
      <UserMenu/>
     </div>
    </section>
  )
}

export default UserMenuMobile

