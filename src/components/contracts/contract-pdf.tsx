import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

// Create styles
const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', paddingTop: 56.7, paddingLeft: 56.7, paddingRight: 56.7, paddingBottom: 150 },
  textLight: { color: '#71717a' },
  textDark: { color: '#18181b' },
  fontBold: { fontFamily: 'Helvetica-Bold' },

  // Classic
  headerClassic: { alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, paddingBottom: 20 },
  logoClassic: { width: 150, maxHeight: 71, objectFit: 'contain', marginBottom: 15 },
  titleClassic: { fontSize: 18, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' },
  
  // Modern
  headerModern: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, backgroundColor: '#f8fafc', padding: 20, borderRadius: 8 },
  logoModern: { width: 180, maxHeight: 85, objectFit: 'contain' },
  titleModern: { fontSize: 24, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8 },
  
  // Professional
  headerProf: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  logoBox: { width: '50%', alignItems: 'flex-start' },
  logoProf: { width: 216, maxHeight: 98, objectFit: 'contain', objectPosition: 'left' },
  companyName: { fontSize: 24, fontFamily: 'Helvetica-Bold' },
  headerRight: { width: '50%', alignItems: 'flex-end' },
  contractTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 6 },
  headerText: { fontSize: 10, color: '#71717a', marginBottom: 3 },
  headerTextBold: { fontFamily: 'Helvetica-Bold', color: '#18181b' },

  // Typography
  intro: { fontSize: 10, color: '#3f3f46', lineHeight: 1.5, marginBottom: 12, textAlign: 'justify', wordBreak: 'keep-all' },
  section: { marginBottom: 4 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8 },
  listItem: { flexDirection: 'row', marginBottom: 6 },
  listBullet: { width: 15, fontSize: 10, color: '#3f3f46' },
  listContent: { fontSize: 9, color: '#18181b', lineHeight: 1.4, textAlign: 'justify', wordBreak: 'keep-all', width: '100%' },

  // Signatures
  signatures: { position: 'absolute', bottom: 56.7, left: 56.7, right: 56.7, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20 },
  sigBox: { width: '40%', alignItems: 'center' },
  sigLine: { width: '100%', borderTopWidth: 1, borderTopColor: '#71717a', marginBottom: 5 },
  sigName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  sigRole: { fontSize: 9, color: '#71717a', marginTop: 2 },

  // Details box
  detailsBox: { backgroundColor: '#f4f4f5', padding: 12, borderRadius: 5, marginBottom: 12, flexDirection: 'row', flexWrap: 'wrap' },
  detailCol: { width: '50%', marginBottom: 10 },
  detailLabel: { fontSize: 8, color: '#71717a', textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  detailValue: { fontSize: 10, color: '#18181b' },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#a1a1aa', borderTopWidth: 1, borderTopColor: '#f4f4f5', paddingTop: 10 }
})

const colorMap: Record<string, string> = {
  blue: "#2563eb", emerald: "#059669", slate: "#475569", red: "#dc2626",
  dark: "#18181b", purple: "#9333ea", amber: "#d97706", indigo: "#1e3a8a", navy: "#1e3a8a"
}

function Section({ title, items, primaryColor }: { title: string, items: any, primaryColor: string }) {
  if (!items) return null
  
  let elements: React.ReactNode[] = []

  if (typeof items === "string" && items.trim()) {
    elements = items.split('\n').map((line, i) => (
      <Text key={i} style={[styles.listContent, { marginBottom: 4, fontSize: 9 }]}>
        {line.trim() === '' ? '\u00A0' : line}
      </Text>
    ))
  } else if (Array.isArray(items)) {
    let listData = []
    if (items.length > 0 && typeof items[0] === 'object' && items[0].content) {
      listData = items.map((i: any) => i.content)
    } else {
      listData = items.map((i: any) => String(i))
    }

    elements = listData.filter(text => text && text.trim()).map((str, idx) => {
      const prefix = /^\d+\./.test(str.trim()) ? "" : `${idx + 1}. `;
      return (
        <Text key={idx} style={[styles.listContent, { marginBottom: 4, fontSize: 9 }]}>
          {prefix}{str.trim()}
        </Text>
      )
    })
  }

  if (elements.length === 0) return null

  return (
    <View style={styles.section} wrap={false}>
      <Text style={[styles.sectionTitle, { color: primaryColor }]}>{title}</Text>
      <View style={{ paddingLeft: 15 }}>
        {elements}
      </View>
    </View>
  )
}

