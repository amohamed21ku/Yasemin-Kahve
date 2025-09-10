import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { BookOpen, Users, Award, Coffee, ArrowRight, Play } from "lucide-react";
import React from 'react';
import { useTranslation } from '../../../useTranslation';
import './AcademyHero.css';

const ShuffleHero = () => {
   const { t } = useTranslation();
  const scrollToCourses = () => {
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoPlay = () => {
    console.log('Play academy introduction video');
  };

  return (
    <section className="hero-padding">
      <div className="hero-Academy-content">
        {/* Left side - Content */}
        <div className="hero-text">
          <div className="hero-badge">
            <Coffee className="badge-icon" />
            <span>{t('coffeeMastery') || 'Coffee Mastery'}</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-main">{t('yaseminCoffeeAcademy') || 'Yasemin Coffee Academy'}</span>
            <span className="title-subtitle">{t('masterTheArtOfCoffee') || 'Master the Art of Coffee'}</span>
          </h1>
          
          <p className="hero-Academy-description">
            {t('academyDescription') || 'Join our comprehensive coffee education program. Learn from industry experts, master brewing techniques, and discover the secrets behind exceptional coffee. From bean to cup, we\'ll guide your journey to coffee mastery.'}
          </p>

          {/* Action buttons */}
          <div className="hero-actions">
            <button className="btn-Academy-primary" onClick={scrollToCourses}>
              <span>{t('exploreCourses') || 'Explore Courses'}</span>
              <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-Academy-secondary" onClick={handleVideoPlay}>
              <Play className="btn-icon" />
              <span>{t('watchIntro') || 'Watch Introduction'}</span>
            </button>
          </div>
        </div>

        {/* Right side - Shuffle Grid */}
        <div className="hero-visual">
          <ShuffleGrid />
        </div>
      </div>
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501813/3_vr23kr.jpg",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501811/5_jvecjx.jpg",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501768/4_ir2mzj.jpg",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501765/2_cvqxzm.jpg",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501761/Academy_logo_k39bjk.png",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501813/3_vr23kr.jpg",
  },
  {
    id: 7,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501811/5_jvecjx.jpg",
  },
  {
    id: 8,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501768/4_ir2mzj.jpg",
  },
  {
    id: 9,
    src: "https://res.cloudinary.com/dc6ajvbs2/image/upload/v1757501765/2_cvqxzm.jpg",
  },
];

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [shuffledData, setShuffledData] = useState(() => shuffle([...squareData]));

  const shuffleSquares = useCallback(() => {
    setShuffledData(prevData => shuffle([...prevData]));
    timeoutRef.current = setTimeout(shuffleSquares, 5000);
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(shuffleSquares, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [shuffleSquares]);

  const squares = useMemo(() => {
    return shuffledData.map((sq) => (
      <motion.div
        key={sq.id}
        layout
        transition={{ 
          duration: 1.2, 
          type: "spring",
          stiffness: 100,
          damping: 25,
          mass: 1
        }}
        className="w-full h-full rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        style={{
          backgroundImage: `url(${sq.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform"
        }}
      />
    ));
  }, [shuffledData]);

  return (
    <div className="grid grid-cols-3 grid-rows-3 h-[400px] md:h-[450px] gap-3 rounded-lg overflow-hidden sm:h-[280px] xs:h-[240px]">
      {squares}
    </div>
  );
};

export default ShuffleHero;