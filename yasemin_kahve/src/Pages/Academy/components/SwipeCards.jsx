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
    <div className="relative h-[450px] md:h-[600px] w-full flex items-center justify-center overflow-hidden">
      <div className="relative h-80 w-56 md:h-[600px] md:w-96">
        {!imagesLoaded ? (
          <div className="absolute top-0 left-0 h-80 w-56 md:h-[600px] md:w-96 bg-gray-200 rounded-lg flex items-center justify-center">
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

  const handleDragEnd = (event, info) => {
    const xValue = x.get();
    const velocity = info.velocity.x;
    
    // Use velocity for more natural feel
    if (Math.abs(xValue) > 50 || Math.abs(velocity) > 500) {
      removeCard(id);
    }
  };

  return (
    <motion.img
      src={url}
      alt="Coffee card"
      className="absolute top-0 left-0 h-80 w-56 md:h-[600px] md:w-96 origin-bottom rounded-lg bg-white object-cover select-none"
      style={{
        x,
        opacity: isFront ? opacity : 0.8,
        rotate,
        scale: isFront ? scale : 0.98,
        cursor: isFront ? 'grab' : 'default',
        boxShadow: isFront
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 25px 25px -5px rgba(0, 0, 0, 0.1)"
          : "0 8px 20px rgba(0, 0, 0, 0.15)",
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
        scale: 1.05,
        rotate: rotateRaw,
        transition: { duration: 0 },
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 30px 30px -5px rgba(0, 0, 0, 0.2)"
      }}
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