import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-purple-500/10 rounded-[100%] rotate-45 mix-blend-screen filter blur-[80px]"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="w-full max-w-[420px] z-10 p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-2 drop-shadow-sm">
            Factur<span className="text-blue-500">.</span>
          </h1>
          <p className="text-zinc-400 text-xs font-medium tracking-widest uppercase">Plataforma de Facturación B2B</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
