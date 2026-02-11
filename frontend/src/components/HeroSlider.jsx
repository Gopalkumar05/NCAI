// components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Beautiful Bouquets",
      subtitle: "Fresh flowers delivered to your doorstep",
      image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Shop Now",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "Special Occasions",
      subtitle: "Perfect arrangements for every moment",
      image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Browse Occasions",
      buttonLink: "/occasions"
    },
    {
      id: 3,
      title: "Same Day Delivery",
      subtitle: "Order before 2 PM for same-day delivery",
      image: "https://images.unsplash.com/photo-1559656914-309c9ec6-0e7c-5a0a-8c78-5e6c58468c9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      buttonText: "Learn More",
      buttonLink: "/delivery"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${isTransitioning ? 'transitioning' : ''}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.buttonLink}
                  className="inline-block bg-white text-primary-600 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors animate-fade-in-up animation-delay-400"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;