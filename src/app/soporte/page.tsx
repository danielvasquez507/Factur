"use client";

import React, { useState } from 'react';
import { FloatingMenu } from '@/components/landing/floating-menu';
import { Footer } from '@/components/landing/footer';

export default function SoportePage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    prefijo: '+507',
    celular: '',
    descripcion: ''
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Only allow numbers for celular
    if (e.target.id === 's-celular') {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, celular: value });
      return;
    }
    
    // Map standard IDs to our state keys
    let key = '';
    if (e.target.id === 's-nombre') key = 'nombre';
    else if (e.target.id === 's-correo') key = 'correo';
    else if (e.target.id === 's-prefijo') key = 'prefijo';
    else if (e.target.id === 's-descripcion') key = 'descripcion';

    if (key) {
      setFormData({ ...formData, [key]: e.target.value });
    }
  };

  const isFormValid = formData.nombre.trim() !== '' && 
                      formData.correo.trim() !== '' && 
                      formData.celular.trim() !== '' && 
                      formData.descripcion.trim() !== '';

  const handleWhatsApp = () => {
    if (!isFormValid) return;
    const mensaje = `Hola equipo de Factur. Requiero asistencia técnica.\n\n*Datos del Cliente:*\n👤 *Nombre:* ${formData.nombre.trim()}\n📧 *Correo:* ${formData.correo.trim()}\n📱 *Teléfono:* ${formData.prefijo} ${formData.celular.trim()}\n\n*Descripción del Problema:*\n${formData.descripcion.trim()}\n\nQuedo a la espera de su pronta respuesta. Saludos.`;
    window.open(`https://wa.me/50760701833?text=${encodeURIComponent(mensaje)}`, '_blank');
    setFormData({ nombre: '', correo: '', prefijo: '+507', celular: '', descripcion: '' });
  };

  const handleEmail = () => {
    if (!isFormValid) return;
    const subject = encodeURIComponent(`Solicitud de Soporte Técnico - Factur`);
    const body = encodeURIComponent(`Hola equipo de Factur. Requiero asistencia técnica.\n\nDatos del Cliente:\n- Nombre: ${formData.nombre.trim()}\n- Correo: ${formData.correo.trim()}\n- Teléfono: ${formData.prefijo} ${formData.celular.trim()}\n\nDescripción del Problema:\n${formData.descripcion.trim()}\n\nQuedo a la espera de su pronta respuesta. Saludos.`);
    window.location.href = `mailto:soporte@factur.com?subject=${subject}&body=${body}`;
    setFormData({ nombre: '', correo: '', prefijo: '+507', celular: '', descripcion: '' });
  };

  return (
    <div className="bg-[#030712] text-white selection:bg-blue-500/30 font-sans min-h-screen relative overflow-hidden flex flex-col items-center">
        {/* FONDO DINÁMICO */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 -left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px]"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[60px] md:blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1000px] h-[200px] md:h-[400px] bg-purple-500/10 rounded-[100%] rotate-45 mix-blend-screen filter blur-[60px] md:blur-[80px]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
      
      <FloatingMenu />

        {/* SECCIÓN DE SOPORTE */}
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-10 md:py-16 min-h-screen w-full">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center mb-16">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-[14rem] h-48 md:w-[18rem] md:h-64 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-0 md:-mb-4 -mt-8 md:-mt-12">
                        <text x="16" y="22" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8.5" fontWeight="800" fill="white">Soporte<tspan fill="#3B82F6">.</tspan></text>
                    </svg>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4 text-center md:whitespace-nowrap">
                        ¿Necesitas Ayuda?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
                        Completa el formulario y nuestro equipo se pondrá en contacto contigo lo antes posible.
                    </p>
                </div>
                
                <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] sm:text-xs font-medium text-gray-400 mb-1">Nombre Apellido</label>
                                <input type="text" id="s-nombre" value={formData.nombre} onChange={handleFormChange} required className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors support-input" />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-medium text-gray-400 mb-1">Correo Electrónico</label>
                                <input type="email" id="s-correo" value={formData.correo} onChange={handleFormChange} required className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors support-input" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-400 mb-1">Celular</label>
                            <div className="flex gap-2">
                                <div className="relative w-[45%] sm:w-2/5">
                                    <select id="s-prefijo" value={formData.prefijo} onChange={handleFormChange} className="appearance-none w-full bg-black/50 border border-gray-700 rounded-lg pl-3 pr-8 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer truncate support-input">
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
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <input type="tel" id="s-celular" value={formData.celular} onChange={handleFormChange} required placeholder="Número" inputMode="numeric" className="w-[55%] sm:w-3/5 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors support-input" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-400 mb-1">Descripción del Problema</label>
                            <textarea id="s-descripcion" value={formData.descripcion} onChange={handleFormChange} required rows={4} className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors support-input"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <button type="button" onClick={handleWhatsApp} disabled={!isFormValid} className={`support-btn text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] flex justify-center items-center gap-2 text-sm sm:text-base ${isFormValid ? 'bg-green-600 hover:bg-green-500 opacity-100 cursor-pointer' : 'bg-green-600 opacity-50 cursor-not-allowed'}`}>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                Enviar por WhatsApp
                            </button>
                            <button type="button" onClick={handleEmail} disabled={!isFormValid} className={`support-btn text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 text-sm sm:text-base ${isFormValid ? 'bg-blue-600 hover:bg-blue-500 opacity-100 cursor-pointer' : 'bg-blue-600 opacity-50 cursor-not-allowed'}`}>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Enviar por Correo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      <Footer />
    </div>
  );
}
