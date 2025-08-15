import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {

  

  return (
    <section className='bg-white'>
      <div className='container mx-auto lg:flex '>
      
           {/* left for menu */}

          <div className=' min-w-[250px] py-4 sticky max-h-[calc(100vh-130px)] top-24 overflow-y-auto hidden lg:block border-r'>
             <UserMenu/>
          </div>


         {/* right for content */}

         <div className='bg-white w-full min-h-[80vh] '>
          <Outlet/>
         </div>
       
      </div>
    </section>
  )
}

export default Dashboard
