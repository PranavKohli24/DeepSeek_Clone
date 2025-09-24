import connectDB from "@/config/db";
 
import Chat from "@/models/Chat";

import {getAuth} from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const {userId}=getAuth(req);
        const {chatId}=await req.json();

        

        if (!userId){
            return NextResponse.json({success:false, message:'User not authenticated'})
        }

        //connect to database and delete chat.
        await connectDB();
        await Chat.deleteOne({_id:chatId, userId})
        return NextResponse.json({success:true, message:'Chat Deleted'})
        
    }catch(err){
        return NextResponse.json({success:false,error:err.message})
    }
}

