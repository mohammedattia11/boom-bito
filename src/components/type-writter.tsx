import React, { useState, useEffect } from 'react';
const Typewriter = ({ text="", delay = 100, infinite = false }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === text.length && !infinite) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (infinite) {
      const resetTimeout = setTimeout(() => {
        setCurrentText('');
        setCurrentIndex(0);
      }, 1000);

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, delay, infinite, text]);
  return (
    <>
      {currentText}
    </>
  );
};

export default Typewriter;