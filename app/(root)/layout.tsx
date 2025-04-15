
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar'
import {  requireUser } from '@/lib/actions/auth.action'
import React, { ReactNode } from 'react'

const RootLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
  return (
    <div className='root-layout '>
      <Navbar user={user} />
      {children}
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  )
}

export default RootLayout