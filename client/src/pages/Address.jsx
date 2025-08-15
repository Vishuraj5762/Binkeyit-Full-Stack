import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const {fetchAddress}=useGlobalContext()

  const handleDisableAddress=async(id)=>{
   try {
    const response=await Axios({
     ...SummaryApi.disableAddress,
     data:{
      _id:id
     }
    })
    if(response.data.success){
      toast.success("Address remove")
      if(fetchAddress){
        fetchAddress()
      }
    }
   } catch (error) {
    AxiosToastError(error)
   }
  }

  return (
    <div className="">
      <div className="bg-white shadow-2xl p-3 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="bg-amber-300 px-3 py-1 rounded hover:bg-amber-400"
        >
          Add address
        </button>
      </div>
      <div className="bg-blue-50 p-2 grid gap-4">
        {addressList.map((address, index) => {
          return (
            <div
              key={index}
              className={`border rounded flex bg-white  p-3 gap-3 hover:bg-blue-100 ${!address.status && 'hidden'}`}
            >
              <div className="w-full">
                <p>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>
                  {address.country} - {address.pincode}
                </p>
                <p>{address.mobile}</p>
              </div>
              <div className="grid gap-10">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="bg-green-300 p-1 rounded hover:bg-green-400 hover:text-white "
                >
                  <MdEdit size={20} />
                </button>
                <button onClick={()=>handleDisableAddress(address._id)} className="bg-red-300 p-1 rounded hover:bg-red-400 hover:text-white">
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setOpenAddress(true)}
          className="lg:h-12 h-10 cursor-pointer hover:bg-blue-300 bg-blue-100 border border-dashed flex justify-center items-center"
        >
          Add address
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        {openEdit && (
          <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
        )
        }
    </div>
  );
};

export default Address;
