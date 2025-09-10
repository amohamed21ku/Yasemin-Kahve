import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
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

  const updateZIndex = useCallback(() => {
    const newZIndex = getNextZIndex();
    setZIndex(newZIndex);
  }, [getNextZIndex]);

  return (
    <motion.img
      onMouseDown={updateZIndex}
      onTouchStart={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements absolute bg-neutral-200 p-1 pb-4 rounded-lg shadow-lg select-none touch-none",
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
      whileDrag={{ 
        scale: 1.1,
        transition: { duration: 0.1 }
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      animate={{ 
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