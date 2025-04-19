"use client"
import React, { useState } from 'react'
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
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signIn, signUp } from '@/lib/actions/auth.action'



const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(5, "Name should be atleast 5 character") : z.string().optional(),
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })
}


const AuthForms = ({type}:{type:FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type); 
  const isSignUp = type === "sign-up"
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    })
    
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
          const { name, email, password } = values;
          //firebase authenticating function
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          //firebase signup function
          const result = await signUp({
            uid: userCredential.user.uid,
            name : name!,
            email,
            password,
          });
          if (!result?.success) {
            toast.error(result?.message)
            return;
          }
          toast.success("Sign Up Successful")
          router.push("/sign-in")
      }else{
          const { email, password } = values;
          //firebase authenticating function
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          const idToken = await userCredential.user.getIdToken();
          if(!idToken) {
            toast.error("Error signing in");
            return;
          }
          await signIn({
            email,
            idToken,
          })
          toast.success("Log In Successful");
          router.push("/")
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`)
      
    }
  }

  const handleGoogleSignIn = async () => {
    try {
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        try {
            const userCredential = await signInWithPopup(auth, provider);
            
            const user = userCredential.user;

            const idToken = await user.getIdToken();

            if (!idToken) {
                toast.error('Error signing in with Google');
                setIsGoogleLoading(false);
                return;
            }
            const signUpResult = await signUp({
                uid: user.uid,
                name: user.displayName || 'User',
                email: user.email || '',
                password: '' // Empty password indicates Google sign-in
            });
            
            if (!signUpResult?.success) {
                toast.error(signUpResult?.message || 'Failed to create account');
                setIsGoogleLoading(false);
                return;
            }
            
            
            const signInResult = await signIn({
                email: user.email || '',
                idToken
            });
            
            if (!signInResult?.success) {
                toast.error(signInResult?.message || 'Failed to sign in');
                setIsGoogleLoading(false);
                return;
            }
            
            toast.success('Signed in successfully with Google');
            
            router.replace('/');
        } catch (popupError: unknown) {
            console.error("Popup error:", popupError);
            
            if ((popupError as { code?: string }).code === 'auth/popup-closed-by-user' ||
                (popupError as { code?: string }).code === 'auth/popup-blocked' ||
                (popupError as Error).message?.includes('Cross-Origin-Opener-Policy')) {
                
                toast.error('Popup authentication failed. Please try again.');
                throw popupError; // Re-throw to be caught by the outer catch
            }
        }
    } catch (error: unknown) {
        console.error('Google sign-in error:', error);

        if ((error as { code?: string }).code === 'auth/popup-closed-by-user') {
            toast.error('Sign-in cancelled. Please try again.');
        } else if ((error as { code?: string }).code === 'auth/popup-blocked') {
            toast.error('Pop-up blocked by browser. Please allow pop-ups for this site.');
        } else {
            toast.error(`Google sign-in failed: ${(error as Error)?.message || 'Unknown error'}`);
        }
    } finally {
        setIsGoogleLoading(false);
    }
};

      
  return (
    <div className='card-border md:w-[450px]'>
        <div className='flex flex-col gap-6 card py-14 px-8'>
            <div className='flex items-center justify-center gap-2'>
                <Image src='/logo.svg' alt='logo' height={32} width={38}/>
                <h2 className='text-blue-300'>HumanAi</h2>
            </div>
            <h3 className='text-amber-200 text-center'>Practice the Mock Interview</h3>
        
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

                  <Button className='btn mt-5' type="submit">
                    {isSignUp ? "Sign Up" : "LogIn"}
                  </Button>
              </form>
          </Form>
          <div className="relative flex items-center justify-center mt-2 mb-1">
              <div className="absolute border-t border-gray-700 w-full"></div>
              <span className="relative px-4 bg-gray-700 text-light-300 text-sm rounded-lg">or</span>
          </div>
          
          <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-dark-300 transition-colors cursor cursor-pointer"
            >
              {isGoogleLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-200 rounded-full border-t-transparent"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
              )}
              <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
            </Button>
          

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