
import React, { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const layout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(isUserAuthenticated) {
    redirect("/");
  }
  return (
    <div className='login-pattern'>
      <div className='auth-layout '>
        {children}
      </div>
    </div>
    
  )
}

export default layout