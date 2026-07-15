"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FloatingMenu } from './floating-menu';
import { Footer } from './footer';

export function LandingContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    prefijo: '+507',
    celular: '',
    correo: '',
    direccion: ''
  });

  const isFormValid = Object.values(formData).every(val => val.trim() !== '');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const fieldId = e.target.id.replace('f-', '');
    setFormData(prev => ({ ...prev, [fieldId]: e.target.value }));
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const text = `Hola equipo de Factur. Me comunico para solicitar una prueba de la plataforma.\n\n*Datos del Solicitante:*\n👤 *Nombre:* ${formData.nombre.trim()} ${formData.apellido.trim()}\n🪪 *Cédula:* ${formData.cedula.trim()}\n📱 *Celular:* ${formData.prefijo} ${formData.celular.trim()}\n📧 *Correo:* ${formData.correo.trim()}\n📍 *Dirección:* ${formData.direccion.trim()}\n\nQuedo a la espera de sus instrucciones. Saludos.`;
    window.open(`https://wa.me/50760701833?text=${encodeURIComponent(text)}`, '_blank');
    closeModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ nombre: '', apellido: '', cedula: '', prefijo: '+507', celular: '', correo: '', direccion: '' });
  };

  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  return (
    <div className="bg-[#030712] text-white selection:bg-blue-500/30 font-sans min-h-screen">
      {/* Floating Menu Button Improved */}
      <FloatingMenu isLoggedIn={isLoggedIn} isHidden={isModalOpen} />
      
      {/* Dynamic Background and Main Content will go here */}

<div className="w-full">

    {/* FONDO DINÁMICO */}
    <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[60px] md:blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1000px] h-[200px] md:h-[400px] bg-purple-500/10 rounded-[100%] rotate-45 mix-blend-screen filter blur-[60px] md:blur-[80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
    {/* CONTENIDO PRINCIPAL (INICIO) */}
    <main className="relative z-10 flex flex-col items-center min-h-screen px-4 sm:px-6 py-10 md:py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto mb-16 md:mb-24 px-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-48 h-48 sm:w-64 sm:h-64 md:w-[18rem] md:h-[18rem] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-0 md:-mb-4 -mt-8 md:-mt-12">
                <text x="16" y="22" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="800" fill="white">Factur<tspan fill="#3B82F6">.</tspan></text>
            </svg>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white leading-tight md:leading-[1.15] mb-5 relative z-10">
                Descomplica tu día a día gestionando <br />
                servicios, clientes, facturas y contratos <br />
                con total agilidad.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Toma el control absoluto de tu negocio con herramientas diseñadas para optimizar el tiempo de los profesionales.
            </p>
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl w-full mb-12 md:mb-16">
            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-4">
                    <svg className="w-9 h-9 text-blue-400 drop-shadow-md shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Clientes</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Directorio Inteligente</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Lleva un registro detallado de tu cartera de clientes. Guarda contactos, direcciones y preferencias para tenerlos siempre a un clic.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-4">
                    <svg className="w-9 h-9 text-indigo-400 drop-shadow-md shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">Servicios</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Catálogo de Servicios</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Estandariza tu oferta. Registra tus servicios con descripciones minuciosas y define costos fijos o variables para agilizar cotizaciones.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-4">
                    <svg className="w-9 h-9 text-purple-400 drop-shadow-md shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 leading-tight">Facturas y<br />Contratos</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Generación Ultrarrápida</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Crea facturas y contratos en segundos. Factur cruza los datos precargados de tus clientes y servicios para armar documentos listos para enviar.</p>
            </div>
        </div>

        {/* Comparte y Referidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-6xl w-full mb-16 md:mb-20">
            <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center justify-center md:justify-start gap-3">
                    <svg className="w-9 h-9 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Comparte sin barreras
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed text-center md:text-left">
                    Envía tus facturas y contratos directamente por <strong>WhatsApp, correo electrónico o mediante un enlace web seguro</strong>. Tus clientes podrán visualizar y descargar sus documentos en formato PDF desde cualquier dispositivo (celular, tablet o computadora) al instante.
                </p>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center justify-center md:justify-start gap-3">
                    <svg className="w-9 h-9 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Programa de Referidos
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed text-center md:text-left">
                    Recomienda Factur y ahorra. Si tu referido mantiene su suscripción por dos meses, a partir del tercer mes recibirás un <strong>descuento de $1.00 en tu factura</strong>. Este beneficio se mantendrá mes a mes (hasta por 10 meses) mientras tu referido siga activo. <strong>Máximo 10 referidos al mismo tiempo.</strong> (No aplica en el Complemento Add Plus).
                </p>
            </div>
        </div>

        {/* Precios */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 max-w-6xl w-full items-center lg:items-stretch justify-center">
            {/* Plan Profesional */}
            <div className="relative w-full max-w-md lg:max-w-lg lg:w-1/2 flex flex-col">
                <div className="absolute inset-0 bg-blue-500/10 blur-xl md:blur-2xl rounded-[2.5rem] md:rounded-[3rem]"></div>
                <div className="relative flex-grow bg-gradient-to-b from-[#0B1120] to-[#030712] border border-blue-500/40 p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl backdrop-blur-xl flex flex-col">
                    <div className="text-center mb-6 md:mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Plan Profesional</h3>
                        <p className="text-blue-300 text-xs sm:text-sm font-medium">Control total de las facturas y contratos de tu negocio sin límites.</p>
                        <div className="flex items-center justify-center gap-1 mt-4 md:mt-6">
                            <span className="text-2xl md:text-3xl font-semibold text-gray-400">$</span>
                            <span className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter">15.00</span>
                            <span className="text-base md:text-lg text-gray-400 self-end mb-2 md:mb-3">/mes</span>
                        </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4 mb-8 md:mb-10 text-xs sm:text-sm text-gray-300 flex-grow">
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Gestión de clientes ilimitados.</div>
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Gestión de servicios ilimitados.</div>
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Múltiples plantillas de facturas y contratos.</div>
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Personalización avanzada de plantillas.</div>
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Generación automatizada con los datos del cliente.</div>
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Aplicación multiplataforma (Celular, tablet, PC).</div>
                        <div className="flex items-start"><span className="text-blue-400 mr-2 shrink-0">✓</span> Sistema en constante crecimiento (nuevas funciones continuas).</div>
                    </div>
                    <button onClick={openModal} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] text-sm md:text-base">
                        Comenzar tu prueba gratis
                    </button>
                </div>
            </div>

            {/* Add Plus */}
            <div className="w-full max-w-md lg:max-w-lg lg:w-1/3 flex flex-col">
                <div className="flex-grow bg-gradient-to-br from-[#0B1120] to-indigo-900/20 border border-indigo-500/30 p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_0_30px_rgba(79,70,229,0.15)] backdrop-blur-xl flex flex-col justify-center relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] md:text-xs font-bold uppercase py-1.5 px-4 rounded-bl-2xl shadow-md">
                        Complemento
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 mt-4 md:mt-0">Add Plus</h3>
                    <p className="text-indigo-200 text-xs sm:text-sm mb-6 md:mb-8">Convierte tu cuenta en un sistema Multi-Empresa (Tenant) sin límites.</p>
                    <ul className="space-y-4 sm:space-y-5 text-xs sm:text-sm text-gray-300 mb-6 md:mb-8">
                        <li className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Segunda empresa
                            </span>
                            <span className="font-black text-white bg-indigo-500/20 px-3 py-1.5 rounded-lg">+$8.50<span className="text-xs font-normal text-indigo-300">/mes</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Tercera empresa
                            </span>
                            <span className="font-black text-white bg-indigo-500/20 px-3 py-1.5 rounded-lg">+$6.50<span className="text-xs font-normal text-indigo-300">/mes</span></span>
                        </li>
                        <li className="flex flex-col gap-2 pt-1">
                            <span className="text-indigo-300 font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
                                4 empresas en adelante
                            </span>
                            <span className="text-white text-xs italic bg-white/5 p-2 rounded border border-white/10 text-center">
                                Se creará un plan según lo que se necesite.
                            </span>
                        </li>
                    </ul>
                    <p className="text-[10px] sm:text-xs text-indigo-200/60 leading-relaxed mt-auto">
                        *Aplica siempre y cuando se demuestre que los emprendimientos o empresas están bajo tu propia gestión administrativa. No existe un límite máximo de empresas a agregar.
                    </p>
                </div>
            </div>
        </div>
    </main>

    {/* MODAL PRUEBA GRATIS */}
    <div id="modal-prueba" className={"fixed inset-0 z-[60]   transition-opacity duration-300 flex items-center justify-center p-4 " + (isModalOpen ? " opacity-100" : " hidden opacity-0")}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
        <div className="relative w-full max-w-md bg-[#0B1120]/95 border border-blue-500/30 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full md:bg-transparent">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center pr-4 md:pr-0">Solicitud de Prueba</h2>
            <form id="form-prueba" className="space-y-3 sm:space-y-4 mt-4" onSubmit={handleWhatsAppSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input type="text" id="f-nombre" value={formData.nombre} onChange={handleFormChange} placeholder="Nombre" required className="trial-input w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    <input type="text" id="f-apellido" value={formData.apellido} onChange={handleFormChange} placeholder="Apellido" required className="trial-input w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <input type="text" id="f-cedula" value={formData.cedula} onChange={handleFormChange} placeholder="Cédula" required className="trial-input w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                
                <div>
                    <label className="block text-[11px] sm:text-xs font-medium text-gray-400 mb-1">Celular</label>
                    <div className="flex gap-2">
                        <select id="f-prefijo" value={formData.prefijo} onChange={handleFormChange} className="trial-input w-[45%] sm:w-2/5 bg-black/50 border border-gray-700 rounded-lg pl-3 pr-8 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer truncate">
                            <option className="bg-[#0B1120]" value="+507">🇵🇦 +507 (Panamá)</option>
                            <option className="bg-[#0B1120]" value="+54">🇦🇷 +54 (Argentina)</option>
                            <option className="bg-[#0B1120]" value="+501">🇧🇿 +501 (Belice)</option>
                            <option className="bg-[#0B1120]" value="+591">🇧🇴 +591 (Bolivia)</option>
                            <option className="bg-[#0B1120]" value="+1">🇨🇦 +1 (Canadá)</option>
                            <option className="bg-[#0B1120]" value="+56">🇨🇱 +56 (Chile)</option>
                            <option className="bg-[#0B1120]" value="+57">🇨🇴 +57 (Colombia)</option>
                            <option className="bg-[#0B1120]" value="+506">🇨🇷 +506 (Costa Rica)</option>
                            <option className="bg-[#0B1120]" value="+53">🇨🇺 +53 (Cuba)</option>
                            <option className="bg-[#0B1120]" value="+593">🇪🇨 +593 (Ecuador)</option>
                            <option className="bg-[#0B1120]" value="+503">🇸🇻 +503 (El Salvador)</option>
                            <option className="bg-[#0B1120]" value="+34">🇪🇸 +34 (España)</option>
                            <option className="bg-[#0B1120]" value="+1">🇺🇸 +1 (Estados Unidos)</option>
                            <option className="bg-[#0B1120]" value="+502">🇬🇹 +502 (Guatemala)</option>
                            <option className="bg-[#0B1120]" value="+240">🇬🇶 +240 (Guinea Ecuatorial)</option>
                            <option className="bg-[#0B1120]" value="+504">🇭🇳 +504 (Honduras)</option>
                            <option className="bg-[#0B1120]" value="+52">🇲🇽 +52 (México)</option>
                            <option className="bg-[#0B1120]" value="+505">🇳🇮 +505 (Nicaragua)</option>
                            <option className="bg-[#0B1120]" value="+595">🇵🇾 +595 (Paraguay)</option>
                            <option className="bg-[#0B1120]" value="+51">🇵🇪 +51 (Perú)</option>
                            <option className="bg-[#0B1120]" value="+1">🇵🇷 +1 (Puerto Rico)</option>
                            <option className="bg-[#0B1120]" value="+1">🇩🇴 +1 (Rep. Dominicana)</option>
                            <option className="bg-[#0B1120]" value="+598">🇺🇾 +598 (Uruguay)</option>
                            <option className="bg-[#0B1120]" value="+58">🇻🇪 +58 (Venezuela)</option>
                        </select>
                        <input type="tel" id="f-celular" value={formData.celular} placeholder="Número" inputMode="numeric" onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); handleFormChange(e); }} required className="trial-input w-[55%] sm:w-3/5 bg-black/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>

                <input type="email" id="f-correo" value={formData.correo} onChange={handleFormChange} placeholder="Correo Electrónico" required className="trial-input w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                <textarea id="f-direccion" value={formData.direccion} onChange={handleFormChange} placeholder="Dirección Exacta" rows={2} required className="trial-input w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none"></textarea>
                
                <button type="submit" id="btn-trial-submit" disabled={!isFormValid} className={`w-full mt-2 bg-green-600 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 ${isFormValid ? 'hover:bg-green-500 opacity-100 cursor-pointer shadow-lg shadow-green-600/30' : 'opacity-50 cursor-not-allowed'}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005"/></svg>
                    Enviar solicitud por WhatsApp
                </button>
            </form>
        </div>
    </div>

    <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
    `}} />
    <Footer />
    </div>
    </div>
  );
}