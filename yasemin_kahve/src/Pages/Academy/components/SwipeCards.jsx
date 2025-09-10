import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const SwipeCards = () => {
  const [cards, setCards] = useState(cardData);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = cardData.map((card) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = card.url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  const removeCard = (id) => {
    setCards((prevCards) => {
      const filteredCards = prevCards.filter((card) => card.id !== id);
      const removedCard = prevCards.find((card) => card.id === id);
      
      // Always add the swiped card back to the beginning of the stack for infinite loop
      const newCard = {
        ...removedCard,
        id: Date.now() + Math.random(), // Generate new unique ID
      };
      
      return [newCard, ...filteredCards];
    });
  };

  return (
    <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
      <div className="relative h-64 w-48 md:h-96 md:w-72">
        {!imagesLoaded ? (
          <div className="absolute top-0 left-0 h-64 w-48 md:h-96 md:w-72 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading images...</div>
          </div>
        ) : (
          cards.map((card) => {
            return (
              <Card key={card.id} cards={cards} removeCard={removeCard} {...card} />
            );
          })
        )}
      </div>
    </div>
  );
};

const Card = ({ id, url, removeCard, cards }) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const scale = useTransform(x, [-150, 0, 150], [0.95, 1, 0.95]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragStart = (event, info) => {
    // On mobile, check if this is more of a vertical scroll gesture
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const initialY = info.point.y;
      const initialX = info.point.x;
      
      // Store initial touch position for comparison during drag
      event.currentTarget._initialY = initialY;
      event.currentTarget._initialX = initialX;
    }
  };

  const handleDrag = (event, info) => {
    // On mobile, detect if user is primarily scrolling vertically
    const isMobile = window.innerWidth <= 768;
    if (isMobile && event.currentTarget._initialY !== undefined) {
      const deltaY = Math.abs(info.point.y - event.currentTarget._initialY);
      const deltaX = Math.abs(info.point.x - event.currentTarget._initialX);
      
      // If vertical movement is greater than horizontal, don't drag the card
      if (deltaY > deltaX && deltaY > 10) {
        x.set(0); // Reset card position
        return false; // Cancel drag
      }
    }
  };

  const handleDragEnd = (event, info) => {
    const xValue = x.get();
    const velocity = info.velocity.x;
    
    // Clean up mobile tracking
    if (event.currentTarget._initialY !== undefined) {
      delete event.currentTarget._initialY;
      delete event.currentTarget._initialX;
    }
    
    // Much more sensitive threshold - even smallest swipe triggers next card
    if (Math.abs(xValue) > 15 || Math.abs(velocity) > 100) {
      removeCard(id);
    }
  };

  return (
    <motion.img
      src={url}
      alt="Coffee card"
      className="absolute top-0 left-0 h-64 w-48 md:h-96 md:w-72 origin-bottom rounded-lg bg-white object-cover select-none"
      style={{
        x,
        opacity: isFront ? opacity : 0.8,
        rotate,
        scale: isFront ? scale : 0.98,
        cursor: isFront ? 'grab' : 'default',
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : "0 5px 15px rgba(0, 0, 0, 0.2)",
        zIndex: isFront ? 10 : cards.length - id,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        transform: 'translateZ(0)',
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
        mass: 0.5,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      dragElastic={0.2}
      dragMomentum={true}
      dragTransition={{ 
        bounceStiffness: 600, 
        bounceDamping: 40,
        power: 0.2,
        timeConstant: 150,
        modifyTarget: (target) => Math.round(target / 5) * 5
      }}
      whileDrag={{
        cursor: 'grabbing',
        scale: 1.02,
        rotate: rotateRaw,
        transition: { duration: 0 }
      }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: isFront ? 1 : 0.98 }}
      loading="eager"
    />
  );
};

export default SwipeCards;

const cardData = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501813/3_vr23kr.jpg",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501811/5_jvecjx.jpg",
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501768/4_ir2mzj.jpg",
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501765/2_cvqxzm.jpg",
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501761/Academy_logo_k39bjk.png",
  },

];