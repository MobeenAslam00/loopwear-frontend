"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import SignupForm from "../component/signup-card"
import LoginForm from "../component/login-card"
import { useRouter } from "next/navigation"

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FAF4EF]">
    <div className="w-full max-w-[800px]  bg-white rounded-lg shadow-xl p-8 relative">
      <button onClick={()=>router.back()} className="absolute right-4 top-4">
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </button>

      <div className="flex justify-center mb-10 items-center">
        <Image src="/updatedLogo.png" alt="Loop Wear Logo" width={240} height={50} className="h-16 w-32" />
      </div>

      {isLogin ? (
        <LoginForm onToggleForm={() => setIsLogin(false)} />
      ) : (
        <SignupForm onToggleForm={() => setIsLogin(true)} />
      )}
    </div>
    </main>
  )
}

