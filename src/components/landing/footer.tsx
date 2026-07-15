import React from 'react';

export function Footer() {
  return (
    <footer className="relative z-10 w-full py-6 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 text-sm md:text-base">
          Desarrollado con <span className="text-red-500 animate-pulse inline-block">❤️</span> por <a href="https://danielvasquez.cloud/" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors">Daniel Vasquez</a>
        </p>
      </div>
    </footer>
  );
}
