import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LogOut from './LogOut'
import AvatarSelect from './Avatar/AvatarSelect'
const Navbar = ({ user }: { user: User }) => {
  const userAvatar = user?.photoUrl || "/avatardefault.jpg";
  return (
    <nav className='w-full flex justify-between items-center'>
        <Link href="/" className='flex items-center '>
          <Image src={"/logo.svg"} alt="logo" width={50} height={50} className='rounded-full' />
          <h2 className='hidden sm:block text-blue-400  '>HumanAi</h2>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span title={user.name} className="text-light-100 text-sm sm:text-lg font-medium truncate max-w-[100px] sm:max-w-none">{user.name}</span>
            <AvatarSelect
              currentAvatar={userAvatar}
              userId={user.id}
              userName={user.name}
            />
            <LogOut />
          </div>
        )}
      </nav>
  )
}

export default Navbar