import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import SearchPage from '../pages/SearchPage';
import { Link } from 'react-router-dom';

const Search = () => {
  const location=useLocation()
  const nevigate=useNavigate()

  const [isSearchPage,setIsSearchPage]=useState(false)
  const [isMobile]=useMobile()
   const params=useLocation()
   const searchText=params.search.slice(3)


  useEffect(()=>{
    const isSearch=location.pathname==="/search"
    setIsSearchPage(isSearch)
  },[location])


  const redirectToSearchPage=()=>{
    nevigate("/search")
  }

  const handleOnChange=(e)=>{
    const value=e.target.value
    const url=`/search?q=${value}`
    nevigate(url)
  }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border p-1 overflow-hidden flex items-center text-neutral-500 
     bg-slate-50 focus-within:border-amber-300'>
      <div>
      
      {
           (isMobile&& isSearchPage) ?(
            <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 focus-within:text-amber-400 bg-gray-200 rounded-full shadow-md'>
      <FaArrowLeft size={20} />
      </Link>
           ) :(
            <button className='flex justify-center items-center h-full p-3 focus-within:text-amber-400 '>
            <IoSearchSharp size={24} />
            </button>
      
           )
      }

      
      </div>
      <div className='w-full h-full'>
             {
              !isSearchPage?(
                //  not in search page
                <div onClick={redirectToSearchPage} className='w-full h-full flex justify-center'>
                <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'Search "milk"',
                  1000, // wait 1s before replacing "Mice" with "Hamsters"
                  'Search "bread"',
                  1000,
                  'Search "sugar"',
                  1000,
                  'Search "paneer"',
                  1000,
                  'Search "chocolate"',
                  1000,
                  'Search "curd"',
                  1000,
                  'Search "rice"',
                  1000,
                  'Search "egg"',
                  1000,
                  'Search "chips"',
                  1000
                ]}
                wrapper="span"
                speed={50}
              
                repeat={Infinity}
              />
                </div>
              ):(
                  // in search page
                     <div className='w-full h-full'>
                        <input 
                          type='text' placeholder='search for aata dal and more' 
                          autoFocus
                          defaultValue={searchText}
                          className='bg-transparent w-full h-full outline-none'
                          onChange={handleOnChange}
                        />
                     </div>                  

              ) 
             }
      </div>
    </div>
  )
}

export default Search
