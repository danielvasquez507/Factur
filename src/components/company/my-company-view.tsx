"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowUp, ArrowDown, Save, BriefcaseBusiness, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { setActiveTenant } from "@/actions/tenant"
import { updateContractSections, updateDefaultContractTitle } from "@/actions/companies"
import { useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CompanyProfileForm } from "@/components/settings/company-profile-form"
import { Textarea } from "@/components/ui/textarea"

type SectionItem = { title: string; content: string }

const DEFAULT_SECTIONS: SectionItem[] = [
  { title: "Cláusulas y Disposiciones Generales", content: "" },
  { title: "Responsabilidades del Cliente", content: "" },
  { title: "Condiciones Comerciales", content: "" },
  { title: "Causas de Terminación Anticipada", content: "" }
]

const parseSections = (data: any): SectionItem[] => {
  if (data && Array.isArray(data) && data.length > 0) {
    return data.map((item: any) => {
      let title = typeof item === 'string' ? item : (item.title || "");
      if (title === "Excepciones y Limitaciones") {
        title = "Causas de Terminación Anticipada";
      }
      return { title, content: typeof item === 'string' ? "" : (item.content || "") };
    });
  }
  return DEFAULT_SECTIONS;
}

export function MyCompanyView({ user, userRole, activeCompanyId, activeCompany }: { user: any, userRole: string, activeCompanyId?: string | null, activeCompany?: any }) {
  const router = useRouter()
  
  // Initialize sections from DB or use defaults
  const [sections, setSections] = useState<SectionItem[]>(parseSections(activeCompany?.contractSections))
  const [defaultTitle, setDefaultTitle] = useState(activeCompany?.defaultContractTitle || "Contrato ")

  useEffect(() => {
    setSections(parseSections(activeCompany?.contractSections))
    setDefaultTitle(activeCompany?.defaultContractTitle || "Contrato ")
  }, [activeCompany?.id])
  const [isSaving, setIsSaving] = useState(false)

  const handleSwitchTenant = async (companyId: string) => {
    if (companyId === activeCompanyId) return;
    
    const toastId = toast.loading("Cambiando empresa...")
    try {
      await setActiveTenant(companyId)
      router.refresh()
      toast.success("Empresa seleccionada")
    } catch (err) {
      toast.error("Error al cambiar de empresa")
    } finally {
      toast.dismiss(toastId)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-black/40 border-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BriefcaseBusiness className="w-5 h-5 text-blue-500" />
            Mis Empresas
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Empresas a las que tienes acceso y tu rol en ellas. Haz clic en una para cambiar de empresa activa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.userCompanies?.length === 0 ? (
            <p className="text-sm text-zinc-500">No perteneces a ninguna empresa.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {user.userCompanies?.map((uc: any) => (
                <div 
                  key={uc.company.id} 
                  onClick={() => handleSwitchTenant(uc.company.id)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {uc.company.logoUrl ? (
                        <img src={uc.company.logoUrl} alt={uc.company.name} className="w-10 h-10 object-contain rounded-md" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          {uc.company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                          {uc.company.name}
                          {activeCompanyId === uc.company.id && (
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 text-[9px] px-1.5 py-0">
                              Activa
                            </Badge>
                          )}
                        </h4>
                        {uc.roleInCompany === "OWNER" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                            Propietario
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secciones de Datos y Contrato en Acordeón */}
      {activeCompany && (
        <Accordion className="w-full space-y-4">
          
          {/* Datos de la Empresa */}
          <AccordionItem value="datos" className="border-none" key={`datos-${activeCompany.id}`}>
            <AccordionTrigger className="hover:no-underline px-4 py-3 bg-white/5 border border-white/10 rounded-xl data-[state=open]:rounded-b-none transition-all items-center">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-lg text-white">Datos de la empresa</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-black/40 border border-t-0 border-white/10 rounded-b-xl backdrop-blur-md p-6">
              <CompanyProfileForm company={activeCompany} userRole={userRole} />
            </AccordionContent>
          </AccordionItem>

          {/* Configuración de Contrato */}
          <AccordionItem value="contrato-config" className="border-none" key={`contrato-${activeCompany.id}`}>
            <AccordionTrigger className="hover:no-underline px-4 py-3 bg-white/5 border border-white/10 rounded-xl data-[state=open]:rounded-b-none transition-all items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-lg text-white">Configuración de Contrato</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-black/40 border border-t-0 border-white/10 rounded-b-xl backdrop-blur-md p-6">
              
              <div className="mb-8">
                <h3 className="text-white font-medium mb-2">Título del contrato</h3>
                <p className="text-zinc-400 mb-3 text-sm">Título predeterminado de los contratos.</p>
                <input 
                  id="base-ui-_r_4a_" 
                  data-slot="input" 
                  placeholder="Ej. Contrato de Prestación de Servicios Profesionales" 
                  required 
                  className="h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 bg-black/50 border-white/10 text-white" 
                  value={defaultTitle}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith("Contrato")) {
                      if (val.toLowerCase().startsWith("contrato")) {
                        val = "Contrato" + val.slice(8);
                      } else {
                        val = "Contrato " + val;
                      }
                    }
                    setDefaultTitle(val);
                  }}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium mb-2">Puntos importantes de contrato</h3>
                <p className="text-zinc-400 mb-4 text-sm">
                  Define y ordena las secciones predeterminadas que se incluirán en los contratos de la empresa activa ({activeCompany.name}). 
                  Podrás modificarlas individualmente al generar cada contrato.
                </p>
                {sections.map((section, index) => (
                  <div 
                    key={section.title} 
                    className="flex flex-col gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-zinc-500 hidden sm:block" />
                      <span className="flex-1 font-medium text-zinc-200">{index + 1}. {section.title}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-white"
                          disabled={index === 0}
                          onClick={() => {
                            const newSections = [...sections]
                            const temp = newSections[index - 1]
                            newSections[index - 1] = newSections[index]
                            newSections[index] = temp
                            setSections(newSections)
                          }}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-white"
                          disabled={index === sections.length - 1}
                          onClick={() => {
                            const newSections = [...sections]
                            const temp = newSections[index + 1]
                            newSections[index + 1] = newSections[index]
                            newSections[index] = temp
                            setSections(newSections)
                          }}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      placeholder={`Texto predeterminado para ${section.title.toLowerCase()}...`}
                      className="min-h-[40px] max-h-[120px] bg-black/40 border-white/10 text-zinc-300 resize-y overflow-y-auto"
                      rows={2}
                      value={section.content}
                      onChange={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        const rawVal = target.value;
                        const originalCursor = target.selectionStart;
                        let newVal = rawVal;
                        
                        if (rawVal.trim() === '') {
                          newVal = '1. ';
                        } else {
                          const rawLines = rawVal.split('\n');
                          const formattedLines = rawLines.map((line, i) => {
                            const cleanLine = line.replace(/^\d+\.\s*/, '');
                            return `${i + 1}. ${cleanLine}`;
                          });
                          newVal = formattedLines.join('\n');
                        }

                        const newSections = [...sections];
                        newSections[index].content = newVal;
                        setSections(newSections);

                        target.style.height = "inherit";
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;

                        const addedChars = newVal.length - rawVal.length;
                        setTimeout(() => {
                          if (rawVal.trim() === '') {
                            target.selectionStart = target.selectionEnd = 3;
                          } else if (addedChars > 0) {
                            target.selectionStart = target.selectionEnd = originalCursor + addedChars;
                          } else {
                            target.selectionStart = target.selectionEnd = originalCursor;
                          }
                        }, 0);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={async () => {
                    setIsSaving(true)
                    const toastId = toast.loading("Guardando secciones...")
                    try {
                      const cleanedSections = sections.map(s => {
                        if (!s.content) return { ...s, content: '' };
                        
                        const lines = s.content.split('\n');
                        const actualLines = lines.map(line => line.replace(/^\d+\.\s*/, '').trim());
                        const filteredLines = actualLines.filter(line => line !== "");
                        
                        if (filteredLines.length === 0) return { ...s, content: '' };
                        
                        const reorderedContent = filteredLines.map((line, i) => `${i + 1}. ${line}`).join('\n');
                        return { ...s, content: reorderedContent };
                      })
                      setSections(cleanedSections)
                      
                      // Promise.all to save both sections and title concurrently
                      const [sectionsRes, titleRes] = await Promise.all([
                        updateContractSections(cleanedSections),
                        updateDefaultContractTitle(defaultTitle)
                      ])
                      
                      if (sectionsRes.error) throw new Error(sectionsRes.error)
                      if (titleRes.error) throw new Error(titleRes.error)
                      
                      toast.success("Configuración guardada correctamente")
                      router.refresh()
                    } catch (err: any) {
                      toast.error(err.message || "Error al guardar las secciones")
                    } finally {
                      toast.dismiss(toastId)
                      setIsSaving(false)
                    }
                  }} 
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      )}
    </div>
  )
}
