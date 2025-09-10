import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const DragCards = () => {
  return (
  <section className="relative grid min-h-screen w-full place-content-center overflow-hidden">
      <div className="relative z-0 flex items-center justify-center">
        <img 
          src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501761/Academy_logo_k39bjk.png"
          alt="Academy Logo"
          className="w-[40vw] md:w-[300px] opacity-20 grayscale"
        />
      </div>
      <Cards />
    </section>
  );
};

const Cards = () => {
  const containerRef = useRef(null);
  const [maxZIndex, setMaxZIndex] = useState(5);

  const getNextZIndex = useCallback(() => {
    setMaxZIndex(prev => prev + 1);
    return maxZIndex + 1;
  }, [maxZIndex]);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      <Card
        containerRef={containerRef}
        getNextZIndex={getNextZIndex}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501813/3_vr23kr.jpg"
        alt="Coffee image"
        rotate="6deg"
        top="20%"
        left="15%"
        className="w-24 md:w-56"
      />
      <Card
        containerRef={containerRef}
        getNextZIndex={getNextZIndex}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501811/5_jvecjx.jpg"
        alt="Coffee image"
        rotate="12deg"
        top="45%"
        left="60%"
        className="w-20 md:w-48"
      />
      <Card
        containerRef={containerRef}
        getNextZIndex={getNextZIndex}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501768/4_ir2mzj.jpg"
        alt="Coffee image"
        rotate="-6deg"
        top="20%"
        left="40%"
        className="w-32 md:w-80"
      />
      <Card
        containerRef={containerRef}
        getNextZIndex={getNextZIndex}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501765/2_cvqxzm.jpg"
        alt="Coffee image"
        rotate="8deg"
        top="50%"
        left="30%"
        className="w-28 md:w-72"
      />
      <Card
        containerRef={containerRef}
        getNextZIndex={getNextZIndex}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501761/Academy_logo_k39bjk.png"
        alt="Academy logo"
        rotate="18deg"
        top="15%"
        left="65%"
        className="w-24 md:w-64"
      />
    </div>
  );
};

const Card = ({ containerRef, getNextZIndex, src, alt, top, left, rotate, className }) => {
  const [zIndex, setZIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const updateZIndex = useCallback(() => {
    const newZIndex = getNextZIndex();
    setZIndex(newZIndex);
  }, [getNextZIndex]);

  const handleTap = useCallback(async () => {
    if (isDragging) return;
    
    // Random swipe direction
    const directions = [
      { x: 300, y: -50 },   // Right-up
      { x: -300, y: -50 },  // Left-up  
      { x: 200, y: 100 },   // Right-down
      { x: -200, y: 100 },  // Left-down
      { x: 0, y: -200 },    // Up
    ];
    
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
    // Animate swipe
    await controls.start({
      x: randomDirection.x,
      y: randomDirection.y,
      rotate: (Math.random() - 0.5) * 60, // Random rotation
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1]
      }
    });
    
    // Reset position after animation
    controls.set({
      x: 0,
      y: 0,
      rotate: rotate,
      scale: 1,
      opacity: 1
    });
  }, [controls, isDragging, rotate]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    updateZIndex();
  }, [updateZIndex]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <motion.img
      animate={controls}
      style={{
        top,
        left,
        rotate,
        zIndex,
        x,
        y
      }}
      className={twMerge(
        "drag-elements absolute bg-neutral-200 p-1 pb-4 rounded-lg shadow-lg select-none cursor-pointer",
        className
      )}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      dragElastic={0.1}
      dragMomentum={false}
      dragTransition={{ 
        bounceStiffness: 600, 
        bounceDamping: 20,
        power: 0.3,
        timeConstant: 200
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      whileDrag={{ 
        scale: 1.1,
        transition: { duration: 0.1 }
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      initial={{ 
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
    />
  );
};

export default DragCards;