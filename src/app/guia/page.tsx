"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FloatingMenu } from '@/components/landing/floating-menu';
import { Footer } from '@/components/landing/footer';

export default function GuiaPage() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);
  const videoRef5 = useRef<HTMLVideoElement>(null);
  const videoRef6 = useRef<HTMLVideoElement>(null);
  const videoRef7 = useRef<HTMLVideoElement>(null);
  
  const [openAccordion, setOpenAccordion] = useState<string | null>('step-1');

  // Optimización: Reproducir solo el video del acordeón abierto para ahorrar recursos y mejorar rendimiento
  useEffect(() => {
    [videoRef1, videoRef2, videoRef3, videoRef4, videoRef5, videoRef6, videoRef7].forEach((ref, index) => {
        const stepId = `step-${index + 1}`;
        if (ref.current) {
            if (openAccordion === stepId) {
                ref.current.play().catch(() => {});
            } else {
                ref.current.pause();
                ref.current.currentTime = 0; // Reiniciar
            }
        }
    });
  }, [openAccordion]);

  const handleMaximize1 = () => {
    if (videoRef1.current) {
        if (videoRef1.current.requestFullscreen) {
            videoRef1.current.requestFullscreen();
        } else if ((videoRef1.current as any).webkitRequestFullscreen) {
            (videoRef1.current as any).webkitRequestFullscreen();
        }
    }
  };

  const handleMaximize2 = () => {
    if (videoRef2.current) {
        if (videoRef2.current.requestFullscreen) {
            videoRef2.current.requestFullscreen();
        } else if ((videoRef2.current as any).webkitRequestFullscreen) {
            (videoRef2.current as any).webkitRequestFullscreen();
        }
    }
  };

  const handleMaximize3 = () => {
    if (videoRef3.current) {
        if (videoRef3.current.requestFullscreen) {
            videoRef3.current.requestFullscreen();
        } else if ((videoRef3.current as any).webkitRequestFullscreen) {
            (videoRef3.current as any).webkitRequestFullscreen();
        }
    }
  };

  const handleMaximize4 = () => {
    if (videoRef4.current) {
        if (videoRef4.current.requestFullscreen) {
            videoRef4.current.requestFullscreen();
        } else if ((videoRef4.current as any).webkitRequestFullscreen) {
            (videoRef4.current as any).webkitRequestFullscreen();
        }
    }
  };

  const handleMaximize5 = () => {
    if (videoRef5.current) {
        if (videoRef5.current.requestFullscreen) {
            videoRef5.current.requestFullscreen();
        } else if ((videoRef5.current as any).webkitRequestFullscreen) {
            (videoRef5.current as any).webkitRequestFullscreen();
        }
    }
  };

  const handleMaximize6 = () => {
    if (videoRef6.current) {
        if (videoRef6.current.requestFullscreen) {
            videoRef6.current.requestFullscreen();
        } else if ((videoRef6.current as any).webkitRequestFullscreen) {
            (videoRef6.current as any).webkitRequestFullscreen();
        }
    }
  };

  const handleMaximize7 = () => {
    if (videoRef7.current) {
        if (videoRef7.current.requestFullscreen) {
            videoRef7.current.requestFullscreen();
        } else if ((videoRef7.current as any).webkitRequestFullscreen) {
            (videoRef7.current as any).webkitRequestFullscreen();
        }
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-[#030712] text-white selection:bg-blue-500/30 font-sans min-h-screen relative overflow-hidden">
      {/* FONDO DINÁMICO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px]"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[60px] md:blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1000px] h-[200px] md:h-[400px] bg-purple-500/10 rounded-[100%] rotate-45 mix-blend-screen filter blur-[60px] md:blur-[80px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <FloatingMenu />

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-16 md:py-24 min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-[14rem] h-48 md:w-[18rem] md:h-64 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-0 md:-mb-4 -mt-12 md:-mt-20">
                    <text x="16" y="22" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="800" fill="white">Guía<tspan fill="#3B82F6">.</tspan></text>
                </svg>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl -mt-6 md:-mt-12">
                    Aprende a usar Factur paso a paso con ejemplos visuales.
                </p>
            </div>

            <div className="space-y-4">
                {/* Accordion 1: Primer Acceso */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-blue-500/30 ${openAccordion === 'step-1' ? 'border-blue-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-1')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">1</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Primer Acceso a tu Cuenta</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-1' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-1' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Una vez cuentes con tu contraseña, podrás acceder con tu correo y tus credenciales de acceso. Solo en el primer ingreso se te presentará una pantalla de onboarding donde podrás cambiar la contraseña predeterminada y subir el logo de la empresa (el cual podrás cambiar después con aprobación del administrador).</p>
                            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer" onClick={handleMaximize1}>
                                    <video ref={videoRef1} preload="metadata" src="/onboarding.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-blue-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Ingresa tu correo y contraseña. La primera vez se te pedirá cambiar la clave por seguridad.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 2: Catálogo de Servicios */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-green-500/30 ${openAccordion === 'step-2' ? 'border-green-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-2')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">2</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Crea tu Catálogo de Servicios</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-2' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-2' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Estandariza lo que ofreces para no tener que escribirlo cada vez.</p>
                            <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer" onClick={handleMaximize2}>
                                    <video ref={videoRef2} preload="metadata" src="/Servicios.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-green-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">En "Servicios" agrega: nombre del servicio, descripción detallada, precio base y tipo de cobro (fijo, por hora, por proyecto).</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 3: Registro y Gestión de Clientes */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-purple-500/30 ${openAccordion === 'step-3' ? 'border-purple-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-3')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">3</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Registro y Gestión de Clientes</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-3' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-3' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Dirígete al módulo "Clientes" y agrega la información de tu cartera.</p>
                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer" onClick={handleMaximize3}>
                                    <video ref={videoRef3} preload="metadata" src="/Clientes.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-purple-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Haz clic en "+ Nuevo Cliente". Completa nombre, cédula/RUC, correo, teléfono y dirección. Guarda los cambios.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 4: Asociar servicios al cliente */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-fuchsia-500/30 ${openAccordion === 'step-4' ? 'border-fuchsia-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-4')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">4</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Asociar servicios al cliente</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-4' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-4' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Vincula directamente los servicios que ofreces a clientes específicos para agilizar tu flujo de trabajo.</p>
                            <div className="bg-gradient-to-br from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer" onClick={handleMaximize4}>
                                    <video ref={videoRef4} preload="metadata" src="/AsignarServicios.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-fuchsia-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Selecciona un cliente y asígnale los servicios predefinidos que consumirá regularmente.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 5: Genera tu Contrato */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-emerald-500/30 ${openAccordion === 'step-5' ? 'border-emerald-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-5')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">5</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Genera tu Contrato</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-5' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-5' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Asegura tus servicios creando contratos legales de manera rápida y sin complicaciones.</p>
                            <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer" onClick={handleMaximize5}>
                                    <video ref={videoRef5} preload="metadata" src="/Contratos.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-emerald-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Asocia a tu cliente y los servicios acordados. El sistema generará un contrato profesional en formato PDF listo para revisar y firmar.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 6: Genera tu Primera Factura */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-yellow-500/30 ${openAccordion === 'step-6' ? 'border-yellow-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-6')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">6</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Genera tu Primera Factura</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-6' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-6' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">El corazón de Factur: combina cliente + servicios en segundos.</p>
                            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer" onClick={handleMaximize6}>
                                    <video ref={videoRef6} preload="metadata" src="/Facturas.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-yellow-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Selecciona el cliente, agrega uno o más servicios, ajusta cantidades y descuentos. La factura se genera automáticamente con todos los datos precargados.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 7: Gestión de Perfil */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-rose-500/30 ${openAccordion === 'step-7' ? 'border-rose-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-7')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">7</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Gestión de Perfil y Empresas</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-7' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-7' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Administra tus datos personales, contraseña y las configuraciones de todas tus empresas.</p>
                            <div className="bg-gradient-to-br from-rose-900/20 to-red-900/20 border border-rose-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="relative z-50 w-[220px] sm:w-[260px] md:w-[280px] mx-auto group cursor-pointer mb-4" onClick={handleMaximize7}>
                                    <video ref={videoRef7} preload="metadata" src="/Perfil.mp4" className="w-full rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.3)] object-contain bg-black" loop muted playsInline />
                                    <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full flex items-center justify-center pointer-events-none hover:bg-rose-600/80 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </div>
                                </div>
                                <p className="text-sm text-rose-300 font-medium text-center mb-2 px-4 py-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                                    <span className="font-bold">IMPORTANTE:</span> Si deseas cambiar algún dato sensible de la empresa, se enviará una solicitud al Super Admin para su validación.
                                </p>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Mantén tu información actualizada y cambia de forma segura entre múltiples perfiles corporativos si tienes acceso a varios entornos.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 8: Comparte el Enlace */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-cyan-500/30 ${openAccordion === 'step-8' ? 'border-cyan-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-8')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">8</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Comparte el Enlace con tu Cliente</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-8' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-8' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Despídete de descargar PDFs y enviarlos manualmente.</p>
                            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <svg className="w-12 h-12 text-cyan-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                <p className="text-sm text-gray-400 text-center">[Captura: Opciones de Envío]</p>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Elige cómo compartir: tu cliente podrá ver el PDF en línea desde cualquier dispositivo o descargarlo. Sin necesidad de instalar apps.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion 9: Dashboard */}
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-indigo-500/30 ${openAccordion === 'step-9' ? 'border-indigo-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        onClick={() => toggleAccordion('step-9')}
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">9</div>
                            <div className="flex-grow">
                                <h3 className="text-lg md:text-xl font-bold text-white">Explora tu Panel de Control (Dashboard)</h3>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === 'step-9' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'step-9' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <p className="text-sm text-gray-400 mb-4">Visualiza el estado de tu negocio al instante. Revisa métricas clave como clientes activos, total de servicios, volumen de facturación en dólares y la tendencia de los últimos 6 meses.</p>
                            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <svg className="w-12 h-12 text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
                                <p className="text-sm text-gray-400 text-center">[Captura: Dashboard y Gráficos]</p>
                                <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Obtén un resumen financiero con gráficos interactivos y accede directamente a las facturas recientes desde la tabla de movimientos.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
