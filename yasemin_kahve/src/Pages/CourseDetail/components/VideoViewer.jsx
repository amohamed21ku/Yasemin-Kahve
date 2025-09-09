import React, { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react'
import { useTranslate } from '../../../useTranslate'
import './VideoViewer.css'

const VideoViewer = ({ isOpen, videos, currentIndex, onClose, onNext, onPrev }) => {
  const { t } = useTranslate()
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const controlsTimeoutRef = useRef(null)

  const currentVideo = videos && videos[currentIndex]

  useEffect(() => {
    if (isOpen && currentVideo && videoRef.current) {
      videoRef.current.load()
      setIsLoading(true)
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isOpen, currentIndex, currentVideo])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skipBackward()
          break
        case 'ArrowRight':
          e.preventDefault()
          skipForward()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(prev => Math.min(1, prev + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(prev => Math.max(0, prev - 0.1))
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!videoRef.current?.paused)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      setIsMuted(newMuted)
      videoRef.current.muted = newMuted
      if (newMuted) {
        videoRef.current.volume = 0
      } else {
        videoRef.current.volume = volume
      }
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 10)
    }
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 10)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const resetControlsTimeout = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseMove = () => {
    resetControlsTimeout()
  }

  if (!isOpen || !videos || videos.length === 0) return null

  return (
    <div className="video-viewer-overlay" onClick={onClose}>
      <div className="video-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-viewer-header">
          <h3>{currentVideo?.name || `Video ${currentIndex + 1}`}</h3>
          <button onClick={onClose} className="video-viewer-close">
            <X size={24} />
          </button>
        </div>

        <div 
          className="video-player-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
        >
          {isLoading && (
            <div className="video-loading">
              <div className="loading-spinner"></div>
              <p>{t('loadingVideo') || 'Loading video...'}</p>
            </div>
          )}

          <video
            ref={videoRef}
            className="video-player"
            onPlay={handlePlayPause}
            onPause={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onClick={togglePlay}
          >
            <source src={currentVideo?.url} type="video/mp4" />
            <source src={currentVideo?.url} type="video/webm" />
            <source src={currentVideo?.url} type="video/ogg" />
            {t('videoNotSupported') || 'Your browser does not support the video tag.'}
          </video>

          {showControls && !isLoading && (
            <div className="video-controls">
              <div className="progress-bar" onClick={handleSeek}>
                <div 
                  className="progress-filled"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>

              <div className="controls-bottom">
                <div className="controls-left">
                  <button onClick={togglePlay} className="play-pause-btn">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <button onClick={skipBackward} className="skip-btn">
                    <SkipBack size={16} />
                  </button>
                  
                  <button onClick={skipForward} className="skip-btn">
                    <SkipForward size={16} />
                  </button>

                  <div className="volume-control">
                    <button onClick={toggleMute} className="volume-btn">
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>

                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="controls-right">
                  <button onClick={toggleFullscreen} className="fullscreen-btn">
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {videos.length > 1 && (
          <div className="video-navigation">
            <button 
              onClick={onPrev} 
              className="nav-btn prev-btn"
              disabled={currentIndex === 0}
            >
              ← {t('previous') || 'Previous'}
            </button>
            <span className="video-counter">
              {currentIndex + 1} / {videos.length}
            </span>
            <button 
              onClick={onNext} 
              className="nav-btn next-btn"
              disabled={currentIndex === videos.length - 1}
            >
              {t('next') || 'Next'} →
            </button>
          </div>
        )}

        <div className="keyboard-shortcuts">
          <small>
            {t('keyboardShortcuts') || 'Keyboard shortcuts'}: Space/K - Play/Pause, ←/→ - Skip, ↑/↓ - Volume, M - Mute, F - Fullscreen, Esc - Close
          </small>
        </div>
      </div>
    </div>
  )
}

export default VideoViewer