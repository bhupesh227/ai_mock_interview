import AuthForms from '@/components/AuthForms'
import Footer from '@/components/Footer'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-16 py-8">
        <div className="w-full max-w-md">
          <AuthForms type="sign-in" />
        </div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  
  )
}

export default page