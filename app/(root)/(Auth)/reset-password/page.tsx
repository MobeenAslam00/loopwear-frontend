"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Eye, EyeOff, Mail, X } from "lucide-react";
import Image from "next/image";
import router, { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [serverOtp, setServerOtp] = useState(null);
  const router = useRouter()

  function sleep(milliseconds:number) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOOP_SERVER}/user/reset-otp`,
        { email }
      );
      
      if (response.data.success) {
        sleep(2000)
        setServerOtp(response.data.otp);
        setShowOtpModal(true);
      } else {
        setError("Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {

    if (otp !== String(serverOtp)) {
        alert("Invalid OTP")
      setError("Invalid OTP");
      return;
    }

    if(password!=confirmPassword){
        alert("password not match")
        return
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOOP_SERVER}/user/reset-pass`,
        { email, password }
      );
      if (response.data.success) {
        setShowOtpModal(false);
        alert("Password reset successfully");
        router.push('/login')
      } else {
        setError("Failed to reset password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

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

    <div>
      <h1 className="text-2xl font-medium text-center mb-10">Forget Password</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            autoComplete="off"
  autoCorrect="off"
  spellCheck="false"
            placeholder="Enter your Email"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            {...register("email", { required: "Email is required" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#7ab3d1] text-black px-8 py-3 rounded-xl border-[1px] border-black hover:bg-[#6aa0be] transition-colors font-medium w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Reset Password"}
        </button>
      </form>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-4">Enter OTP</h2>
            <input
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
              type="text"
              maxLength={4}
              placeholder="Enter 4-digit OTP"
              className="w-full p-4 bg-[#f8efe0] rounded-md text-gray-600 placeholder-gray-500 text-lg text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg mt-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg mt-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="mt-4 bg-[#7ab3d1] text-black px-6 py-2 rounded-md border border-black hover:bg-[#6aa0be] transition-colors w-full"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </div>

    </div>
    </main>
  );
}