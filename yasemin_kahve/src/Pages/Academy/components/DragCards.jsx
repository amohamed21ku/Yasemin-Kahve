import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const DragCards = () => {
  return (
    <section className="relative grid min-h-screen w-full place-content-center overflow-hidden">
      <h2 className="relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]">
        Yasemin <span className="text-amber-500"></span>
      </h2>
      <Cards />
    </section>
  );
};

const Cards = () => {
  const containerRef = useRef(null);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      <Card
        containerRef={containerRef}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501813/3_vr23kr.jpg"
        alt="Coffee image"
        rotate="6deg"
        top="20%"
        left="15%"
        className="w-24 md:w-56"
      />
      <Card
        containerRef={containerRef}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501811/5_jvecjx.jpg"
        alt="Coffee image"
        rotate="12deg"
        top="45%"
        left="60%"
        className="w-20 md:w-48"
      />
      <Card
        containerRef={containerRef}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501768/4_ir2mzj.jpg"
        alt="Coffee image"
        rotate="-6deg"
        top="20%"
        left="40%"
        className="w-32 md:w-80"
      />
      <Card
        containerRef={containerRef}
        src="https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501765/2_cvqxzm.jpg"
        alt="Coffee image"
        rotate="8deg"
        top="50%"
        left="30%"
        className="w-28 md:w-72"
      />
      <Card
        containerRef={containerRef}
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

const Card = ({ containerRef, src, alt, top, left, rotate, className }) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      let zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

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
        "drag-elements absolute bg-neutral-200 p-1 pb-4 rounded-lg shadow-lg",
        className
      )}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      dragElastic={0.65}
      whileDrag={{ scale: 1.1 }}
      whileHover={{ scale: 1.05 }}
    />
  );
};

export default DragCards;