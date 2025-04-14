import LogOut from '@/components/LogOut'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  const user = await getCurrentUser();
  return (
    <div className='root-layout'>
      <nav className='w-full flex justify-between items-center'>
        <Link href="/" className='flex items-center gap-2'>
          <Image src={"/logo.svg"} alt="logo" width={50} height={50} className='rounded-full' />
          <h2 className='text-primary-100'>HumanAi</h2>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-light-100 text-lg font-medium">{user.name}</span>

            <LogOut />
          </div>
        )}
      </nav>
      {children}
    </div>
  )
}

export default RootLayout