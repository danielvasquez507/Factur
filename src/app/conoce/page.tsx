"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FloatingMenu } from '@/components/landing/floating-menu';
import { Footer } from '@/components/landing/footer';

export default function ConocePage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-10 md:py-16 min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-48 h-48 sm:w-64 sm:h-64 md:w-[18rem] md:h-[18rem] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-0 md:-mb-4 -mt-12 md:-mt-20">
                    <text x="16" y="22" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="800" fill="white">Conoce<tspan fill="#3B82F6">.</tspan></text>
                </svg>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl -mt-6 md:-mt-12">
                    Descubre todo lo que Factur puede hacer por tu negocio.
                </p>
            </div>
            
            <div className="space-y-4">
                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-blue-500/30 ${openAccordion === 'que-es' ? 'border-blue-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none" 
                        onClick={() => toggleAccordion('que-es')}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white">¿Qué es Factur?</span>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openAccordion === 'que-es' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'que-es' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 text-gray-300 leading-relaxed border-t border-white/5 mt-2 pt-4 space-y-4">
                            <p>Factur es una plataforma integral de gestión administrativa, facturación y generación de contratos diseñada específicamente para profesionales independientes, emprendedores y pequeñas empresas.</p>
                            <p>Su objetivo principal es <strong>"descomplicar"</strong> y centralizar el día a día operativo del usuario, eliminando tareas manuales repetitivas y permitiendo una gestión ágil desde cualquier dispositivo.</p>
                            <p>A diferencia de los sistemas contables tradicionales (que suelen ser complejos y pesados), Factur se posiciona como una herramienta ágil y moderna que automatiza el cruce de datos, permitiendo generar documentos legales y fiscales en cuestión de segundos.</p>
                        </div>
                    </div>
                </div>

                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-indigo-500/30 ${openAccordion === 'modulos' ? 'border-indigo-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none" 
                        onClick={() => toggleAccordion('modulos')}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white">Módulos Principales</span>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openAccordion === 'modulos' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'modulos' ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4">
                            <ul className="space-y-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-1">●</span>
                                    <div>
                                        <strong className="text-white block mb-1 text-lg">Directorio Inteligente (CRM Básico)</strong>
                                        <span className="text-gray-400 text-sm block mb-2">Un gestor centralizado de la cartera de clientes.</span>
                                        <p className="text-gray-500 text-xs md:text-sm">Almacena de forma estructurada datos fiscales, contactos, direcciones y preferencias. Esto elimina la necesidad de buscar información dispersa cada vez que se requiere emitir un documento.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-400 mt-1">●</span>
                                    <div>
                                        <strong className="text-white block mb-1 text-lg">Catálogo de Servicios</strong>
                                        <span className="text-gray-400 text-sm block mb-2">Un módulo de inventario enfocado en servicios.</span>
                                        <p className="text-gray-500 text-xs md:text-sm">Permite estandarizar la oferta comercial del usuario, registrando descripciones minuciosas y definiendo estructuras de costos (fijos o variables) para agilizar las cotizaciones futuras.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 mt-1">●</span>
                                    <div>
                                        <strong className="text-white block mb-1 text-lg">Generador Automático de Documentos</strong>
                                        <span className="text-gray-400 text-sm block mb-2">El núcleo del sistema.</span>
                                        <p className="text-gray-500 text-xs md:text-sm">Combina la información precargada de los clientes con el catálogo de servicios para instanciar contratos y facturas instantáneamente. Soporta múltiples plantillas personalizables.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">●</span>
                                    <div>
                                        <strong className="text-white block mb-1 text-lg">Distribución y Compartición Universal</strong>
                                        <span className="text-gray-400 text-sm block mb-2">Sin fricciones para el cliente final.</span>
                                        <p className="text-gray-500 text-xs md:text-sm">En lugar de obligar al cliente a descargar software, Factur genera enlaces web seguros. El cliente final puede abrir su factura o contrato desde cualquier dispositivo (PC, tablet o celular), visualizarlo en línea y descargarlo en formato PDF.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-colors hover:border-green-500/30 ${openAccordion === 'beneficios' ? 'border-green-500/30' : ''}`}>
                    <button 
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none" 
                        onClick={() => toggleAccordion('beneficios')}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white">Beneficios y Ventajas</span>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openAccordion === 'beneficios' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === 'beneficios' ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-2 pt-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                        Arquitectura Multiplataforma
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-400">Accesible 100% desde la nube, con una interfaz adaptable que garantiza la misma potencia de uso tanto en un teléfono móvil como en un equipo de escritorio.</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        Ahorro de Tiempo Radical
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-400">Reduce el tiempo de creación de una factura o contrato de 15 minutos a apenas unos clics, gracias a la autocompletación inteligente.</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                        Independencia del Cliente Final
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-400">Los clientes no necesitan iniciar sesión ni usar contraseñas para ver sus facturas; basta con el enlace seguro generado por Factur.</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
                                        Interfaz Minimalista ("Zero Clutter")
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-400">Diseñado sin los complejos menús contables. Se muestra estrictamente lo necesario para facturar y vender.</p>
                                </div>
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
