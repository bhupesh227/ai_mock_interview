
import React from 'react'
import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import TechIcons from './TechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';
import { MessageCircleQuestion } from 'lucide-react';


const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  level,
  questions,
  coverImage,
}: InterviewCardProps)=> {

  const feedback = userId && interviewId ? await getFeedbackByInterviewId({
    interviewId ,
    userId,
  }): null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const typeBadgeColor =
    {
      Behavioral: "bg-light-800",
      Mixed: "bg-yellow-600",
      Technical: "bg-blue-600",
    }[normalizedType] || "bg-violet-600";

  
  const levelBadgeColor = {
    "entry level": "bg-emerald-600",
    beginner: "bg-teal-600",
    junior: "bg-lime-600",
    "mid to senior": "bg-amber-500",
    senior: "bg-orange-500",
    advanced: "bg-sky-600",
    expert: "bg-indigo-600",
  }[level?.toLowerCase() || "beginner"] || "bg-green-600";
  
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const imageSrc = coverImage || getRandomInterviewCover();

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview'>
        <div>
          <div className={`absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg ${typeBadgeColor}`}>
            <p className='badge-text text-light-100'>{normalizedType}</p>
          </div>
          <div className={`absolute top-0 left-0 w-fit px-4 py-2 rounded-br-lg ${levelBadgeColor}`}>
            <p className='badge-text text-light-100'>{level}</p>
          </div>
          <Image
            src={imageSrc}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px] mt-6 mx-auto"
          />
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <MessageCircleQuestion />
              <p>
                {questions?.length || 0}
              </p>
            </div>
          </div>

          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className='flex flex-row justify-between'>
          <TechIcons techStack={techstack} />
          <Button className="btn-primary">
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
              >
                {feedback ? "Check Feedback" : "Start Interview"}
              </Link>
            </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard