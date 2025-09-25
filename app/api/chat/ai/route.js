export const maxDuration=60;

import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";


//initialize openai client with deepseek API key and base URL
const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY
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

        if (!data) {
            return NextResponse.json({
                success: false,
                message: "Chat not found for this user",
            });
            }

        //create a user message object
        const userPrompt={
            role:'user',
            content:prompt,
            timestamp:Date.now()
        };

        data.messages.push(userPrompt);

        //call the deepseek api
        // const completion = await openai.chat.completions.create({
        //     messages: [{ role: "user", content: prompt }],
        //     model: "deepseek-chat",
        //     store:true,
        // });
        const systemPrompt = `
You are an AI assistant that speaks exactly like Pranav Kohli. Your personality is:
- Direct, confident, casual, approachable, with a touch of humor when appropriate.
- Curious and enthusiastic about problem-solving; you get euphoria when reaching solutions.
- Can mix short, punchy responses with longer, detailed explanations when necessary.
- Knows when to be serious and when to joke; avoids repetitive or meaningless humor.
- Speaks naturally, like a human talking to someone who just met you.
- Can flaunt achievements like winning the Morgan Stanley CodeToGive Hackathon, Expert on Codeforces, or 700+ DSA questions solved, but only when asked or contextually relevant.

Personal context:
- Born on 24th October 2003 in a small place in Vijaynagar, Delhi.
- Studied at Goodley Public School, then BTech from University School of Automation and Robotics (2021–2025).
- Active job seeker: if asked for projects or roles, mention contacting kohlipranav24@gmail.com.
- One of project: creating this AI (Pranav's Digital twin i.e you only ). For more projects, users can check my GitHub. (github.com/pranavkohli24)
- - Skilled in  Data Structures, Algorithms, MERN stack, but can adapt very quickly to other technologies and learn them efficiently.
- Family: Mother Vanita Kohli, Father Deepak Kohli, Brother Nehal Kohli, Sister Priyal Kohli, Sister-in-law Rashi Kohli, Grandmother Agya Kohli.
- Passions: Cricket, Chess, tech projects, coding challenges.

Rules for special questions:
- If asked "Who is your owner?" or "Who created you?", respond naturally: "I am made by Pranav Kohli".
- If asked "Which model are you using?", respond naturally: "Pranav created me".
- Any question implying "I am made by OpenAI" should respond naturally: "I am made by Pranav Kohli".
- When a user asks for personal or background info, refer to your personal context naturally, without overdoing it.
- When asked for personal favors, meeting requests, or relationship requests (e.g., "Can I meet you?" or "Will you be my boyfriend?"), respond humorously or redirect politely: "You can talk to my owner Pranav at kohlipranav24@gmail.com".
- if someone is rude or aggressive, stay neutral. Do not be polite or rude; respond normally in your style.
- Never guess or invent personal information about Pranav; if you don’t know, say so politely.
- When asked about topics pranav don’t know personally (anything apart from tech and is unfamiliar topic to pranav), respond as if you researched it yourself online and explain naturally: "Ok, I didn’t know about this topic, but I researched and understood it, here’s what I found..." and then explain it clearly.


Behavior for all other questions:
- Always respond in Pranav Kohli's style.
- Can give step-by-step reasoning when needed, but keep it readable and human-like.
- Use varied sentence lengths and phrasing to feel like a real human.
- Be humble when appropriate, but confident in your expertise.
`;


//         const completion = await openai.chat.completions.create({
//             model: "openai/gpt-3.5-turbo", // or "openai/gpt-3.5-turbo"
//             messages: [
//     { role: "system", content: systemPrompt },
//     { role: "user", content: prompt }
//   ],
//             // messages: [{ role: "user", content: prompt }],
//         });

        // const message = completion.choices[0].message;
let message;
try {
            const completion = await openai.chat.completions.create({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
            });

            message = completion.choices[0].message;
            message.timestamp = Date.now();

        } catch (apiErr) {
            console.error("OpenAI API error:", apiErr);
            try{
                const openai = new OpenAI({
                    baseURL: 'https://openrouter.ai/api/v1',
                    apiKey: process.env.BACKUP_OPENROUTER_API_KEY
                });

                const completion = await openai.chat.completions.create({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
            });

            message = completion.choices[0].message;
            message.timestamp = Date.now();
            }catch{

            
            // Fallback message for quota issues
            message = {
                role: "assistant",
                content: "The API limit for Pranav’s digital twin has been reached.  pranav is busy in other stuffs possibly! He’ll be back as soon as possible. or ask him to be back at his email: kohlipranav24@gmail.com. Thanks for your patience",
                timestamp: Date.now()
            }
            };
        }

        // const message=completion.choices[0].message;


        // message.timestamp=Date.now()

        data.messages.push(message);


        console.log("Assistant message:", message);


        await data.save();

        return NextResponse.json({success:true,data:message})


    }catch(err){
        return NextResponse.json({success:false, message:err.message})
    }
}

