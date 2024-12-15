'use client'

import { useState, useEffect, useCallback } from 'react'

interface ImageCompareProps {
  original: string
  enhanced: string
  aspectRatio?: number
}

export default function ImageCompare({ original, enhanced, aspectRatio = 16/9 }: ImageCompareProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState(50)
  const [containerHeight, setContainerHeight] = useState(0)

  const updateContainerHeight = useCallback((containerWidth: number) => {
    const height = containerWidth / aspectRatio;
    const maxHeight = window.innerHeight * 0.7; // 70vh
    setContainerHeight(Math.min(height, maxHeight));
  }, [aspectRatio])

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return

      const slider = document.getElementById('comparison-slider')
      if (!slider) return

      const rect = slider.getBoundingClientRect()
      
      let clientX
      if (e instanceof MouseEvent) {
        clientX = e.clientX
      } else {
        clientX = e.touches[0].clientX
      }

      const position = ((clientX - rect.left) / rect.width) * 100
      setPosition(Math.min(Math.max(position, 0), 100))
    },
    [isResizing]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    const container = document.getElementById('comparison-slider')
    if (container) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateContainerHeight(entry.contentRect.width)
        }
      })

      resizeObserver.observe(container)
      return () => resizeObserver.disconnect()
    }
  }, [updateContainerHeight])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isResizing, handleMove, handleMouseUp])

  return (
    <div 
      id="comparison-slider"
      className="relative w-full select-none"
      style={{ 
        height: `${containerHeight}px`,
        maxHeight: '70vh'
      }}
    >
      {/* Enhanced Image (Background) */}
      <div className="absolute inset-0" style={{ width: '100%' }}>
        <img 
          src={enhanced} 
          alt="Enhanced" 
          className="w-full h-full object-cover bg-gray-100"
        />
      </div>

      {/* Original Image (Foreground) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img 
          src={original} 
          alt="Original" 
          className="w-full h-full object-cover bg-gray-100"
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize select-none"
        style={{ left: `${position}%` }}
        onMouseDown={() => setIsResizing(true)}
        onTouchStart={() => setIsResizing(true)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 text-sm rounded">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 text-sm rounded">
        Enhanced
      </div>
    </div>
  )
}
