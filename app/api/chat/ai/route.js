export const maxDuration=60;

import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";


//initialize openai client with deepseek API key and base URL
const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req){
    try{
        const {userId}=getAuth(req);

        //extract chatid and prompt from request body
        const {chatId, prompt}= await req.json();

        if(!userId){
            return NextResponse.json({success:false, message:'User not authenticated'})
        }

        //find the chat document in the database based on userId and chatId
        await connectDB();
        const data=await Chat.findOne({userId, _id:chatId})

        //create a user message object
        const userPrompt={
            role:'user',
            content:prompt,
            timestamp:Date.now()
        };

        data.messages.push(userPrompt);

        //call the deepseek api
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            store:true,
        });

        const message=completion.choices[0].message;

        message.timestamp=Date.now()

        data.messages.push(message);

        data.save();

        return NextResponse.json({success:true,data:message})


    }catch(err){
        return NextResponse.json({success:false, error:err.message})
    }
}

