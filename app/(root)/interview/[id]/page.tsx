
import React from 'react'
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import TechIcons from '@/components/TechIcons';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { MessageCircleQuestion } from 'lucide-react';

const page = async({params}:RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);
    if(!interview) redirect("/");
    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id || '',
    });
    const imageSrc = interview.coverImage || getRandomInterviewCover();
    const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
    const displayType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1).toLowerCase();
    
    const typeBadgeColor =
    {
      Behavioral: "bg-violet-600",
      Mixed: "bg-yellow-600",
      Technical: "bg-blue-600",
    }[displayType] || "bg-violet-600";
  
  const levelBadgeColor = {
    "entry level": "bg-emerald-600",
    beginner: "bg-teal-600",
    junior: "bg-lime-600",
    intermediate: "bg-amber-500",
    senior: "bg-orange-500",
    advanced: "bg-sky-600",
    expert: "bg-indigo-600",
  }[interview.level?.toLowerCase() || "beginner"] || "bg-green-600";

  const displayLevel = interview.level 
    ? interview.level.charAt(0).toUpperCase() + interview.level.slice(1).toLowerCase()
    : "Beginner";
  return (
    <>
        <div className="flex">
            <div className="flex flex-row gap-2 items-center justify-between max-sm:flex-col w-full">
                <div className="flex gap-4 items-center">
                    <Image
                    src={imageSrc}
                    alt="cover-image"
                    width={40}
                    height={40}
                    className="rounded-full object-cover size-[40px]"
                    />
                    <h3 className="capitalize max-sm:text-base">{interview.role} Interview</h3>
                    <TechIcons techStack={interview.techstack} />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-dark-300 px-3 py-2 max-sm:p-1 rounded-full">
                    <MessageCircleQuestion size={18} className="text-amber-300" />
                    <span className="text-white">{interview.questions?.length || 0} questions</span>
                  </div>
                </div>
                <div className="flex gap-2 max-sm:mt-2">
                    <p className={`px-3 py-1.5 rounded-full h-fit , ${levelBadgeColor}`}>
                      <span className="badge-text font-medium text-white ">{displayLevel}</span>
                    </p>
                    <p className={`px-3 py-1.5 rounded-full h-fit " ${typeBadgeColor}`}>
                      <span className="badge-text font-medium text-white">{displayType}</span>
                    </p>
                </div>  
            </div>      
      </div>

      <Agent
        userName={user?.name || ''}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        avatar={user?.photoUrl}
        feedbackId={feedback?.id}
      />
    </>
  )
}

export default page