function ContractDetails({ contract, company, primaryColor }: any) {
  const clientServices = contract.client?.clientServices || []
  const services = clientServices.length > 0 ? clientServices : (contract.clientService ? [contract.clientService] : [])
  if (services.length === 0) return null

  let subtotal = 0
  let totalTax = 0
  services.forEach((s: any) => {
    const price = Number(s.agreedPrice)
    const tax = s.applyTax ? price * Number(s.taxRate) : 0
    subtotal += price
    totalTax += tax
  })
  const total = subtotal + totalTax

  return (
    <View style={[styles.detailsBox, { borderLeftWidth: 3, borderLeftColor: primaryColor }]}>
      <View style={{ width: '100%', marginBottom: 8 }}>
        <Text style={[styles.detailLabel, { color: primaryColor }]}>Servicios de Contrato Mensual</Text>
      </View>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        {/* Columna Izquierda: Servicios */}
        <View style={{ width: '50%', borderRightWidth: 1, borderRightColor: '#e4e4e7', paddingRight: 10 }}>
          {services.map((s: any, i: number) => (
            <View key={s.id || i} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
              <Text style={styles.detailValue}>{s.service?.name || "Servicio"}</Text>
              <Text style={styles.detailValue}>${Number(s.agreedPrice).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Columna Derecha: Totales */}
        <View style={{ width: '50%', paddingLeft: 10, justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ fontSize: 9, color: '#71717a' }}>Subtotal</Text>
            <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
          </View>
          {totalTax > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
              <Text style={{ fontSize: 9, color: '#71717a' }}>ITBMS</Text>
              <Text style={styles.detailValue}>${totalTax.toFixed(2)}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#d4d4d8', paddingTop: 3, marginTop: 1 }}>
            <Text style={[styles.detailValue, { fontFamily: 'Helvetica-Bold' }]}>Total</Text>
            <Text style={[styles.detailValue, { fontFamily: 'Helvetica-Bold' }]}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// Templates
function ProfessionalHeader({ contract, company, primaryColor }: any) {
  const meta = contract.client?.metadata;
  return (
    <View style={[styles.headerProf, { borderBottomColor: primaryColor }]}>
      <View style={styles.logoBox}>
        {company.logoUrl ? (
          <Image src={company.logoUrl} style={[styles.logoProf, company.logoWhiteBackground ? { backgroundColor: 'white', padding: 4, borderRadius: 4 } : {}]} />
        ) : (
          <Text style={[styles.companyName, { color: primaryColor }]}>{company.name}</Text>
        )}
      </View>
      <View style={styles.headerRight}>
        <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 4, textTransform: 'uppercase', textAlign: 'right' }}>{company.name}</Text>
        {company.slogan && (
          <Text style={{ fontSize: 9, color: '#71717a', fontFamily: 'Helvetica-BoldOblique', textAlign: 'right', marginBottom: 4 }}>
            {company.slogan}
          </Text>
        )}
        <Text style={[styles.contractTitle, { color: primaryColor, marginBottom: 4, textAlign: 'right', fontSize: 9 }]}>{contract.title}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 0, width: '100%', gap: 15 }}>
          {/* Columna 1 */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.headerText}>
              Período: <Text style={styles.headerTextBold}>{new Date().getFullYear()}</Text>
            </Text>
            <Text style={styles.headerText}>
              Inicio: <Text style={styles.headerTextBold}>{format(new Date(contract.startDate), "dd/MM/yyyy")}</Text>
            </Text>
            {contract.endDate && (
              <Text style={styles.headerText}>
                Vencimiento: <Text style={styles.headerTextBold}>{format(new Date(contract.endDate), "dd/MM/yyyy")}</Text>
              </Text>
            )}
            {company.address && (
              <Text style={{ ...styles.headerText, textAlign: 'right' }}>
                <Text style={styles.headerTextBold}>{company.address}</Text>
              </Text>
            )}
          </View>
          
          {/* Columna 2 */}
          <View style={{ alignItems: 'flex-end', maxWidth: '60%' }}>
            {(company.celular || company.phone) && (
              <Text style={styles.headerText} wrap={false}>
                Cel: <Text style={styles.headerTextBold}>{[company.celular, company.phone].filter(Boolean).join(" / ")}</Text>
              </Text>
            )}
            {company.ruc && (
              <Text style={styles.headerText}>
                RUC: <Text style={styles.headerTextBold}>{company.ruc}{company.dv ? ` DV ${company.dv}` : ""}</Text>
              </Text>
            )}
            {company.companyType === "TRANSPORTE_ESCOLAR" && meta?.transportista && (
              <Text style={styles.headerText}>
                Transportista: <Text style={styles.headerTextBold}>{meta.transportista}</Text>
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

function ModernHeader({ contract, company, primaryColor }: any) {
  return (
    <View style={[styles.headerModern, { borderLeftWidth: 4, borderLeftColor: primaryColor }]}>
      <View style={styles.logoBox}>
        <Text style={[styles.titleModern, { color: primaryColor }]}>{contract.title}</Text>
        <Text style={styles.headerText}>
          Vigencia: <Text style={styles.headerTextBold}>{format(new Date(contract.startDate), "dd/MM/yyyy")}</Text>
          {contract.endDate ? ` al ${format(new Date(contract.endDate), "dd/MM/yyyy")}` : " en adelante"}
        </Text>
      </View>
      <View style={styles.headerRight}>
        {company.logoUrl ? (
          <Image src={company.logoUrl} style={[styles.logoModern, company.logoWhiteBackground ? { backgroundColor: 'white', padding: 4, borderRadius: 4 } : {}]} />
        ) : (
          <Text style={[styles.companyName, { color: primaryColor, textAlign: 'right' }]}>{company.name}</Text>
        )}
      </View>
    </View>
  )
}

function ClassicHeader({ contract, company, primaryColor }: any) {
  return (
    <View style={[styles.headerClassic, { borderBottomColor: primaryColor }]}>
      {company.logoUrl ? (
        <Image src={company.logoUrl} style={[styles.logoClassic, company.logoWhiteBackground ? { backgroundColor: 'white', padding: 4, borderRadius: 4 } : {}]} />
      ) : (
        <Text style={[styles.companyName, { color: primaryColor, marginBottom: 15 }]}>{company.name}</Text>
      )}
      <Text style={[styles.titleClassic, { color: primaryColor }]}>{contract.title}</Text>
      <Text style={styles.headerText}>
        Suscrito el <Text style={styles.headerTextBold}>{format(new Date(contract.startDate), "dd/MM/yyyy")}</Text>
      </Text>
    </View>
  )
}

export function ContractPDF({ contract, company, ownerName, orientation = "portrait" }: any) {
  const primaryColor = colorMap[contract.pdfColor] || colorMap.slate
  const templateType = contract.pdfTemplate || "professional"

  const servicesList = contract.client?.clientServices || []
  const servicesDesc = servicesList.length > 0
    ? `los servicios de ${servicesList.map((s: any) => s.service?.name).filter(Boolean).join(", ")}`
    : contract.clientService
      ? `servicios de ${contract.clientService.service.name}`
      : "los servicios descritos a continuación"

  return (
    <Document>
      <Page size="A4" orientation={orientation} style={styles.page}>
        {templateType === "modern" && <ModernHeader contract={contract} company={company} primaryColor={primaryColor} />}
        {templateType === "classic" && <ClassicHeader contract={contract} company={company} primaryColor={primaryColor} />}
        {templateType === "professional" && <ProfessionalHeader contract={contract} company={company} primaryColor={primaryColor} />}

        <Text style={styles.intro}>
          Este documento constituye un acuerdo legal vinculante y formal entre <Text style={styles.fontBold}>{company.name}</Text> (en adelante "El Proveedor"){company.ruc ? ` con RUC ${company.ruc}${company.dv ? `-${company.dv}` : ""}` : ""} y <Text style={styles.fontBold}>{contract.client.name}</Text>{contract.client.email ? ` (${contract.client.email})` : ""} (en adelante "El Cliente"), para la prestación de {servicesDesc}. Ambas partes reconocen tener la capacidad legal necesaria para celebrar este contrato bajo los términos y condiciones estipulados a continuación.
        </Text>

        <View style={{ marginBottom: 12, padding: 12, backgroundColor: '#fafafa', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: primaryColor }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6, textTransform: 'uppercase' }}>Información del Cliente</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Nombre: <Text style={{ color: '#18181b' }}>{contract.client.name}</Text></Text>
            {contract.client.phone && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Celular: <Text style={{ color: '#18181b' }}>{contract.client.phone}</Text></Text>}
            {contract.client.direccion && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Dirección: <Text style={{ color: '#18181b' }}>{contract.client.direccion}</Text></Text>}
            
            {company.companyType === "TRANSPORTE_ESCOLAR" && contract.client.metadata && (
              <>
                {contract.client.metadata.acudiente && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Acudiente: <Text style={{ color: '#18181b' }}>{contract.client.metadata.acudiente}</Text></Text>}
                {contract.client.metadata.alumno && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Alumno: <Text style={{ color: '#18181b' }}>{contract.client.metadata.alumno}</Text></Text>}
                {contract.client.metadata.escuela && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Escuela: <Text style={{ color: '#18181b' }}>{contract.client.metadata.escuela}</Text></Text>}
                {contract.client.metadata.maestro && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Maestro(a): <Text style={{ color: '#18181b' }}>{contract.client.metadata.maestro}</Text></Text>}
                {contract.client.metadata.grado && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Grado: <Text style={{ color: '#18181b' }}>{contract.client.metadata.grado}</Text></Text>}
                {contract.client.metadata.maestroGrado && !contract.client.metadata.maestro && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Grado/Maestro: <Text style={{ color: '#18181b' }}>{contract.client.metadata.maestroGrado}</Text></Text>}
                {contract.client.metadata.seguro && <Text style={{ fontSize: 9, color: '#52525b', width: '48%' }}>Seguro: <Text style={{ color: '#18181b' }}>${contract.client.metadata.seguro}</Text></Text>}
              </>
            )}
          </View>
        </View>

        <ContractDetails contract={contract} company={company} primaryColor={primaryColor} />

        {(() => {
          const activeSections = company?.contractSections && Array.isArray(company.contractSections) && company.contractSections.length > 0
            ? company.contractSections
            : [
                "Cláusulas y Disposiciones Generales",
                "Responsabilidades del Cliente",
                "Condiciones Comerciales",
                "Causas de Terminación Anticipada"
              ];
              
          const hasContent = (data: any) => {
            if (!data) return false;
            if (typeof data === "string") return data.trim().length > 0;
            if (Array.isArray(data)) {
              const text = data.map((i: any) => typeof i === 'object' ? i.content || '' : i).join('');
              return text.trim().length > 0;
            }
            return false;
          };

          let validIndex = 1;
          return activeSections.map((sec: any) => {
            const titleText = typeof sec === 'object' ? sec.title : sec;
            let items: any = null;
            
            if (titleText === "Cláusulas y Disposiciones Generales") items = contract.clauses;
            if (titleText === "Responsabilidades del Cliente") items = contract.responsibilities;
            if (titleText === "Condiciones Comerciales") items = contract.conditions;
            if (titleText === "Causas de Terminación Anticipada") items = contract.exceptions;
            
            if (!hasContent(items)) return null;

            const displayTitle = `${validIndex++}. ${titleText}`;
            return <Section key={titleText} title={displayTitle} items={items} primaryColor={primaryColor} />;
          });
        })()}

        <View fixed style={styles.signatures} wrap={false}>
          <View style={styles.sigBox}>
            <View style={{ height: 45, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              {company.signatureUrl ? (
                <Image src={company.signatureUrl} style={{ width: 120, maxHeight: 40, objectFit: 'contain', marginBottom: 4 }} />
              ) : (
                <Text style={{ fontFamily: 'Times-Italic', fontSize: 14, color: primaryColor, marginBottom: 4 }}>
                  {ownerName || company.name}
                </Text>
              )}
            </View>
            <View style={styles.sigLine} />
            <View style={{ height: 40, alignItems: 'center', width: '100%' }}>
              <Text style={styles.sigName}>{company.name}</Text>
              <Text style={{ fontSize: 7, color: '#71717a', marginTop: 4, textAlign: 'center' }}>
                Firmado electrónicamente por {ownerName || company.name}{company.ruc ? ` - ${company.ruc}${company.dv ? `-${company.dv}` : ""}` : ""}
              </Text>
            </View>
          </View>
          <View style={styles.sigBox}>
            <View style={{ height: 45, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }} />
            <View style={styles.sigLine} />
            <View style={{ height: 40, alignItems: 'center', width: '100%' }}>
              <Text style={styles.sigName}>{contract.client.name}</Text>
              <Text style={styles.sigRole}>Firma del Cliente</Text>
            </View>
          </View>
        </View>


      </Page>
    </Document>
  )
}
