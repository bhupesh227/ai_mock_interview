"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button';
import { toast } from 'sonner';
import { LogOutSession } from '@/lib/actions/auth.action';

const LogOut = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const handleLogOut = async () => {
        try {
            setIsLoading(true);
            await LogOutSession();
            toast.success("Logged out successfully.");
            router.push("/sign-in");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <Button
      variant={undefined}
      size={undefined}
      disabled={isLoading}
      title='Log Out'
      className='text-white bg-red-400 hover:text-red-600 cursor-pointer px-2 py-1 md:px-4 md:py-2'
      onClick={handleLogOut}
    >
        LogOut
    </Button>
  )
}

export default LogOut