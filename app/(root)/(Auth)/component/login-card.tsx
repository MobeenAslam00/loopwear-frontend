"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<any>();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOOP_SERVER}/user/login`,
        data
      );
      const user = response.data.user;

      console.log('user',user)
      if (user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        setRole(user.role);
        if (user.role === "User") {
          router.push("/");
        } else if (user.role === "Vendor") {
          router.push("/");
        } else if (user.role === "Admin") {
          router.push("/admin");
        } else {
          localStorage.removeItem('role')
          setError("Invalid role");
        }
      } else {
        setError("Invalid user data");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  function setRole(role: string) {
    if (!role) return;
    localStorage.setItem("role", role);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-center mb-10">Log in</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your Gmail"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            {...register("email", { required: "Email is required" })}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
          {errors.email && (
  <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>
)}

        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </button>
          
          {errors.password && (
              <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
            )}

        </div>


        <div className="flex justify-between mt-10">
        
  <p className="text-base">
    <Link href={'/reset-password'} type="button" className="font-bold text-black">
      Forgot Password?
    </Link>
  </p>

          <button
            type="submit"
            className="bg-[#7ab3d1] text-black px-8 py-3 rounded-xl border-[1px] border-black hover:bg-[#6aa0be] transition-colors font-medium"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
