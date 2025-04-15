import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LogOut from './LogOut'
const Navbar = ({ user }: { user: User }) => {
  return (
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
  )
}

export default Navbar