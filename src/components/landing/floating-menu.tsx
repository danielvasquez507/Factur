"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FloatingMenu({ isLoggedIn = false, isHidden = false }: { isLoggedIn?: boolean; isHidden?: boolean }) {
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-300 ${isHidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}>
        <div className="relative">
            {/* The Floating Button */}
            <button 
              onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 flex-col backdrop-blur-sm border border-white/10"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                <span className="text-[10px] font-bold mt-1">Menú</span>
            </button>
            
            {/* The Menu Items */}
            <div 
              className={`absolute bottom-20 right-0 bg-[#0B1120]/80 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl w-52 flex-col transition-all duration-300 origin-bottom-right ${isFloatingMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'}`}
            >
                {pathname !== '/' && (
                  <Link href="/" className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 first:rounded-t-xl">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      <span className="text-sm">Inicio</span>
                  </Link>
                )}
                {pathname !== '/conoce' && (
                  <Link href="/conoce" className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 first:rounded-t-xl">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="text-sm">Conoce Factur</span>
                  </Link>
                )}
                {pathname !== '/guia' && (
                  <Link href="/guia" className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 first:rounded-t-xl">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                      <span className="text-sm">Guía de Uso</span>
                  </Link>
                )}
                {pathname !== '/soporte' && (
                  <Link href="/soporte" className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 first:rounded-t-xl">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      <span className="text-sm">Soporte</span>
                  </Link>
                )}
                <Link 
                  href={isLoggedIn ? "/panel" : "/login"} 
                  className="w-full px-4 py-3 text-left text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors flex items-center gap-2 last:rounded-b-xl font-medium"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    <span>App</span>
                </Link>
            </div>
        </div>
    </div>
  );
}
