'use client'

import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const [expand,setExpand]=useState(false);
  const [messages,setMessages]=useState([]);
  const [isLoading,setIsLoading]=useState(false)

  const {selectedChat, user, createNewChat}=useAppContext()
  const containerRef=useRef(null);

  const {openSignIn}=useClerk();


  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])


  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behavior:"smooth",

      })
    }
  },[messages])


  return (
    <div>
      <div className="flex h-screen">
        {/* --sidebar */}
        <Sidebar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col flex-items items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image 
              onClick={()=>(expand?setExpand(false):setExpand(true))} 
              className="rotate-180" 
              src={assets.menu_icon} 
              alt=""/>
              {user&&<Image onClick={createNewChat} className="opacity-70 hover:opacity-100 transition-opacity duration-200" src={assets.chat_icon} alt=""/>}
             {/* <Image className="opacity-70" src={assets.chat_icon} alt=""/> */}
          </div>

        {/* Signup button if user is null */}
          {!user && (
            <button 
              onClick={openSignIn} 
              className="absolute top-15 right-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
            >
              Sign Up
            </button>
          )}

        {messages.length==0?(
              <>
                <div className="flex items-center gap-3">
                  <Image src={assets.logo_icon} alt="" className="h-12 w-12"/>
                  <p className="text-2xl font-medium">Hi, I am Pranav's Digital Twin</p>
                </div>
                <p className="text-sm mt-2">How can i help you today!</p>
              </>
          ):
          (
              <div ref={containerRef} className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto">
                <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2
                rounded-lg font-semibold mb-6">{selectedChat.name}</p>

                {messages.map((msg,index)=>(

                  <Message key={index} role={msg.role} content={msg.content}/>
                ))}

                {isLoading&&(
                  <div className="flex gap-4 max-w-3xl w-full py-3">
                    <Image className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="Logo"/>

                    <div className="loader flex justify-center items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>

                    </div>
                  </div>
                )}

                
              </div>
          )
        }

        {/* prompt box */}
        <PromptBox isLoading={isLoading} setIsLoading={setIsLoading}/>

        <p className="text-xs absolute bottom-1 text-gray-500">Yo!! wassup pranav's friend Have a nice day!</p>

        </div>
      </div>
    </div>
  );
}
