import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "LeadGreen has completely changed how I approach sustainability. It's fun, engaging, and really makes me feel like I'm making a difference!",
    author: "Student",
    role: "Example persona",
    rating: 5
  },
  {
    text: "As a busy professional, I never thought I'd have time for eco-friendly habits. LeadGreen made it easy and rewarding to incorporate sustainability into my daily routine.",
    author: "Staff member",
    role: "Example persona",
    rating: 5
  },
  {
    text: "The community aspect of LeadGreen is fantastic. I've connected with so many like-minded people and learned tons of new ways to reduce my carbon footprint.",
    author: "Society member",
    role: "Example persona",
    rating: 5
  },
  {
    text: "The gamification elements make sustainability fun! I love watching my virtual plant grow as I complete eco-friendly tasks.",
    author: "Commuter",
    role: "Example persona",
    rating: 5
  },
  {
    text: "This app has made me much more conscious of my environmental impact. The QR code scanning feature is genius!",
    author: "Postgraduate",
    role: "Example persona",
    rating: 5
  }
];

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function UserFeedback() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const itemWidth = Math.min(containerWidth - 48, 800); 
  const trackItemOffset = itemWidth + GAP;
  
  const carouselItems = [...testimonials, testimonials[0]];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === testimonials.length - 1) {
          return prev + 1; 
        }
        if (prev === carouselItems.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 2750);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const handleAnimationComplete = () => {
    if (currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (currentIndex === testimonials.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (currentIndex === 0) {
        setCurrentIndex(testimonials.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  return (
    <section className="w-full py-8 md:py-16 px-4 ">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-8 mt-25 md:mb-16 text-black">
          What players should feel
        </h2>
        <p className="-mt-4 md:-mt-10 mb-8 md:mb-12 text-center text-sm text-gray-500">
          Illustrative quotes written for the coursework prototype, not real reviews.
        </p>

        <div className="flex justify-center">
          <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6 bg-white/5 backdrop-blur-sm">
            <motion.div
              className="flex"
              drag="x"
              dragConstraints={{
                left: -trackItemOffset * (carouselItems.length - 1),
                right: 0,
              }}
              style={{
                width: itemWidth,
                gap: `${GAP}px`,
                perspective: 1000,
                perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
                x,
              }}
              onDragEnd={handleDragEnd}
              animate={{ x: -(currentIndex * trackItemOffset) }}
              transition={isResetting ? { duration: 0 } : SPRING_OPTIONS}
              onAnimationComplete={handleAnimationComplete}
            >
              {carouselItems.map((item, index) => {
                const range = [
                  -(index + 1) * trackItemOffset,
                  -index * trackItemOffset,
                  -(index - 1) * trackItemOffset,
                ];
                const outputRange = [60, 0, -60];
                const rotateY = useTransform(x, range, outputRange, { clamp: false });

                return (
                  <motion.div
                    key={index}
                    className="relative shrink-0 flex flex-col bg-white rounded-lg md:rounded-xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
                    style={{
                      width: itemWidth,
                      rotateY,
                    }}
                    transition={SPRING_OPTIONS}
                  >
                    <div className="p-4 md:p-8">
                      <div className="flex justify-between items-start mb-4 md:mb-6">
                        <Quote className="w-8 h-8 md:w-10 md:h-10 text-green-600 opacity-50" />
                        <div className="flex">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-base md:text-xl text-gray-700 italic mb-6 md:mb-8">
                        "{item.text}"
                      </p>
                      
                      <div className="mt-auto">
                        <p className="font-semibold text-base md:text-lg text-gray-900">
                          {item.author}
                        </p>
                        <p className="text-sm md:text-base text-gray-600">{item.role}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="flex justify-center mt-6 md:mt-8">
              {testimonials.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 md:h-2 w-1.5 md:w-2 rounded-full cursor-pointer mx-1 ${
                    currentIndex % testimonials.length === index
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                  animate={{
                    scale: currentIndex % testimonials.length === index ? 1.2 : 1,
                  }}
                  onClick={() => setCurrentIndex(index)}
                  transition={{ duration: 0.15 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}