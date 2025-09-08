import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

const ImageViewer = ({ 
  isOpen, 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev, 
  onIndexChange 
}) => {
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }, [currentIndex])

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev * 1.5, 3))
  }

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev / 1.5, 0.5))
  }

  const resetZoom = () => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const handleKeyPress = (e) => {
    if (!isOpen) return
    
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        onPrev()
        break
      case 'ArrowRight':
        onNext()
        break
      case '+':
      case '=':
        zoomIn()
        break
      case '-':
        zoomOut()
        break
      case '0':
        resetZoom()
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        onNext()
      }
      if (isRightSwipe) {
        onPrev()
      }
    }
  }

  if (!isOpen || !images || images.length === 0) return null

  return (
    <div 
      className="image-viewer-modal"
      onClick={(e) => {
        if (e.target.className === 'image-viewer-modal') onClose()
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 10001
        }}
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={onNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001
            }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10001
        }}
      >
        <button
          onClick={zoomOut}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '25px',
            padding: '10px 15px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <ZoomOut size={16} />
        </button>
        
        <button
          onClick={resetZoom}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '25px',
            padding: '10px 15px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <RotateCcw size={16} />
          {Math.round(imageZoom * 100)}%
        </button>
        
        <button
          onClick={zoomIn}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '25px',
            padding: '10px 15px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px'
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main Image */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`Course image ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
            transition: 'transform 0.3s ease',
            cursor: imageZoom > 1 ? 'grab' : 'default'
          }}
          draggable={false}
          onMouseDown={(e) => {
            if (imageZoom > 1) {
              const startX = e.clientX - imagePosition.x
              const startY = e.clientY - imagePosition.y
              
              const handleMouseMove = (e) => {
                setImagePosition({
                  x: e.clientX - startX,
                  y: e.clientY - startY
                })
              }
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }
          }}
        />
      </div>
    </div>
  )
}

export default ImageViewer