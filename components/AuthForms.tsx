"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Form } from './ui/form'
import FormField from './FormField'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'



const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(5, "Name should be atleast 5 character") : z.string().optional(),
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })
}


const AuthForms = ({type}:{type:FormType}) => {
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
        },
      })
     
      const router = useRouter();

      function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          if (type === "sign-up") {
            toast.success("Sign Up Successful")
            router.push("/sign-in")
          }else{
            toast.success("Log In Successful")
            router.push("/")
          }
        } catch (error) {
          console.log(error);
          toast.error(`Error: ${error}`)
          
        }
      }
      const isSignUp = type === "sign-up"
  
  return (
    <div className='card-border lg:min-w-[566px]'>
        <div className='flex flex-col gap-6 card py-14 px-8'>
            <div className='flex gap-2 justify-center'>
                <Image src='/logo.svg' alt='logo' height={32} width={38}/>
                <h2 className='text-blue-300'>HumanAi</h2>
            </div>
            <h3 className='text-amber-200'>Practice the Mock Interview</h3>
        
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit,(errors)=>{
                 Object.values(errors)
                 .map((error: any) => error?.message)
                 .filter(Boolean)
                 .forEach((message: string) => {
                     toast.error(message,{
                        description: "Please check your input",
                        duration: 2000,
                     })
                 })
                })} className="w-full space-y-8 mt-4 form">
                  {isSignUp && (
                    <FormField
                      control={form.control}
                      name="name"
                      label="Name"
                      placeholder="Your Name"
                      type="text"
                  />
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Your email address"
                    type="email"
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                  />

                  <Button className='btn' type="submit">
                    {isSignUp ? "Sign Up" : "LogIn"}
                  </Button>
              </form>
          </Form>
          <p className='text-center text-teal-400'>
            {isSignUp ? "Already have an account?" : "Don't have an account?"} 
            <Link href={isSignUp ? "/sign-in" : "/sign-up"} className='text-blue-400 font-semibold ml-1'>
              {isSignUp ? "LogIn" : "SignUp"}
            </Link>
          </p>
        </div>
    </div>
  )
}

export default AuthForms