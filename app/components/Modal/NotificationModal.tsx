"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface NotificationModalProps {
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
  text: string
  heading?: string
}

export function NotificationModal({ isOpen, onOpen, onClose, text, heading }: any) {
  useEffect(() => {
    if (isOpen && onOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-70 bg-black">
      <div
        className="relative w-full max-w-3xl min-h-[300px] rounded-lg px-8 py-6 shadow-lg flex items-center justify-center"
        style={{ backgroundColor: "#632C0F" }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white" aria-label="Close">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center text-white">
          {heading && <h3 className="mb-2 text-xl font-medium">{heading}</h3>}
          <p className="text-center text-lg">{text}</p>
        </div>
      </div>
    </div>
  )
}

