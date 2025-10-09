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
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false); // NEW

  const { selectedChat, user, createNewChat } = useAppContext();
  const containerRef = useRef(null);
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCreatingChat(false); // reset after new chat loads
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setLogoAnimated(true);
    }, 1000);
  }, []);

  const handleNewChat = async () => {
    setCreatingChat(true);
    await createNewChat();
  };

  return (
    <div className="flex h-screen bg-[#292a2d] text-white">
      {/* Sidebar */}
      <Sidebar expand={expand} setExpand={setExpand} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12 md:pb-20 relative overflow-hidden">
        
        {/* Mobile menu + new chat */}
        <div className="md:hidden absolute px-4 top-6 flex flex-col items-center w-full">
          <div className="flex items-center justify-between w-full">
            <Image
              onClick={() => setExpand(!expand)}
              className="rotate-180"
              src={assets.menu_icon}
              alt=""
            />
            {user && (
              <div className="flex flex-col items-center">
                <Image
                  onClick={handleNewChat}
                  className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  src={assets.chat_icon}
                  alt=""
                />
                {creatingChat && (
                  <span className="text-xs text-gray-300 mt-1 animate-pulse">
                    creating new chat...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Signup button */}
        {!user && (
          <button
            onClick={openSignIn}
            className={`absolute top-20 right-6 px-6 py-3 bg-gradient-to-r from-sky-400 to-sky-600 text-white font-semibold rounded-xl shadow-md transform transition-all duration-500 ease-out
    ${logoAnimated ? "translate-x-0 opacity-100" : "translate-x-24 opacity-0"}
    hover:scale-105 hover:shadow-xl hover:from-sky-500 hover:to-sky-700`}
          >
            Sign Up
          </button>
        )}

        {/* Intro / Empty Chat */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <Image
              src={assets.logo_icon}
              alt=""
              className={`h-24 w-24 md:h-26 md:w-26  rounded-full transition-all duration-1000 ease-out ${
                mounted 
                  ? "scale-100 opacity-100 animate-logo-grow" 
                  : "scale-0 opacity-0"
              } `}
            />
            <h1
              className={`font-extrabold text-white transition-all duration-700 ease-out ${
                logoAnimated 
                  ? "scale-100 opacity-100 translate-y-0" 
                  : "scale-0 opacity-0 translate-y-4"
              } text-xl sm:text-2xl md:text-3xl`}
            >
              Hi, I am Pranav's Digital Twin
            </h1>
            <p
              className={`text-sm mt-2 text-gray-300 transition-all duration-700 ease-out ${
                logoAnimated 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: logoAnimated ? '200ms' : '0ms' }}
            >
              {user ? 'Ask me anything or just chat!' : 'Signup to continue!'}
            </p>
          </div>
        )}

        {/* Chat messages */}
        {messages.length > 0 && (
          <div
            ref={containerRef}
            className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
          >
            <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
              {selectedChat.name}
            </p>
            {messages.map((msg, idx) => (
              <Message key={idx} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="flex gap-4 max-w-3xl w-full py-3">
                <Image
                  className="h-9 w-9 p-1 border border-white/15 rounded-full"
                  src={assets.logo_icon}
                  alt="Logo"
                />
                <div className="flex justify-center items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prompt */}
        <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />

        {/* Footer text */}
        {user ? (
          <p
            className={`text-xs absolute bottom-1 text-gray-500 transition-all duration-700 ease-out ${
              logoAnimated 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: logoAnimated ? '400ms' : '0ms' }}
          >
            Hi {user.firstName}! Ask me anything about Pranav or just chat
          </p>
        ) : (
          <p
            className={`text-sm mt-2 text-gray-400 text-center transition-all duration-700 ease-out ${
              logoAnimated 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: logoAnimated ? '300ms' : '0ms' }}
          >
            Hello there! Ask anything about Pranav or just chat
          </p>
        )}
      </div>

      {/* Tailwind custom animations */}
      <style jsx>{`
        @keyframes logo-grow {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        

        .animate-logo-grow {
          animation: logo-grow 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-logo-glow {
          animation: logo-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
