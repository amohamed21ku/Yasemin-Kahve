import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Coffee, ArrowRight, Play } from "lucide-react";

const ShuffleHero = () => {
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
    <section className="relative min-h-[80vh] w-full px-8 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-6xl mx-auto bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-12 h-16 bg-amber-600/10 rounded-full transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-8 h-12 bg-orange-500/10 rounded-full transform -rotate-25 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-8 bg-amber-500/10 rounded-full transform rotate-45 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-600/15 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-200">
          <Coffee size={16} />
          <span>Coffee Academy</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          <span className="block text-amber-700 text-3xl md:text-4xl font-semibold mb-2">Yasemin Coffee Academy</span>
          Learn the Art of Coffee
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
          Discover the secrets of brewing the perfect cup with our comprehensive coffee courses and hands-on workshops. Master brewing techniques from industry experts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={scrollToCourses}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:from-amber-700 hover:to-orange-700 hover:scale-105 hover:shadow-xl shadow-lg transform active:scale-95"
          >
            <span>Explore Courses</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button 
            onClick={handleVideoPlay}
            className="inline-flex items-center gap-3 bg-white text-gray-800 font-semibold py-4 px-8 rounded-full border-2 border-amber-200 transition-all duration-300 hover:bg-amber-50 hover:border-amber-300 hover:scale-105 shadow-md"
          >
            <Play size={18} className="text-amber-600" />
            <span>Watch Introduction</span>
          </button>
        </div>
      </div>
      
      <div className="relative z-10">
        <ShuffleGrid />
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
    timeoutRef.current = setTimeout(shuffleSquares, 4000);
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(shuffleSquares, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [shuffleSquares]);

  const squares = useMemo(() => {
    return shuffledData.map((sq) => (
      <motion.div
        key={sq.id}
        layout
        transition={{ 
          duration: 0.8, 
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
        className="w-full h-full rounded-md overflow-hidden"
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
    <div className="grid grid-cols-3 grid-rows-3 h-[400px] gap-3 rounded-lg overflow-hidden">
      {squares}
    </div>
  );
};

export default ShuffleHero;