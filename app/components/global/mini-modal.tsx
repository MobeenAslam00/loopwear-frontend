"use client"

import * as React from "react"
import { X } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface MiniModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function MiniModal({
  isOpen,
  onClose,
  message,
  actionLabel,
  onAction,
}: MiniModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#6E391D] text-white p-8 rounded-2xl border-none">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center space-y-4">
          <p className="text-xl font-medium">{message}</p>
          {actionLabel && (
            <button
              onClick={() => {
                onAction?.()
                onClose()
              }}
              className="text-white/90 hover:text-white transition-colors text-lg underline underline-offset-4"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
