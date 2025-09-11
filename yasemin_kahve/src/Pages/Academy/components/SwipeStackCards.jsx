import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useContext,
} from "react";
import {
  useSprings,
  animated,
  to as interpolate,
  config,
} from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import "./react-swipestack-cards.css";

// Context only available inside Deck component
const DeckContext = React.createContext({});

// CARD COMPONENT
function Card({ img, children }) {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error(`Card Components need to be inside of the Deck component`);
  }

  return (
    <>
      <img
        className="react-swipestack-cards__card-img"
        src={img.src}
        alt={img.alt}
      />
      {children}
    </>
  );
}

// This is being used down there in the view
// interpolates rotation and scale into a css transform
const setTransforms = (r, s) =>
  `perspective(1500px) rotateZ(${r}deg) scale(${s})`;

// helper function to map values
function mapToRange(number, in_min, in_max, out_min, out_max) {
  return (
    ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
}

const calcOpacityChange = (x, i, containerWidth, cardStackLength) => {
  const startingValues = (i + 1) / cardStackLength;
  if (x.get === "function") {
    x = x.get();
  } else {
    // if card not moving
    return startingValues;
  }
  // distance from card stack center
  const distanceFromCenter = Math.abs((x / 100) * (i + 1));
  // when card is outside of container
  const inMax = containerWidth / 2;
  return (
    startingValues +
    parseFloat(mapToRange(distanceFromCenter, 0, inMax, 0, 1).toFixed(2)) +
    0.1
  );
};

// DECK COMPONENT
function Deck({
  children,
  cards,
  containerWidth,
  onEmpty,
  onChange,
  onLike,
  onDislike,
  onCardout,
  onAnimation,
  LoaderComponent,
  transformStartValues = {},
  transformEndValues = {},
  springConfigs = {},
  yOffset = 10,
  maxVelocity = 0.2,
  debounceTime = 100,
  rotationFactor = 1,
  fadeEffect = true,
  cardSizeOnHover = 1.02,
  rotationThreshold = 50,
  minStackLength = 1,
  autoSwipe = false,
}) {
  const deckRef = useRef();
  const [flippedOutCards] = useState(() => new Set()); 
  const [currentCardIndex, setCurrentCardIndex] = useState(cards.length); 
  const [cardStack, setCardStack] = useState(cards); 
  const [_containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    if (!deckRef.current) return;
    // if no container width is available set width to parent element width
    if (!containerWidth) {
      const { width } = deckRef.current.parentElement.getBoundingClientRect();
      setContainerWidth(width);
    }
  }, [containerWidth]);

  // These two are just helpers, they curate spring data, values that are later being interpolated into css
  const from = (i) => ({
    x: transformStartValues.x ? transformStartValues.x : 0,
    y: transformStartValues.y ? transformStartValues.y : 0,
    scale: transformStartValues.scale ? transformStartValues.scale : 1.08,
    rot: transformStartValues.rotation ? transformStartValues.rotation : 0,
    opacity: transformStartValues.opacity ? transformStartValues.opacity : 1,
    delay: transformStartValues.delay ? i * transformStartValues.delay : 0,
  });

  const to = (i, cardStackLength, currentCardIndex) => {
    const isFront = i === currentCardIndex - 1;
    const offset = isFront ? 0 : i % 2 ? 3 : -3; 
    
    return {
      x: transformEndValues.x ? transformEndValues.x : 0,
      y: ((i % cardStackLength) - currentCardIndex) * yOffset,
      scale: transformEndValues.scale ? transformEndValues.scale : (isFront ? 1 : 0.98),
      rot: transformEndValues.rotation ? transformEndValues.rotation : offset,
      opacity: transformEndValues.opacity ? transformEndValues.opacity : (isFront ? 1 : 0.8),
      delay: transformEndValues.delay ? i * transformEndValues.delay : i * 10,
    };
  };

  // set config for different spring animations
  springConfigs = {
    cardActive: springConfigs.cardActive
      ? springConfigs.cardActive
      : config.stiff,
    cardFlyOut: springConfigs.cardFlyOut
      ? springConfigs.cardFlyOut
      : config.molasses,
    cardDefault: springConfigs.cardDefault
      ? springConfigs.cardDefault
      : config.slow,
    cardReset: springConfigs.cardReset
      ? springConfigs.cardReset
      : config.gentle,
  };

  // Create a bunch of springs using the helpers above
  const [animationProps, springsApi] = useSprings(cardStack.length, (i) => ({
    ...to(i, cardStack.length, currentCardIndex),
    from: from(i),
  }));

  // Trigger events
  const onCardOut = (index, dirX) => {
    if (dirX > 0) {
      typeof onLike === "function" && onLike(cardStack[index]);
    } else {
      typeof onDislike === "function" && onDislike(cardStack[index]);
    }
    typeof onCardout === "function" && onCardout(cardStack[index]);
  };

  // Move Cards down everytime one gets flipped out
  useEffect(() => {
    springsApi.start((i) => ({
      to: to(i, cardStack.length, currentCardIndex),
      config: springConfigs.cardReset,
    }));
  }, [springsApi, cardStack, currentCardIndex]);

  // When card prop changes update stack
  useEffect(() => {
    setCurrentCardIndex(cards.length);
    setCardStack(cards);
  }, [cards]);

  // trigger onChange event when card stack changes
  useEffect(() => {
    typeof onChange === "function" &&
      onChange({
        currentCard: cardStack[currentCardIndex - 1],
        cardStack,
      });
  }, [cardStack]);

  const animateCard = ({ index, active, mx, xDir, immediate }) => {
    let y = 0;
    let opacity = 0;
    springsApi.start((i) => {
      // Move previous Cards down
      if (index !== i) {
        y =
          Math.abs((mx / 100) * (i + 1)) +
          ((i % cardStack.length) - currentCardIndex) * yOffset;

        if (fadeEffect)
          opacity = calcOpacityChange(mx, i, _containerWidth, cardStack.length);

        // If Card is active return translated y value
        if (active)
          return {
            y,
            opacity: fadeEffect ? opacity : 1,
          };
        // If Card is NOT active return normal position in stack

        return {
          y: ((i % cardStack.length) - currentCardIndex) * yOffset,
          opacity: 1,
        };
      }

      // Only change spring-data for the current spring

      if (immediate) {
        flippedOutCards.add(index);
      }

      const isFlippedOutCard = flippedOutCards.has(index);
      const x = isFlippedOutCard
        ? (200 + _containerWidth) * xDir
        : active
        ? mx
        : 0; 
      const rot =
        x > rotationThreshold || x < -rotationThreshold
          ? (mx / 100) * rotationFactor + (isFlippedOutCard ? xDir * 10 : 0)
          : 0; 
      const scale = active ? cardSizeOnHover : 1; 

      if (isFlippedOutCard) {
        const t = setTimeout(() => {
          clearTimeout(t);
          setCurrentCardIndex(index);
          setCardStack(cards.filter((card) => cards.indexOf(card) < index));
          onCardOut(index, x);
        }, debounceTime);
      }

      if (typeof onAnimation == "function")
        onAnimation({
          x,
          rotation: rot,
          scale,
        });

      // return spring data for current card
      return {
        x,
        rot,
        scale,
        opacity: 1,
        delay: 0,
        config: active
          ? springConfigs.cardActive
          : isFlippedOutCard
          ? springConfigs.cardFlyOut
          : springConfigs.cardDefault,
      };
    });
  };

  // Auto-swipe functionality - FIXED FOR INFINITE SCROLLING
  useEffect(() => {
    if (!autoSwipe) return;
    
    const interval = setInterval(() => {
      if (cardStack.length > minStackLength) {
        const topCardIndex = cardStack.length - 1;
        animateCard({
          index: topCardIndex,
          active: true,
          mx: 350,
          xDir: 1,
          immediate: true,
        });
      } else if (cardStack.length === minStackLength) {
        // Trigger onEmpty when stack reaches minimum length
        const t = setTimeout(() => {
          clearTimeout(t);
          flippedOutCards.clear();
          onEmpty();
        }, debounceTime);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoSwipe, cardStack, minStackLength, debounceTime, onEmpty, flippedOutCards]);

  // Create a gesture
  const bindGesture = useDrag(
    ({
      args: [index],
      active,
      movement: [mx, my],
      direction: [xDir],
      velocity: [vx],
    }) => {
      if (index !== cardStack.length - 1) return;
      const trigger = vx > maxVelocity; 

      if (!active && trigger){
        flippedOutCards.add(index)
        animateCard({ index, active: true, mx, xDir, immediate: false });
      } else {
        animateCard({ index, active, mx, xDir, immediate: false });
      } 

      // If Stack is empty
      if (!active && cardStack.length === minStackLength) {
        const t = setTimeout(() => {
          clearTimeout(t);
          flippedOutCards.clear();
          onEmpty();
        }, debounceTime);
      }
    }
  );

  return (
    <DeckContext.Provider
      value={{
        cardIndex: currentCardIndex - 1,
        currentDeckSize: cardStack.length,
        cardStack,
        containerWidth: _containerWidth,
        animateCard,
      }}
    >
      <div className="react-swipestack-cards__deck">
        {children &&
          cardStack.map((card, i) => {
            return (
              <animated.div
                key={i}
                ref={deckRef}
                className={`react-swipestack-cards ${
                  i === currentCardIndex - 1
                    ? "react-swipestack-cards__active-card-wrapper"
                    : ""
                } react-swipestack-cards__card-wrapper react-swipestack-card-${i}`}
                style={{
                  "--react-swipestack-cards-id": i + 1,
                  "--react-swipestack-cards-stack-length": cardStack.length,
                  x: animationProps[i]?.x,
                  y: animationProps[i]?.y,
                  opacity: fadeEffect ? animationProps[i]?.opacity : 1,
                  zIndex: i === currentCardIndex - 1 ? 10 : cardStack.length - i,
                }}
              >
                <animated.div
                  {...bindGesture(i)}
                  className={`${
                    i === currentCardIndex - 1
                      ? "react-swipestack-cards__active-card"
                      : ""
                  } react-swipestack-cards__card`}
                  style={{
                    touchAction: "none",
                    transform: interpolate(
                      [animationProps[i]?.rot, animationProps[i]?.scale],
                      setTransforms
                    ),
                  }}
                >
                  {children[i]}
                </animated.div>
              </animated.div>
            );
          })}
        {LoaderComponent && cardStack.length <= 0 ? <LoaderComponent /> : null}
      </div>
    </DeckContext.Provider>
  );
}

// SwipeStackCards wrapper component with TRUE INFINITE LOOP
const SwipeStackCards = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const handleCardOut = (card) => {
    // Update the current image index for indicators
    setCurrentImageIndex(prev => (prev + 1) % cardData.length);
  };

  const handleEmpty = () => {
    // Reset the deck with the same cards to create infinite loop
    setCards([...cardData]);
    setCurrentImageIndex(0);
  };

  if (!imagesLoaded) {
    return (
      <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 h-64 w-48 md:h-96 md:w-72 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center border border-amber-200 shadow-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-amber-700 text-sm font-medium">Preparing Cards...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] md:h-[500px] w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-0">
      <Deck
        cards={cards}
        onCardout={handleCardOut}
        onEmpty={handleEmpty}
        containerWidth={300}
        yOffset={8}
        autoSwipe={true}
      >
        {cards.map((card, index) => (
          <Card
            key={`${card.id}-${index}`}
            img={{ src: card.url, alt: "Coffee card" }}
          />
        ))}
      </Deck>
      
      {/* Carousel Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {cardData.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-amber-600 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeStackCards;
export { Card, Deck };

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