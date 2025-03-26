"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import Link from "next/link"

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-play when component mounts
  useEffect(() => {
    if (videoRef.current) {
      // Try to play the video
      const playPromise = videoRef.current.play()

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            // Autoplay was prevented, keep the play button visible
            console.log("Autoplay prevented:", error)
          })
      }
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-[#f9f3eb]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Video Side */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-xl">
            <video
              ref={videoRef}
              src="/loopwear.mp4"
              className="w-full h-full object-cover"
              playsInline
              muted // Adding muted improves chances of autoplay working
              loop
            />

            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group w-full h-full"
              >
                <Play className="w-16 h-16 text-white" />
                <span className="sr-only">Play video</span>
              </button>
            )}

            {isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <Pause className="w-6 h-6 text-white" />
                <span className="sr-only">Pause video</span>
              </button>
            )}
          </div>

          {/* Text Content Side */}
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif">We got you!</h2>
            <p className="text-xl md:text-2xl text-[#462920] font-serif leading-relaxed">
              No Budget? No Problem — Rent the Look with our seamless renting process and Rock the Style
            </p>
            <div>
              <Link href={'/products?type=rent'} className="bg-[#6d4534] text-white px-8 py-3 rounded hover:bg-[#5a3a2c] transition-colors text-lg">
                Rent Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

