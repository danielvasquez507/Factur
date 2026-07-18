import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

// Create styles
const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', padding: 40 },
  textLight: { color: '#71717a' },
  textDark: { color: '#18181b' },
  fontBold: { fontFamily: 'Helvetica-Bold' },

  // Classic
  headerClassic: { alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, paddingBottom: 20 },
  logoClassic: { width: 150, height: 75, objectFit: 'contain', marginBottom: 15 },
  titleClassic: { fontSize: 18, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' },
  
  // Modern
  headerModern: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, backgroundColor: '#f8fafc', padding: 20, borderRadius: 8 },
  logoModern: { width: 180, height: 90, objectFit: 'contain' },
  titleModern: { fontSize: 24, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8 },
  
  // Professional
  headerProf: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30, paddingBottom: 20, borderBottomWidth: 2 },
  logoBox: { width: '50%' },
  logoProf: { width: 216, height: 108, objectFit: 'contain' },
  companyName: { fontSize: 24, fontFamily: 'Helvetica-Bold' },
  headerRight: { width: '50%', alignItems: 'flex-end' },
  contractTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 6 },
  headerText: { fontSize: 10, color: '#71717a', marginBottom: 3 },
  headerTextBold: { fontFamily: 'Helvetica-Bold', color: '#18181b' },

  // Typography
  intro: { fontSize: 10, color: '#3f3f46', lineHeight: 1.5, marginBottom: 20, textAlign: 'justify', wordBreak: 'keep-all' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8 },
  listItem: { flexDirection: 'row', marginBottom: 6 },
  listBullet: { width: 15, fontSize: 10, color: '#3f3f46' },
  listContent: { fontSize: 10, color: '#3f3f46', lineHeight: 1.4, textAlign: 'justify', wordBreak: 'keep-all', width: '100%' },

  // Signatures
  signatures: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 60, paddingTop: 40, borderTopWidth: 1, borderTopColor: '#e4e4e7' },
  sigBox: { width: '40%', alignItems: 'center' },
  sigLine: { width: '100%', borderTopWidth: 1, borderTopColor: '#71717a', marginBottom: 5 },
  sigName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  sigRole: { fontSize: 9, color: '#71717a', marginTop: 2 },

  // Details box
  detailsBox: { backgroundColor: '#f4f4f5', padding: 15, borderRadius: 5, marginBottom: 20, flexDirection: 'row', flexWrap: 'wrap' },
  detailCol: { width: '50%', marginBottom: 10 },
  detailLabel: { fontSize: 8, color: '#71717a', textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  detailValue: { fontSize: 10, color: '#18181b' },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#a1a1aa', borderTopWidth: 1, borderTopColor: '#f4f4f5', paddingTop: 10 }
})

const colorMap: Record<string, string> = {
  blue: "#2563eb", emerald: "#059669", slate: "#475569", red: "#dc2626",
  orange: "#ea580c", purple: "#9333ea", amber: "#d97706", teal: "#0d9488", indigo: "#4f46e5"
}

