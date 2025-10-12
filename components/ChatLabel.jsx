import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const ChatLabel = ({openMenu,setOpenMenu, id, name, selectedChatId}) => {

  const {fetchUserChats, chats, setSelectedChat}=useAppContext();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const selectChat=()=>{
    const chatData=chats.find(chat=>chat._id===id);
    setSelectedChat(chatData);
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu.id === id && openMenu.open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu({id:0, open:false});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, id, setOpenMenu]);


  const renameChat=async(e)=>{
    e.stopPropagation();
    try{
      const newName=prompt('Enter new name')
      if(!newName) return 
      const {data}=await axios.post('/api/chat/rename',{chatId:id, name:newName})

      if(data.success){
        fetchUserChats();
        setOpenMenu({id:0,open:false})
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    }catch(err){
      toast.error(err.message)
    }
  }


  const deleteHandler=async(e)=>{
    e.stopPropagation();
    try{
      const confirm=window.confirm('Are you sure you want to delete!')
      if(!confirm)return 

      const {data}=await axios.post('/api/chat/delete',{chatId:id})

      if (data.success){
        fetchUserChats();
        setOpenMenu({id:0, open:false})
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    }catch(err){
      toast.error(err.message)
    }
  }

  return (
    <div
      onClick={selectChat}
      className={`flex items-center justify-between p-2 text-sm rounded-lg cursor-pointer transition-colors
        ${selectedChatId === id ? 'bg-gray-600/40 text-white' : 'text-white/80 hover:bg-white/10'}`}
    >
      <p className='truncate flex-1 pr-2'>{name}</p>

      <div ref={menuRef} className='relative flex-shrink-0'>
        <div 
          ref={buttonRef}
          onClick={(e)=>{
            e.stopPropagation(); 
            setOpenMenu({id:id, open: openMenu.id === id ? !openMenu.open : true})
          }} 
          className='group flex items-center justify-center h-6 w-6 hover:bg-black/80 rounded-lg'
        >
          <Image 
            src={assets.three_dots} 
            alt='' 
            className={`w-4 ${openMenu.id===id && openMenu.open ? '' : 'hidden'} group-hover:block`}
          />
        </div>

        {openMenu.id === id && openMenu.open && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className='absolute right-0 top-8 bg-gray-700 rounded-xl w-max p-2 z-[60] shadow-lg min-w-[120px]'
          >
            <div 
              onClick={renameChat} 
              className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer'
            >
              <Image src={assets.pencil_icon} alt='' className='w-4'/>
              <p>Rename</p>
            </div>

            <div 
              onClick={deleteHandler} 
              className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer'
            >
              <Image src={assets.delete_icon} alt='' className='w-4'/>
              <p>Delete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatLabel