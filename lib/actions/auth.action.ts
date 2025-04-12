'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";


const SESSION_DURATION_FOUR_DAYS = 60 * 60 * 24 * 4;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

          
            await db.collection("users").doc(uid).set({
            name,
            email,
            
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error:any) {
        console.error("Error signing up user:", error);
        if(error.code === 'auth/email-already-exists') {
            return{
                success: false,
                message: 'Email already exists'
            }
        }
        return{
            success: false,
            message: 'Error signing up user'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
  
    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_FOUR_DAYS * 1000, 
    });
  
    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_DURATION_FOUR_DAYS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
  
    try {
      const userRecord = await auth.getUserByEmail(email);
      if (!userRecord)
        return {
          success: false,
          message: "User does not exist. Create an account.",
        };
  
      await setSessionCookie(idToken);
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: "Failed to log into account. Please try again.",
      };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}