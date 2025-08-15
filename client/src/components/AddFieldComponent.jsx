import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddFieldComponent = ({close,value,onChange,submit}) => {
  return (
   <section className='fixed w-full mb-10  top-0 bottom-0 left-0 right-0 p-4 z-50  flex items-center justify-center'>
   <div className='w-full max-w-5xl bg-amber-300 p-4 rounded  '>
     <div className='flex items-center justify-between gap-3 '>
        <h1 className='font-semibold'>Add Field</h1>
        <button onClick={close} className='hover:text-red-600 cursor-pointer'>
        <IoClose size={25}/>
        </button>
     </div>
     <input
      className='bg-blue-100 p-2 border outline-none focus-within:border-amber-400 rounded w-full mt-3' 
      placeholder='Enter Field Name'
      value={value}
      onChange={onChange}
     />
     <button 
        onClick={submit}
        className='bg-green-500 mt-3 hover:bg-green-600 w-fit block text-white mx-auto hover:text-black px-4 py-2 rounded font-semibold'>
        Add Field
    </button>
   </div>
   </section>
  )
}

export default AddFieldComponent
