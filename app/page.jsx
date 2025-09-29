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

  const { selectedChat, user, createNewChat } = useAppContext();
  const containerRef = useRef(null);
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (selectedChat) setMessages(selectedChat.messages);
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen bg-[#292a2d] text-white">
      {/* Sidebar */}
      <Sidebar expand={expand} setExpand={setExpand} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 relative overflow-hidden">
        {/* Mobile menu + new chat */}
        <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
          <Image
            onClick={() => setExpand(!expand)}
            className="rotate-180"
            src={assets.menu_icon}
            alt=""
          />
          {user && (
            <Image
              onClick={createNewChat}
              className="opacity-70 hover:opacity-100 transition-opacity duration-200"
              src={assets.chat_icon}
              alt=""
            />
          )}
        </div>

        {/* Signup button */}
        {!user && (
          <button
            onClick={openSignIn}
            className={`absolute top-20 right-6 px-5 py-3 bg-blue-600 rounded-lg text-white font-bold shadow-lg transform transition-all duration-500 ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            } hover:scale-110 hover:shadow-2xl`}
          >
            Sign Up
          </button>
        )}

        {/* Intro / Empty Chat */}
        {/* Intro / Empty Chat */}
{messages.length === 0 && (
  <div className="flex flex-col items-center gap-3 text-center px-4">
    <Image
      src={assets.logo_icon}
      alt=""
      className={`h-14 w-14 transition-all duration-700 ${
        mounted ? "scale-105 opacity-100 drop-shadow-[0_0_20px_#4f5a6a]" : "scale-0 opacity-0"
      }`}
    />
    <h1
      className={`font-extrabold text-white transition-all duration-700 ${
        mounted ? "scale-100 opacity-100 animate-bounce-once" : "scale-0 opacity-0"
      } text-xl sm:text-2xl md:text-3xl`}
    >
      Hi, I am Pranav's Digital Twin
    </h1>
    <p
      className={`text-sm mt-2 text-gray-300 transition-all duration-700 delay-200 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {user ? 'Ask me anything or just chat!' : 'Signup to continue'}
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
        <p
          className={`text-xs absolute bottom-1 text-gray-500 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } text-center w-full px-4`}
        >
          Hi {user?.firstName || "there"}! Ask me anything about Pranav or just chat
        </p>
      </div>

      {/* Tailwind custom animation */}
      <style jsx>{`
        @keyframes bounce-once {
          0% { transform: scale(0.9); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.7s ease forwards;
        }
      `}</style>
    </div>
  );
}
