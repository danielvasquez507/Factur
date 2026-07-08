import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBypassPrisma } from "@/lib/prisma"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const bypassPrisma = getBypassPrisma()
  const dbUser = await bypassPrisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, name: true }
  })

  // Si ya lo completó, que se vaya al dashboard
  if (dbUser?.onboardingCompleted) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] relative overflow-hidden">
      {/* Dynamic Ambient Background (Aurora) */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-purple-500/10 rounded-[100%] rotate-45 mix-blend-screen filter blur-[80px]"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 p-4">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-5xl drop-shadow-lg">👋</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-2 drop-shadow-sm">
            ¡Hola, {dbUser?.name?.split(" ")[0] || "Bienvenido"}!
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            Para asegurar tu cuenta y personalizar tus facturas, necesitamos que completes estos pasos.
          </p>
        </div>

        <div className="bg-zinc-950/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <OnboardingForm />
          </div>
        </div>
      </div>
    </div>
  )
}
