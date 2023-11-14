import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsVisible(scrollPosition > 0);
  };

  const scrollToTop = () => {
    setIsAnimating(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let timeout;
    if (!isVisible && isAnimating) {
      timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Adjust the duration to match your animation
    }
    return () => clearTimeout(timeout);
  }, [isVisible, isAnimating]);

  return (
    
      <Link to="top" smooth={true} duration={500} onClick={scrollToTop} className={`fixed z-50 bottom-4 right-4 p-4 rounded-full bg-goldd text-dark transform transition-transform ${
        isVisible ? 'translate-y-0 opacity-100 duration-300' :  'translate-y-full opacity-0 duration-300'
      }`}>
        <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      height="2em"
      width="2em"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M15 32.936l17-17 17 17"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M15 47.936l17-17 17 17"
      />
    </svg>
      </Link>
  );
};

export default ScrollToTopButton;
