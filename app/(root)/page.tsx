
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser, getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/auth.action'


const page = async() => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterview?.length! > 0;
  return (
    <>
      <section className='card-cta flex-wrap'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Honor Your skills & become a good communicator</h2>
          <p className='text-lg'>Give Interview Questions & know how good did you performed</p>
          <div className='flex max-md:justify-center gap-4'>
            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href='/interview'>
                Start Mock Interview
              </Link>
            </Button>
          </div>
        </div>
        <Image
          src='/robotinterview.png'
          alt='hero'
          width={400}
          height={400}
          className='max-sm:hidden'
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