function Section({ title, items, primaryColor }: { title: string, items: any, primaryColor: string }) {
  if (!items) return null
  
  let content = ""
  if (typeof items === "string") {
    content = items
  } else if (Array.isArray(items)) {
    if (items.length > 0 && typeof items[0] === 'object' && items[0].content) {
      content = items.map((i: any) => i.content).join("\n\n")
    } else {
      content = items.join("\n\n")
    }
  }

  if (!content.trim()) return null

  return (
    <View style={styles.section} wrap={false}>
      <Text style={[styles.sectionTitle, { color: primaryColor }]}>{title}</Text>
      <View>
        {content.split('\n').map((line, i) => (
          <Text key={i} style={[styles.listContent, { marginBottom: 4 }]}>
            {line.trim() === '' ? '\u00A0' : line}
          </Text>
        ))}
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
        <Text style={styles.detailLabel}>Servicios Contratados</Text>
      </View>
      {services.map((s: any, i: number) => (
        <View key={s.id || i} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
          <Text style={styles.detailValue}>{s.service?.name || "Servicio"}</Text>
          <Text style={styles.detailValue}>${Number(s.agreedPrice).toFixed(2)}</Text>
        </View>
      ))}
      <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: '#d4d4d8', marginTop: 6, paddingTop: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
          <Text style={{ fontSize: 9, color: '#71717a' }}>Subtotal</Text>
          <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
          <Text style={{ fontSize: 9, color: '#71717a' }}>ITBMS</Text>
          <Text style={styles.detailValue}>${totalTax.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>Total</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>${total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  )
}

// Templates
function ProfessionalHeader({ contract, company, primaryColor }: any) {
  return (
    <View style={[styles.headerProf, { borderBottomColor: primaryColor }]}>
      <View style={styles.logoBox}>
        {company.logoUrl ? (
          <Image src={company.logoUrl} style={styles.logoProf} />
        ) : (
          <Text style={[styles.companyName, { color: primaryColor }]}>{company.name}</Text>
        )}
      </View>
      <View style={styles.headerRight}>
        <Text style={[styles.contractTitle, { color: primaryColor }]}>{contract.title}</Text>
        <Text style={styles.headerText}>
          Fecha de Inicio: <Text style={styles.headerTextBold}>{format(new Date(contract.startDate), "dd/MM/yyyy")}</Text>
        </Text>
        {contract.endDate && (
          <Text style={styles.headerText}>
            Fecha de Vencimiento: <Text style={styles.headerTextBold}>{format(new Date(contract.endDate), "dd/MM/yyyy")}</Text>
          </Text>
        )}
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
          <Image src={company.logoUrl} style={styles.logoModern} />
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
        <Image src={company.logoUrl} style={styles.logoClassic} />
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

        <ContractDetails contract={contract} company={company} primaryColor={primaryColor} />

        {(() => {
          const activeSections = company?.contractSections && Array.isArray(company.contractSections) && company.contractSections.length > 0
            ? company.contractSections
            : [
                "Cláusulas y Disposiciones Generales",
                "Responsabilidades del Cliente",
                "Condiciones Comerciales",
                "Excepciones y Limitaciones"
              ];
              
          return activeSections.map((sec: any, idx: number) => {
            const titleText = typeof sec === 'object' ? sec.title : sec;
            const displayTitle = `${idx + 1}. ${titleText}`;
            if (titleText === "Cláusulas y Disposiciones Generales") return <Section key="clauses" title={displayTitle} items={contract.clauses} primaryColor={primaryColor} />;
            if (titleText === "Responsabilidades del Cliente") return <Section key="resp" title={displayTitle} items={contract.responsibilities} primaryColor={primaryColor} />;
            if (titleText === "Condiciones Comerciales") return <Section key="cond" title={displayTitle} items={contract.conditions} primaryColor={primaryColor} />;
            if (titleText === "Excepciones y Limitaciones") return <Section key="exc" title={displayTitle} items={contract.exceptions} primaryColor={primaryColor} />;
            return null;
          });
        })()}

        <View style={styles.signatures} wrap={false}>
          <View style={styles.sigBox}>
            <Text style={{ fontFamily: 'Times-Italic', fontSize: 18, color: primaryColor, marginBottom: 8 }}>
              {ownerName || company.name}
            </Text>
            <View style={styles.sigLine} />
            <Text style={styles.sigName}>{company.name}</Text>
            <Text style={{ fontSize: 7, color: '#71717a', marginTop: 4, textAlign: 'center' }}>
              Firmado electrónicamente por {ownerName || company.name}{company.ruc ? ` - ${company.ruc}${company.dv ? `-${company.dv}` : ""}` : ""}
            </Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={{ fontSize: 18, color: 'white', marginBottom: 8 }}>
              Firma
            </Text>
            <View style={styles.sigLine} />
            <Text style={styles.sigName}>{contract.client.name}</Text>
            <Text style={styles.sigRole}>Firma del Cliente</Text>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          Generado automáticamente por Factur - {formatInTimeZone(new Date(), "America/Panama", "dd/MM/yyyy HH:mm")}
        </Text>
      </Page>
    </Document>
  )
}
