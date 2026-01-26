'use client'

import { useCallback, useRef } from 'react'

/**
 * Custom hook for managing audio playback
 * Used for paper-turning sound effects and other UI audio feedback
 */
export function useAudio(soundPath: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(soundPath)
        audioRef.current.preload = 'auto'
      }

      // Reset playback to start
      audioRef.current.currentTime = 0

      // Play the sound with promise handling for modern browsers
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Audio playback failed - likely due to autoplay policies
          // This is acceptable, fail silently for accessibility
        })
      }
    } catch (error) {
      // Fail silently for accessibility
      console.log('[v0] Audio playback unavailable')
    }
  }, [soundPath])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return { play, stop }
}
