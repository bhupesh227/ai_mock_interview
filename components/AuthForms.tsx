"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

const formSchema = z.object({
  username: z.string().min(5,{message:"Atleast 5 character"}).max(50),
})


const AuthForms = ({type}:{type:FormType}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
      const isSignUp = type === "sign-up"
  
  return (
    <div className='card-border lg:min-w-[566px]'>
        <div className='flex flex-col gap-6 card py-14 px-8'>
            <div className='flex gap-2 justify-center'>
                <Image src='/logo.svg' alt='logo' height={32} width={38}/>
                <h2 className='text-primary-100'>HumanAi</h2>
            </div>
            <h3>Practice the Mock Interview</h3>
        
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 mt-4 form">
                  
                  <Button type="submit">Submit</Button>
              </form>
          </Form>
        </div>
    </div>
  )
}

export default AuthForms