"use client";
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';
import { toast } from 'sonner';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}
interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({
    userName,
    userId,
    type,
    interviewId,
    questions,
    avatar,
    feedbackId,
    }:AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [lastActivityTimestamp, setLastActivityTimestamp] = useState<number>(Date.now());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalQuestions = questions ? questions.length : 0;
    const INACTIVITY_TIMEOUT = 10000; 
    const [latestMessage, setLatestMessage] = useState<string>("");

    const handleDisconnect = useCallback( () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    },[]);

    // Handle inactivity timeout
    useEffect(() => {
        if(callStatus !== CallStatus.ACTIVE) return;

        const inactivityTimer = setInterval(() => {
            const now = Date.now();
            if (now - lastActivityTimestamp > INACTIVITY_TIMEOUT) {
              console.log("Inactivity timeout reached, ending call");
              handleDisconnect();
            }
        }, 5000);
        return () => clearInterval(inactivityTimer);
    },[callStatus, lastActivityTimestamp, handleDisconnect,INACTIVITY_TIMEOUT]);

    useEffect(()=>{
        const onCallStart = () => { 
            setCallStatus(CallStatus.ACTIVE);
            setLastActivityTimestamp(Date.now());
        };
        const onCallEnd = () => { setCallStatus(CallStatus.FINISHED);};
      
        const onMessage = (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [...prev, newMessage]);
                setLastActivityTimestamp(Date.now());
            
                if (message.role === "assistant" && 
                    totalQuestions > 0 && 
                    currentQuestionIndex < totalQuestions) {
                
                    if (message.transcript.includes("?") && questions) {
                       
                        const isMainQuestion = questions.some(question => {
                       
                        const simplifiedTranscript = message.transcript.toLowerCase().replace(/[^\w\s]/g, '');
                        const simplifiedQuestion = question.toLowerCase().replace(/[^\w\s]/g, '');
                     
                        return simplifiedTranscript.includes(simplifiedQuestion.substring(0, Math.min(30, simplifiedQuestion.length)));
                        });
                        
                        if (isMainQuestion) {
                            setCurrentQuestionIndex(prev => prev + 1);
                            console.log(`Question ${currentQuestionIndex + 1}/${totalQuestions} asked (matched with prepared question)`);
                        }
                    }
                }
                if (currentQuestionIndex >= totalQuestions && totalQuestions > 0) {
                    if (message.role === "user") {
                      console.log("All questions completed and user has responded, ending call automatically");
                      
                      setTimeout(() => {
                        handleDisconnect();
                      }, 15000); 
                    }
                }
            }
        };
      
        const onSpeechStart = () => {
            setLastActivityTimestamp(Date.now()); 
            setIsSpeaking(true); 
        };
        const onSpeechEnd = () => { setIsSpeaking(false); };
      
        const onError = (error: Error) => {
            console.log("Error:", error);
        };
      
        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);
    
        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    },[currentQuestionIndex, totalQuestions, handleDisconnect, questions]);


    // Han messages and call status changes
    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1].content;
            setLatestMessage(latestMessage);
        }
        const handleGenerateFeedback = async (messages: SavedMessage[]) => {
            toast.loading("Generating feedback...",{
                description: "This may take a few seconds",
                duration: 2000,
            });
            const { success, feedbackId: id } = await createFeedback({
                interviewId: interviewId!,
                userId: userId!,
                transcript: messages,
                feedbackId,
            });
    
            if (success && id) {
                toast.success("Feedback generated successfully", {
                    description: "You can view the feedback now",
                    duration: 2000,
                });
                router.push(`/interview/${interviewId}/feedback`);
            } else {
                console.log("Error saving feedback");
                toast.error("Error generating feedback", {
                    description: "Please try again",
                    duration: 2000,
                });
                router.push("/");
            }
        }
        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                toast.success("Interview generated successfully", {
                    description: "You can view the interview now",
                })
              router.push("/");
            } else {
              handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId, interviewId, feedbackId, router]);

    const  handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        if(type === "generate") {
            toast.loading("Generating interview...",{
                duration: 2000,
            });

            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
                variableValues:{
                    username : userName,
                    userid : userId,
                }
            })
        }else{
            let formattedQuestions = '';
            if (questions) {
                formattedQuestions = questions
                  .map((question) => `- ${question}`)
                  .join("\n");
            }
            await vapi.start(interviewer, {
                variableValues: {
                  questions: formattedQuestions,
                },
            });
        }
    }

       
  return (
    <>
        <div className="call-view">
            <div className="card-interviewer">
                <div className="avatar">
                    <Image
                    src="/robottalk.png"
                    alt="profile-image"
                    width={80}
                    height={54}
                    className="object-cover rounded-b-full pb-2"
                    />
                    {isSpeaking && <span className="animate-speak" />}
                </div>
                <h3>AI Interviewer</h3>
            </div>
            <div className="card-border">
                <div className="card-content">
                    <Image
                    src={avatar || "/avatardefault.jpg"}
                    alt="user-avatar"
                    width={539}
                    height={539}
                    className="rounded-full object-cover size-[120px]"
                    />
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>

        {messages.length > 0 && (
            <div className="transcript-border">
                <div className="transcript">
                    <p
                    key={latestMessage}
                    className={cn(
                        "transition-opacity duration-500 opacity-0",
                        "animate-fadeIn opacity-100"
                    )}
                    >
                        {latestMessage}
                    </p>
                </div>
            </div>
        )}

        <div className="w-full flex justify-center">
            {callStatus !== "ACTIVE" ? (
                <button className="relative btn-call" onClick={handleCall}>
                    <span
                        className={cn(
                            "absolute animate-ping rounded-full opacity-75",
                            callStatus !== "CONNECTING" && "hidden"
                    )}
                    />

                    <span className="relative">
                        {callStatus === "INACTIVE" || callStatus === "FINISHED"
                            ? "Call"
                            : <span className='dots'>. . .</span>}
                    </span>
                </button>
            ) : (
                <button className="btn-disconnect cursor-pointer" onClick={handleDisconnect} >
                    End
                </button>
            )}
      </div>
    </>
  )
}

export default Agent