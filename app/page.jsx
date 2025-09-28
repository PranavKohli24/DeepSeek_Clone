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
  const [showCurtains, setShowCurtains] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  const {selectedChat, user, createNewChat}=useAppContext()
  const containerRef=useRef(null);

  const {openSignIn}=useClerk();

  // Handle curtain animation on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtains(false);
    }, 500); // Start opening curtains after 500ms

    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000); // Animation completes after 2 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, []);
  
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
    <div className="relative">
      {/* Curtain Animation */}
      {!animationComplete && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Left Curtain */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full transform transition-transform duration-1500 ease-in-out ${
              showCurtains ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  #8B2635 0px,
                  #A53860 20px,
                  #8B2635 40px,
                  #6B1B2F 60px
                ),
                linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%)
              `,
            }}
          >
            {/* Curtain folds/pleats */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full w-2 bg-black/40"
                style={{ left: `${i * 12.5}%` }}
              ></div>
            ))}
            
            {/* Right edge shadow */}
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black/60 to-transparent"></div>
            
            {/* Fabric texture overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, transparent 2px, transparent 4px),
                  repeating-linear-gradient(-45deg, rgba(0,0,0,0.1) 0px, transparent 2px, transparent 4px)
                `
              }}
            ></div>
          </div>
          
          {/* Right Curtain */}
          <div 
            className={`absolute top-0 right-0 w-1/2 h-full transform transition-transform duration-1500 ease-in-out ${
              showCurtains ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  #6B1B2F 0px,
                  #8B2635 20px,
                  #A53860 40px,
                  #8B2635 60px
                ),
                linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%)
              `,
            }}
          >
            {/* Curtain folds/pleats */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full w-2 bg-black/40"
                style={{ right: `${i * 12.5}%` }}
              ></div>
            ))}
            
            {/* Left edge shadow */}
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black/60 to-transparent"></div>
            
            {/* Fabric texture overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, transparent 2px, transparent 4px),
                  repeating-linear-gradient(-45deg, rgba(0,0,0,0.1) 0px, transparent 2px, transparent 4px)
                `
              }}
            ></div>
          </div>


        </div>
      )}

      <div className="flex h-screen">
        {/* --sidebar */}
        <Sidebar expand={expand} setExpand={setExpand}/>
        <div className={`flex-1 flex flex-col flex-items items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative transition-all duration-1000 ${
          animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
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
              className="absolute top-20 right-15 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
            >
              Sign Up
            </button>
          )}

        {messages.length==0?(
              <>
                <div className={`flex items-center gap-3 transition-all duration-1000 delay-500 ${
                  animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <Image src={assets.logo_icon} alt="" className="h-12 w-12"/>
                  <p className="text-2xl font-medium">Hi, I am Pranav's Digital Twin</p>
                </div>
                <p className={`text-sm mt-2 transition-all duration-1000 delay-700 ${
                  animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>Ask me anything or just chat!</p>
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

        <p className={`text-xs absolute bottom-1 text-gray-500 transition-all duration-1000 delay-1000 ${
          animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>Hi {user?.firstName || 'there'}! Ask me anything about Pranav or just chat</p>

        </div>
      </div>
    </div>
  );
}