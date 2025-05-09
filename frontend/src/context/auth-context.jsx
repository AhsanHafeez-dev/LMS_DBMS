"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate:false,
    role:null,
    id:null,
    userName:null
  });
  const [loading, setLoading] = useState(true);


  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      
      if (data.success) {
        toast.success("Registration successful! Please log in.");
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    }
  }


  async function handleLoginUser(event) {
    event.preventDefault();

    try {
      const data = await loginService(signInFormData);

    if (data.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );

    
      setAuth({
        authenticate:true,
        role: data.data.role,
        id: data.data.id,
        userName:data.data.userName,
      });

      toast.success("Login successful!");
    } else {
      setAuth({
        authenticate: false,
        userName: null,
        role:null,
        id:null
      });
      toast.error(data.message || "Login failed");
    }
  }catch (error) {
    console.error("Login error:", error);
    toast.error(error?.response?.data?.message || "Login failed");
    setAuth({
      authenticate: false,
        userName: null,
        role:null,
        id:null
    });
  }
}

  

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.role,
          id:data.data.id,
          userName:data.data.userName,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          userName: null,
          role:null,
          id:null
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
      id:null,
      userName:null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);


  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}


export function useAuthContext(){
const context = useContext(AuthContext);
try{
  return context;
}catch (error){
  throw new Error("auth context not provided!")
}
}