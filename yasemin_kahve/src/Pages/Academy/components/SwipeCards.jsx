import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const SwipeCards = () => {
  const [cards, setCards] = useState(cardData);

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
    <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
      <div className="relative h-96 w-72">
        {cards.map((card) => {
          return (
            <Card key={card.id} cards={cards} removeCard={removeCard} {...card} />
          );
        })}
      </div>
    </div>
  );
};

const Card = ({ id, url, removeCard, cards }) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-100, 100], [-18, 18]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    const xValue = x.get();
    // Reduced threshold from 100 to 50 for easier mobile swiping
    if (Math.abs(xValue) > 50) {
      removeCard(id);
    }
  };

  return (
    <motion.img
      src={url}
      alt="Coffee card"
      className="absolute top-0 left-0 h-96 w-72 origin-bottom rounded-lg bg-white object-cover select-none"
      style={{
        x,
        opacity: isFront ? opacity : 0.8,
        rotate,
        cursor: isFront ? 'grab' : 'default',
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : "0 5px 15px rgba(0, 0, 0, 0.2)",
        zIndex: isFront ? 10 : cards.length - id,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      dragElastic={0.4}
      dragMomentum={true}
      whileDrag={{
        cursor: 'grabbing',
        scale: 1.05,
        rotate: rotateRaw,
      }}
      onDragEnd={handleDragEnd}
      initial={{ scale: isFront ? 1 : 0.98 }}
    />
  );
};

export default SwipeCards;

const cardData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1578608712688-36b5be8823dc?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];