"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SignupFormProps {
  onToggleForm: () => void
}

export default function SignupForm({ onToggleForm }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [role, setRole] = useState("User") // Default role is User (Customer)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/user/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "User",
      })
      if (response.data) {
        onToggleForm()
      } else {
        setError(response.data.message)
      }

      console.log("Signup successful:", response)
    } catch (err) {
      setError("Signup failed. Please try again.")
      console.log("Signup error:", err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-center mb-10">New To LoopWear?</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Your Name"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            required
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <User className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Gmail"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            required
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Your Password"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-4 bg-[#f8efe0] rounded-md pr-12 text-gray-600 placeholder-gray-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Lock className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* <div className="relative">
          <Select onValueChange={handleRoleChange} defaultValue="Customer">
            <SelectTrigger className="w-full p-4 bg-[#f8efe0] rounded-md text-gray-600 text-lg">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="flex items-center justify-between mt-10">
          <p className="text-base">
            Already have an account?{" "}
            <button type="button" onClick={onToggleForm} className="font-bold text-black">
              Login
            </button>{" "}
            here
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#7ab3d1] text-black px-8 py-3 rounded-xl border-[1px] border-black hover:bg-[#6aa0be] transition-colors font-medium"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  )
}

