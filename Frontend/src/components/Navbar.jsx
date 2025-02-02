import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <div>
      <div className={`flex w-screen justify-center items-center}`}>
        <div 
          className={`
            max-h-fit 
            text-blue-400 
            font-bold 
            rounded-full 
            quizz-icon 
            text-5xl md:text-6xl lg:text-7xl p-3 lg:py-12 
            transition-all 
            duration-500 
            ease-in 
            delay-100 
            hover:text-blue-300 
            cursor-pointer 
          `}
        >
          Quizzo
        </div>
      </div>
    </div>
  );
};

export default Navbar;