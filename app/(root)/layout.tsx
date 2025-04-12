import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const RootLayout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Please Sign In</h1>
        <Link href="/sign-in" className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>Sign In</Link>
      </div>
    )
  }
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
          <Image src={"/logo.svg"} alt="logo" width={50} height={50} className='rounded-full' />
          <h2 className='text-primary-100'>HumanAi</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout