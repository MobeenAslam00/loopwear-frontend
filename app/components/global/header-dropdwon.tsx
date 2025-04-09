"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, User } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { role } from "@/lib/user"

export default function HeaderDropdown() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // Check if userId exists in localStorage
    const user = localStorage.getItem('user') 
    if(user){
      const parsedUser = JSON.parse(user)
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    // Redirect to login page
    window.location.href = '/login'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white border border-[#6d4534] rounded-full px-3 py-1 text-sm flex items-center">
          {isLoggedIn ? 'Account' : 'Login'}
          <span className="ml-1">👤</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {isLoggedIn ? (
          <>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
        
             
                <DropdownMenuItem asChild>
              <Link href="/vendor" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>lender</span>
              </Link>
            </DropdownMenuItem> 
            <DropdownMenuItem asChild>
              <Link href="/history" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Order History</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Login</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="/vendor" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Vendor</span>
              </Link>
            </DropdownMenuItem>  */}
            {/* <DropdownMenuItem asChild>
              <Link href="/history" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>History</span>
              </Link>
            </DropdownMenuItem> */}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
