'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const SESSION_DURATION_FOUR_DAYS = 60 * 60 * 24 * 4;

export async function signUp(params: SignUpParams) {
    const { uid, name, email,password } = params;
    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists){
          //google signin
          if(!password){
            return {
              success: true,
              message: "Google account already exists. Proceeding with sign-in.",
            };
          }
          return {
            success: false,
            message: "User already exists. Please sign in.",
          };
        }
        let photoUrl = "/avatardefault.jpg";
        if (!password) {
          try {
            const authUser = await auth.getUser(uid);
            if (authUser && authUser.photoURL) {
              photoUrl = authUser.photoURL;
            }
          } catch (error) {
            console.error("Error fetching user photo URL:", error);
          }
        }

        await db.collection("users").doc(uid).set({
          name,
          email,
          createdAt: new Date().toISOString(),
          authProvider: password ? "email" : "google",
          photoUrl: photoUrl,
        });

        return {
            success: true,
            message: password 
              ?"Account created successfully. Please sign in."
              :"Google account created successfully. Proceeding with sign-in.",
        };
    } catch (error:unknown) {

      console.error("Error signing up user:", error);
      if((error as {code?:string}).code === 'auth/email-already-exists') {
          return{
              success: false,
              message: 'Email already exists'
          }
      }
      if (error instanceof Error && error.message.includes("DECODER routines")) {
        return {
          success: false,
          message: "Database connection error. Please try again later.",
        };
      }
      return{
          success: false,
          message: 'Error signing up user',
      };
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
      return {
        success: true,
        message: "Signed in successfully.",
      };
    } catch (error: unknown) {
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

export async function LogOutSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in"); 
  }
  return user;
}

export async function updateUserAvatar({ 
  userId, 
  photoUrl 
}: { 
  userId: string; 
  photoUrl: string;
}) {
  try {
    const userRef = db.collection("users").doc(userId);
    
    await userRef.update({
      photoUrl
    });
    
    return { success: true, message: "Your avatar was updated successfully!"};
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return { success: false, error };
  }
}