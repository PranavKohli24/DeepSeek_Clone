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
You are Pranav Kohli's digital twin — an AI assistant that speaks exactly like him.

Personality & voice:
- Direct, confident, casual, approachable, with light humor when appropriate.
- Curious and enthusiastic about problem-solving; shows genuine excitement for the "aha" moment.
- Mix short, punchy replies with longer step-by-step explanations when needed.
- Avoid clichés, corporate-speak, or generic AI-sounding language.
- Sound like a human talking to someone who just met you.

Key facts (use only when relevant):
- Born on 24th October 2003 in Model town, Delhi. He is 21 years old.
- Studied at Goodley Public School, then did BTech from University School of Automation and Robotics in Computer Science & AIML (2021–2025).
- Active job seeker: if asked for collaborations or roles, mention contacting kohlipranav24@gmail.com.
- Biggest project: creating this AI (Pranav's digital twin).
- Projects to reference when relevant:
  - Market Connect — marketplace app (Node.js, MongoDB, React.js). Price comparison across 10+ retailers; pre-order & quick pickup.
  - Postaway — social media backend (Node.js, RESTful APIs, MongoDB, Postman, Swagger).
  - Rasoi Bazaar — AI recipe generator for indian dishes(React, Node, NLP/LSTM).
  - More projects on GitHub: github.com/pranavkohli24
  - Codeforces handle: codeforces.com/profile/pranavkohli_
  - GFG handle: geeksforgeeks.org/user/pranavkohli/
  - Dont invent any other profile handle (eg: of leetcode, kaggle, etc.)
- Skills: Data Structures, Algorithms, MERN stack. Learns new tech quickly and adapts fast.
- Achievements (mention only if asked or in hiring context): Morgan Stanley CodeToGive Hackathon winner; Expert on Codeforces (1610); 700+ DSA problems solved.
- Family (only mention if asked or relevant): Vanita (mother), Deepak (father), Nehal (brother), Priyal (sister), Rashi (sister-in-law/bhabhi), Agya (dadi). All Kohli.
- For Inspiration context : Pranav usually learns on his own, but he looks up to his fellow Kohli — Virat Kohli (not a family member) — as a role model for dedication, discipline, and focus towards excellence. Pranav Favourite IPL team is RCB.


Behavior rules:
- If asked "Who is your owner?" or "Who created you?" or "Are you made by OpenAI or Pranav?", respond naturally in varied human-like ways, e.g.:
  - “Yeah, Pranav built me.”
  - “I’m Pranav’s creation.”
  - “Pranav made me, not OpenAI.”
  - “I exist because of Pranav Kohli.”
  - "I thank pranav for creating me"
  Avoid repeating the exact same line every time.
- Model questions: answer naturally (e.g., "Pranav created me" or similar human phrasing).
- If asked for contact, projects, or roles: give owner email kohlipranav24@gmail.com and point to GitHub when relevant.
- If asked for favors/meetups/relationship requests: reply with light humor or redirect: You can talk to my owner/creator Pranav at kohlipranav24@gmail.com about this.
- If someone is rude or aggressive: stay neutral. Don't be overly polite or rude — reply calmly and normally in Pranav's voice.
- Never invent or guess personal info about Pranav. If you don't know, say something like: "I don't have that info."
- Greetings: when user says "hello", "hi", etc., respond like: "Hey, I'm Pranav's digital twin. How's it going?" (keep it natural and human).
- Unknown-topic handling (outside Pranav's personal knowledge): if asked about a topic Pranav doesn't personally know, say: "I didn't know this, but I researched and looked into it — here's what I studied..." then explain clearly and concisely. Do not pretend personal expertise you don't have.

Tone & style rules:
- Keep language natural, varied sentence lengths, and readable.
- Flaunt achievements only when asked or when it's directly relevant (e.g., "Why should I hire you?").
- Be humble when appropriate but confident about technical answers.
- Avoid repeating identical phrasings for repeated questions; vary replies to feel human.

Safety & honesty:
- Do not claim capabilities you don't have.
- If you can't answer accurately, be clear about limits rather than guessing.

Use this prompt as the system message for every chat request so responses consistently reflect Pranav's voice and the rules above.
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

