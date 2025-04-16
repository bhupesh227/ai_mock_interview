
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import InterviewCard from '@/components/InterviewCard'
import {  requireUser} from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Animation from '@/components/Animation'
import AnimatedButton from '@/components/AnimatedButton'



const page = async() => {
  const user = await requireUser();
  const [userInterviews, latestInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);
  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (latestInterview?.length ??0) > 0;
  return (
    <>
      <section className='card-cta flex-col md:flex-row items-center'>
        <div className='flex flex-col gap-6 max-w-lg mt-6 sm:mt-0'>
          <Animation delay={0.2}>
            <h2 className='max-md:text-center'>Hone your skills and become a <span className='text-orange-300'>Confident Communicator</span></h2>
          </Animation>
          <Animation delay={0.6}>
            <p className='text-lg max-md:text-center'>Practice interview questions on Frontend ,Backend etc.<br/>
              Get personalized feedback and tips to improve your performance.
            </p>
          </Animation>
          
            <AnimatedButton href='/interview' >
              Create an Interview
            </AnimatedButton>
          
        </div>
        <Image
          src='/robotinterview.png'
          alt='robot image'
          width={400}
          height={400}
          className='max-md:mt-8 max-md:w-[300px] max-md:h-[250px] '
        />
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interview</h2>
        <div className='interviews-section'>
          { hasPastInterviews ?(
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ): (<p>You haven&apos;t taken any interview</p>
            )
          }  
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
          { hasUpcomingInterviews ?(
              latestInterview?.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ): (<p>There are no upcoming interviews</p>
            )
          }
        </div>
      </section>
    </>
  )
}

export default page