import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'

// Create styles
const styles = StyleSheet.create({
  // Global
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  textLight: { color: '#71717a' },
  textDark: { color: '#18181b' },
  fontBold: { fontFamily: 'Helvetica-Bold' },
  
  // Classic Layout
  c_page: { padding: 40 },
  c_header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottomWidth: 1, borderBottomColor: '#e4e4e7', paddingBottom: 20 },
  c_logo: { width: 216, height: 108, objectFit: 'contain', objectPosition: 'left' },
  c_companyInfo: { fontSize: 9, color: '#71717a', textAlign: 'right' },
  c_sectionInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  c_infoBlock: { width: '45%' },
  c_label: { fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  c_valueText: { fontSize: 10, color: '#18181b', marginBottom: 2 },
  c_valueBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  c_tableHeader: { flexDirection: 'row', borderBottomWidth: 2, paddingBottom: 6, marginBottom: 8 },
  c_th: { fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
  c_tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  c_td: { fontSize: 9, color: '#3f3f46' },
  c_totalsBox: { width: '40%', marginLeft: 'auto', marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e4e4e7' },
  c_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  c_totalText: { fontSize: 9, color: '#3f3f46' },
  c_totalAmountBox: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4, borderTopWidth: 1 },
  c_totalAmountLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  c_totalAmountValue: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  c_notesBox: { marginTop: 40, padding: 15, backgroundColor: '#fafafa', borderRadius: 4 },
  
  // Modern Layout
  m_page: { padding: 0 },
  m_headerBanner: { minHeight: 120, paddingHorizontal: 40, paddingTop: 40, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
  m_logo: { width: 252, height: 108, objectFit: 'contain', objectPosition: 'left' },
  m_headerContent: { paddingHorizontal: 40, marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  m_invoiceDetails: { backgroundColor: '#f4f4f5', padding: 15, borderRadius: 8, width: '45%' },
  m_clientDetails: { width: '45%' },
  m_label: { fontSize: 8, color: '#71717a', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  m_valueText: { fontSize: 10, color: '#18181b', marginBottom: 2 },
  m_valueBold: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  m_tableContainer: { marginTop: 30, paddingHorizontal: 40 },
  m_tableHeader: { flexDirection: 'row', padding: 12, borderRadius: 6, marginBottom: 5 },
  m_th: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase' },
  m_tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  m_td: { fontSize: 10, color: '#3f3f46' },
  m_totalsWrapper: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 40, marginTop: 20 },
  m_totalsBox: { width: '45%', backgroundColor: '#f8fafc', padding: 20, borderRadius: 8 },
  m_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  m_totalText: { fontSize: 10, color: '#71717a' },
  m_totalAmountBox: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 6, borderTopWidth: 2 },
  m_totalAmountLabel: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  m_totalAmountValue: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  m_notesContainer: { paddingHorizontal: 40, marginTop: 30 },
  m_notesBox: { padding: 15, borderLeftWidth: 4, backgroundColor: '#f4f4f5' },
  m_paymentBox: { padding: 15, borderLeftWidth: 4, backgroundColor: '#f4f4f5', marginTop: 15 },
  
  // Elegant Layout
  e_page: { padding: 45 },
  e_borderTop: { height: 8, marginBottom: 30 },
  e_header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 35 },
  e_logo: { width: 234, height: 117, objectFit: 'contain', objectPosition: 'left' },
  e_invoiceTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: -1, marginBottom: 8 },
  e_invoiceNumber: { fontSize: 11, color: '#71717a' },
  e_divider: { height: 1, backgroundColor: '#e4e4e7', marginBottom: 25 },
  e_infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  e_infoBox: { width: '48%' },
  e_label: { fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontFamily: 'Helvetica-Bold' },
  e_valueText: { fontSize: 10, color: '#3f3f46', marginBottom: 3 },
  e_valueBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  e_tableHeader: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 2, marginBottom: 8 },
  e_th: { fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  e_tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  e_td: { fontSize: 9, color: '#3f3f46' },
  e_totalsSection: { marginTop: 25, alignItems: 'flex-end' },
  e_totalsBox: { width: 220 },
  e_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  e_totalText: { fontSize: 9, color: '#71717a' },
  e_totalBold: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  e_totalFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginTop: 8, borderTopWidth: 2 },
  e_totalFinalText: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  e_notesSection: { marginTop: 35, flexDirection: 'row', gap: 20 },
  e_notesBox: { flex: 1, padding: 15, backgroundColor: '#fafafa', borderRadius: 6 },
  
  // Bold Layout
  b_page: { padding: 0 },
  b_header: { padding: 40, paddingBottom: 30 },
  b_logoContainer: { marginBottom: 20 },
  b_logo: { width: 216, height: 108, objectFit: 'contain', objectPosition: 'left' },
  b_titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  b_title: { fontSize: 36, fontFamily: 'Helvetica-Bold', letterSpacing: -1.5 },
  b_invoiceNum: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  b_infoSection: { padding: 40, paddingTop: 25, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  b_infoBlock: { width: '45%' },
  b_label: { fontSize: 9, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
  b_valueText: { fontSize: 10, color: '#3f3f46', marginBottom: 3 },
  b_valueBold: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  b_tableSection: { padding: 40, paddingTop: 20 },
  b_tableHeader: { flexDirection: 'row', paddingVertical: 12, marginBottom: 8 },
  b_th: { fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
  b_tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
  b_td: { fontSize: 10, color: '#3f3f46' },
  b_totalsSection: { padding: 40, paddingTop: 20, alignItems: 'flex-end' },
  b_totalsBox: { width: 250, padding: 20, borderRadius: 8 },
  b_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  b_totalText: { fontSize: 10, color: '#71717a' },
  b_totalBold: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  b_totalFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, marginTop: 10, borderTopWidth: 3 },
  b_totalFinalText: { fontSize: 16, fontFamily: 'Helvetica-Bold' },
  b_notesSection: { padding: 40, paddingTop: 25, flexDirection: 'row', gap: 20 },
  b_notesBox: { flex: 1, padding: 18, borderRadius: 8 },
  
  // Professional Layout
  p_page: { padding: 0 },
  p_sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 180 },
  p_content: { marginLeft: 180, padding: 40 },
  p_logo: { width: 198, height: 99, objectFit: 'contain', objectPosition: 'left', marginBottom: 25 },
  p_companyInfo: { marginBottom: 30 },
  p_companyName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 8 },
  p_companyText: { fontSize: 8, color: 'rgba(255,255,255,0.8)', marginBottom: 3 },
  p_invoiceTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
  p_invoiceNumber: { fontSize: 11, color: '#71717a', marginBottom: 30 },
  p_infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  p_infoBox: { width: '48%' },
  p_label: { fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
  p_valueText: { fontSize: 10, color: '#3f3f46', marginBottom: 3 },
  p_valueBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  p_tableHeader: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 2, marginBottom: 8 },
  p_th: { fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  p_tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  p_td: { fontSize: 9, color: '#3f3f46' },
  p_totalsSection: { marginTop: 25, alignItems: 'flex-end' },
  p_totalsBox: { width: 220 },
  p_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  p_totalText: { fontSize: 9, color: '#71717a' },
  p_totalBold: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  p_totalFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginTop: 8, borderTopWidth: 2 },
  p_totalFinalText: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  p_notesSection: { marginTop: 35, flexDirection: 'row', gap: 20 },
  p_notesBox: { flex: 1, padding: 15, backgroundColor: '#f8f8f8', borderRadius: 6 },
  
  // Creative Layout
  cr_page: { padding: 0 },
  cr_headerBanner: { height: 140, paddingHorizontal: 40, paddingTop: 35, paddingBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cr_logo: { width: 234, height: 117, objectFit: 'contain', objectPosition: 'left' },
  cr_invoiceInfo: { alignItems: 'flex-end' },
  cr_invoiceTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 8 },
  cr_invoiceNumber: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  cr_content: { padding: 40 },
  cr_infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  cr_infoBox: { width: '48%' },
  cr_label: { fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
  cr_valueText: { fontSize: 10, color: '#3f3f46', marginBottom: 3 },
  cr_valueBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  cr_tableHeader: { flexDirection: 'row', paddingVertical: 12, borderRadius: 8, marginBottom: 8, paddingHorizontal: 15 },
  cr_th: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase' },
  cr_tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  cr_td: { fontSize: 9, color: '#3f3f46' },
  cr_totalsSection: { marginTop: 25, alignItems: 'flex-end' },
  cr_totalsBox: { width: 240, padding: 20, borderRadius: 10 },
  cr_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  cr_totalText: { fontSize: 10, color: '#71717a' },
  cr_totalBold: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  cr_totalFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, marginTop: 10, borderTopWidth: 2 },
  cr_totalFinalText: { fontSize: 15, fontFamily: 'Helvetica-Bold' },
  cr_notesSection: { marginTop: 35, flexDirection: 'row', gap: 20 },
  cr_notesBox: { flex: 1, padding: 18, borderRadius: 10 },
  
  // Executive Layout
  ex_page: { padding: 50 },
  ex_header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  ex_logoSection: { width: '50%' },
  ex_logo: { width: 252, height: 126, objectFit: 'contain', objectPosition: 'left' },
  ex_companyName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#18181b', marginTop: 10, letterSpacing: -0.5 },
  ex_companyText: { fontSize: 8, color: '#71717a', marginTop: 3 },
  ex_invoiceSection: { width: '50%', alignItems: 'flex-end' },
  ex_invoiceLabel: { fontSize: 9, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  ex_invoiceNumber: { fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 12 },
  ex_dateBox: { flexDirection: 'row', gap: 20 },
  ex_dateItem: { alignItems: 'flex-end' },
  ex_dateLabel: { fontSize: 7, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  ex_dateValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  ex_divider: { height: 2, marginBottom: 35 },
  ex_infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 },
  ex_infoBox: { width: '48%' },
  ex_label: { fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontFamily: 'Helvetica-Bold' },
  ex_valueText: { fontSize: 10, color: '#3f3f46', marginBottom: 3 },
  ex_valueBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 4 },
  ex_tableHeader: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 2, marginBottom: 10 },
  ex_th: { fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8 },
  ex_tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
  ex_td: { fontSize: 9, color: '#3f3f46' },
  ex_totalsSection: { marginTop: 30, alignItems: 'flex-end' },
  ex_totalsBox: { width: 230 },
  ex_totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  ex_totalText: { fontSize: 9, color: '#71717a' },
  ex_totalBold: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  ex_totalFinal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, marginTop: 10, borderTopWidth: 3 },
  ex_totalFinalText: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  ex_notesSection: { marginTop: 40, flexDirection: 'row', gap: 25 },
  ex_notesBox: { flex: 1, padding: 18, backgroundColor: '#fafafa', borderRadius: 6, borderLeftWidth: 3 },
})

const resolveImageUrl = (url: string) => {
  if (!url) return undefined;
  // Base64 data URI - react-pdf lo soporta directamente
  if (url.startsWith('data:')) return url;
  // URL absoluta - usar directamente
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // URL relativa - construir URL absoluta con la variable de entorno
  if (url.startsWith('/')) {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_APP_URL || 'https://factur.danielvasquez.cloud');
    return `${baseUrl}${url}`;
  }
  return url;
}

export function InvoicePDF({ invoice, company, orientation = "portrait" }: { invoice: any, company: any, orientation?: "portrait" | "landscape" }) {
  const formatCurrency = (val: number | string) => `$${Number(val).toFixed(2)}`
  
  const template = company.invoiceTemplate || 'modern'
  const invNum = String(invoice.invoiceNumber).padStart(6, '0')
  const logoUrl = resolveImageUrl(company.logoUrl || '/icon-512.png')
  
  const colorMap: Record<string, string> = {
    blue: '#2563eb',
    emerald: '#059669',
    slate: '#475569',
    red: '#dc2626',
    orange: '#ea580c',
    purple: '#9333ea',
    amber: '#d97706',
    teal: '#0d9488',
    indigo: '#4f46e5'
  }
  const primaryColor = colorMap[company.invoiceColor] || colorMap['slate']
  
  let paymentOpts = null
  try {
    if (company.paymentDetails) {
      const parsed = JSON.parse(company.paymentDetails)
      if (typeof parsed === 'object') paymentOpts = parsed
    }
  } catch(e) {}

  const renderPaymentOptions = (isModern: boolean) => {
    if (!paymentOpts) {
      if (!company.paymentDetails) return null
      return <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{company.paymentDetails}</Text>
    }
    
    return (
      <View style={{ lineHeight: 1.5 }}>
        {paymentOpts.cash && <Text style={{ fontSize: 9, color: '#3f3f46' }}>• Efectivo</Text>}
        {paymentOpts.yappy?.enabled && <Text style={{ fontSize: 9, color: '#3f3f46' }}>• Yappy</Text>}
        {paymentOpts.ach?.enabled && <Text style={{ fontSize: 9, color: '#3f3f46' }}>• Transferencia ACH</Text>}
      </View>
    )
  }
  
  switch (template) {
    case 'classic': return renderClassic()
    case 'minimal': return renderMinimal()
    case 'corporate': return renderCorporate()
    case 'elegant': return renderElegant()
    case 'bold': return renderBold()
    case 'professional': return renderProfessional()
    case 'creative': return renderCreative()
    case 'executive': return renderExecutive()
    default: return renderModern()
  }

  function renderClassic() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.c_page]}>
          <View style={styles.c_header}>
            <View style={{ width: '50%' }}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.c_logo} />
              ) : (
                <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: primaryColor, letterSpacing: -0.5 }}>{company.name}</Text>
              )}
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <Text style={[styles.c_companyInfo, styles.fontBold, { color: '#18181b', fontSize: 11, marginBottom: 2 }]}>{company.name}</Text>
              {company.ruc && <Text style={styles.c_companyInfo}>RUC: {company.ruc} {company.dv && `DV: ${company.dv}`}</Text>}
              {company.phone && <Text style={styles.c_companyInfo}>Tel: {company.phone}</Text>}
              {company.address && <Text style={styles.c_companyInfo}>{company.address}</Text>}
            </View>
          </View>
          <View style={styles.c_sectionInfo}>
            <View style={styles.c_infoBlock}>
              <Text style={styles.c_label}>Facturado A:</Text>
              <Text style={styles.c_valueBold}>{invoice.client.name}</Text>
              <Text style={styles.c_valueText}>{invoice.client.email}</Text>
              {invoice.client.phone && <Text style={styles.c_valueText}>{invoice.client.phone}</Text>}
            </View>
            <View style={[styles.c_infoBlock, { alignItems: 'flex-end' }]}>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={[styles.c_label, { width: 80, textAlign: 'right', marginRight: 10, marginBottom: 0 }]}>Factura N°:</Text>
                <Text style={[styles.c_valueBold, { width: 80, textAlign: 'right', color: primaryColor }]}>FAC-{invNum}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={[styles.c_label, { width: 80, textAlign: 'right', marginRight: 10, marginBottom: 0 }]}>Emisión:</Text>
                <Text style={[styles.c_valueText, { width: 80, textAlign: 'right' }]}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              </View>
              {invoice.dueDate && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.c_label, { width: 80, textAlign: 'right', marginRight: 10, marginBottom: 0 }]}>Vencimiento:</Text>
                  <Text style={[styles.c_valueText, { width: 80, textAlign: 'right' }]}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={[styles.c_tableHeader, { borderBottomColor: primaryColor }]}>
              <Text style={[styles.c_th, { width: '50%', color: primaryColor }]}>Descripción</Text>
              <Text style={[styles.c_th, { width: '15%', textAlign: 'center', color: primaryColor }]}>Cant.</Text>
              <Text style={[styles.c_th, { width: '15%', textAlign: 'right', color: primaryColor }]}>Precio Unit.</Text>
              <Text style={[styles.c_th, { width: '20%', textAlign: 'right', color: primaryColor }]}>Total</Text>
            </View>
            {invoice.items.map((item: any) => (
              <View key={item.id} style={styles.c_tableRow}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={[styles.c_td, styles.fontBold]}>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={[styles.c_td, { width: '15%', textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.c_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.c_td, styles.fontBold, { width: '20%', textAlign: 'right', color: '#18181b' }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.c_totalsBox}>
            <View style={styles.c_totalRow}>
              <Text style={styles.c_totalText}>Subtotal</Text>
              <Text style={[styles.c_totalText, styles.fontBold]}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            <View style={styles.c_totalRow}>
              <Text style={styles.c_totalText}>ITBMS (7%)</Text>
              <Text style={[styles.c_totalText, styles.fontBold]}>{formatCurrency(invoice.taxAmount)}</Text>
            </View>
            <View style={[styles.c_totalAmountBox, { borderTopColor: primaryColor }]}>
              <Text style={[styles.c_totalAmountLabel, { color: primaryColor }]}>Total USD</Text>
              <Text style={[styles.c_totalAmountValue, { color: primaryColor }]}>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'space-between' }}>
            {invoice.notes && (
              <View style={{ width: '48%', borderTopWidth: 2, borderTopColor: '#f4f4f5', paddingTop: 10 }}>
                <Text style={[styles.c_label, { color: primaryColor }]}>Notas / Términos</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View style={{ width: '48%', borderTopWidth: 2, borderTopColor: '#f4f4f5', paddingTop: 10, marginLeft: invoice.notes ? '4%' : 0 }}>
                <Text style={[styles.c_label, { color: primaryColor }]}>Opciones de Pago</Text>
                {renderPaymentOptions(false)}
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#a1a1aa', letterSpacing: 1 }}>{company.name} • Gracias por su preferencia</Text>
          </View>
        </Page>
      </Document>
    )
  }

  function renderModern() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.m_page]}>
          <View style={[styles.m_headerBanner, { backgroundColor: primaryColor }]}>
            <View style={{ width: '60%' }}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.m_logo} />
              ) : (
                <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: -1 }}>{company.name}</Text>
              )}
              {company.ruc && <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>RUC: {company.ruc} {company.dv && `DV: ${company.dv}`}</Text>}
              {company.phone && <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Tel: {company.phone}</Text>}
              {company.address && <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{company.address}</Text>}
            </View>
            <View style={{ width: '40%', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Factura N°</Text>
              <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>FAC-{invNum}</Text>
            </View>
          </View>
          <View style={styles.m_headerContent}>
            <View style={styles.m_clientDetails}>
              <Text style={styles.m_label}>Facturado A</Text>
              <Text style={styles.m_valueBold}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={styles.m_valueText}>{invoice.client.email}</Text>}
              {invoice.client.phone && <Text style={styles.m_valueText}>{invoice.client.phone}</Text>}
            </View>
            <View style={styles.m_invoiceDetails}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={styles.m_label}>Fecha Emisión</Text>
                <Text style={[styles.m_valueText, styles.fontBold]}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              </View>
              {invoice.dueDate && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={styles.m_label}>Vencimiento</Text>
                  <Text style={[styles.m_valueText, styles.fontBold]}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.m_tableContainer}>
            <View style={[styles.m_tableHeader, { backgroundColor: primaryColor }]}>
              <Text style={[styles.m_th, { width: '50%' }]}>Descripción</Text>
              <Text style={[styles.m_th, { width: '15%', textAlign: 'center' }]}>Cant.</Text>
              <Text style={[styles.m_th, { width: '15%', textAlign: 'right' }]}>Precio Unit.</Text>
              <Text style={[styles.m_th, { width: '20%', textAlign: 'right' }]}>Total</Text>
            </View>
            {invoice.items.map((item: any, index: number) => (
              <View key={item.id} style={[styles.m_tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }]}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={[styles.m_td, styles.fontBold, { color: '#18181b' }]}>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={[styles.m_td, { width: '15%', textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.m_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.m_td, styles.fontBold, { width: '20%', textAlign: 'right', color: primaryColor }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.m_totalsWrapper}>
            <View style={styles.m_totalsBox}>
              <View style={styles.m_totalRow}>
                <Text style={styles.m_totalText}>Subtotal</Text>
                <Text style={[styles.m_totalText, styles.fontBold, { color: '#18181b' }]}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              <View style={styles.m_totalRow}>
                <Text style={styles.m_totalText}>ITBMS (7%)</Text>
                <Text style={[styles.m_totalText, styles.fontBold, { color: '#18181b' }]}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
              <View style={[styles.m_totalAmountBox, { borderTopColor: primaryColor }]}>
                <Text style={[styles.m_totalAmountLabel, { color: primaryColor }]}>Total USD</Text>
                <Text style={[styles.m_totalAmountValue, { color: primaryColor }]}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.m_notesContainer}>
            {invoice.notes && (
              <View style={[styles.m_notesBox, { borderLeftColor: primaryColor }]}>
                <Text style={[styles.m_label, { color: primaryColor, fontFamily: 'Helvetica-Bold' }]}>Notas / Términos</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View style={[styles.m_paymentBox, { borderLeftColor: primaryColor }]}>
                <Text style={[styles.m_label, { color: primaryColor, fontFamily: 'Helvetica-Bold' }]}>Opciones de Pago</Text>
                {renderPaymentOptions(true)}
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, backgroundColor: primaryColor, opacity: 0.8 }} />
        </Page>
      </Document>
    )
  }

  function renderMinimal() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, { padding: 50 }]}>
          {/* Header - minimal */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50 }}>
            <View>
              {logoUrl ? (
                <Image src={logoUrl} style={{ width: 180, height: 90, objectFit: 'contain' }} />
              ) : (
                <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#18181b', letterSpacing: -0.3 }}>{company.name}</Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>Factura</Text>
              <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: primaryColor }}>FAC-{invNum}</Text>
            </View>
          </View>

          {/* Thin divider */}
          <View style={{ height: 1, backgroundColor: '#e4e4e7', marginBottom: 30 }} />

          {/* Info row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
            <View>
              <Text style={{ fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Cliente</Text>
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 2 }}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.client.email}</Text>}
              {invoice.client.phone && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.client.phone}</Text>}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Emisión</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              {invoice.dueDate && (
                <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>Vence: {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
              )}
            </View>
          </View>

          {/* Minimal table with thin borders */}
          <View style={{ marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#d4d4d8' }}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, width: '50%' }}>Descripción</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, width: '15%', textAlign: 'center' }}>Cant</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, width: '15%', textAlign: 'right' }}>Precio</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, width: '20%', textAlign: 'right' }}>Total</Text>
            </View>
            {invoice.items.map((item: any) => (
              <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' }}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{item.description}</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#3f3f46', width: '15%', textAlign: 'center' }}>{item.quantity}</Text>
                <Text style={{ fontSize: 10, color: '#3f3f46', width: '15%', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b', width: '20%', textAlign: 'right' }}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}
          </View>

          {/* Totals - clean minimal */}
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ width: 180 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                <Text style={{ fontSize: 9, color: '#71717a' }}>Subtotal</Text>
                <Text style={{ fontSize: 9, color: '#18181b' }}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                <Text style={{ fontSize: 9, color: '#71717a' }}>ITBMS (7%)</Text>
                <Text style={{ fontSize: 9, color: '#18181b' }}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, marginTop: 3, borderTopWidth: 2, borderTopColor: '#18181b' }}>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>Total USD</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: primaryColor }}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes & Payments */}
          <View style={{ marginTop: 40 }}>
            {invoice.notes && (
              <View style={{ marginBottom: company.paymentDetails ? 15 : 0 }}>
                <Text style={{ fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Notas</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View>
                <Text style={{ fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Métodos de Pago</Text>
                {renderPaymentOptions(false)}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 8, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 7, color: '#a1a1aa' }}>{company.ruc ? `RUC: ${company.ruc}${company.dv ? ` DV: ${company.dv}` : ''}  ·  ` : ''}{company.phone ? `${company.phone}  ·  ` : ''}{company.address || ''}</Text>
          </View>
        </Page>
      </Document>
    )
  }

  function renderCorporate() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, { padding: 40 }]}>
          {/* Letterhead header */}
          <View style={{ borderBottomWidth: 3, borderBottomColor: primaryColor, paddingBottom: 15, marginBottom: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                {logoUrl ? (
                  <Image src={logoUrl} style={{ width: 144, height: 90, objectFit: 'contain' }} />
                ) : null}
                <View>
                  <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#18181b', letterSpacing: -0.5 }}>{company.name}</Text>
                  <View style={{ marginTop: 4 }}>
                    {company.ruc && <Text style={{ fontSize: 8, color: '#71717a' }}>RUC: {company.ruc}{company.dv ? `-${company.dv}` : ''}</Text>}
                    {company.phone && <Text style={{ fontSize: 8, color: '#71717a' }}>Tel: {company.phone}</Text>}
                    {company.address && <Text style={{ fontSize: 8, color: '#71717a' }}>{company.address}</Text>}
                  </View>
                </View>
              </View>
              <View style={{ backgroundColor: primaryColor, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 3 }}>
                <Text style={{ fontSize: 9, color: '#ffffff', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 }}>FAC-{invNum}</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 2, backgroundColor: '#e4e4e7', marginBottom: 25 }} />

          {/* Invoice title */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: 1 }}>Factura Comercial</Text>
          </View>

          {/* Info blocks */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
            <View style={{ width: '48%', backgroundColor: '#f8f8f8', padding: 12, borderRadius: 4 }}>
              <Text style={{ fontSize: 8, color: primaryColor, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Facturado a</Text>
              <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 2 }}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.client.email}</Text>}
              {invoice.client.phone && <Text style={{ fontSize: 9, color: '#71717a' }}>{invoice.client.phone}</Text>}
            </View>
            <View style={{ width: '48%', backgroundColor: '#f8f8f8', padding: 12, borderRadius: 4, alignItems: 'flex-end' }}>
              <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 8, color: primaryColor, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Emisión</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              </View>
              {invoice.dueDate && (
                <View>
                  <Text style={{ fontSize: 8, color: primaryColor, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Vencimiento</Text>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Corporate table */}
          <View style={{ marginBottom: 25 }}>
            <View style={{ flexDirection: 'row', backgroundColor: primaryColor, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 3 }}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, width: '50%' }}>Descripción</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, width: '12%', textAlign: 'center' }}>Cant.</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, width: '15%', textAlign: 'right' }}>P. Unit.</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, width: '10%', textAlign: 'right' }}>ITBMS</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, width: '13%', textAlign: 'right' }}>Total</Text>
            </View>
            {invoice.items.map((item: any, index: number) => (
              <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e4e4e7', backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 7, color: '#a1a1aa' }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={{ fontSize: 9, color: '#3f3f46', width: '12%', textAlign: 'center' }}>{item.quantity}</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', width: '15%', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', width: '10%', textAlign: 'right' }}>{formatCurrency(item.applyTax ? item.taxAmount || 0 : 0)}</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b', width: '13%', textAlign: 'right' }}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={{ alignItems: 'flex-end', marginBottom: 30 }}>
            <View style={{ width: 250 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                <Text style={{ fontSize: 9, color: '#71717a' }}>Subtotal</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                <Text style={{ fontSize: 9, color: '#71717a' }}>ITBMS (7%)</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4, borderTopWidth: 2, borderTopColor: primaryColor, backgroundColor: '#f8f8f8', paddingHorizontal: 10, borderRadius: 3 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Total USD</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: primaryColor }}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes & Payments */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 15 }}>
            {invoice.notes && (
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 8, color: primaryColor, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Notas</Text>
                <Text style={{ fontSize: 8, color: '#71717a', lineHeight: 1.4 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 8, color: primaryColor, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Métodos de Pago</Text>
                <View style={{ fontSize: 8, color: '#71717a', lineHeight: 1.4 }}>
                  {renderPaymentOptions(false)}
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <View style={{ backgroundColor: primaryColor, paddingVertical: 8, paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ fontSize: 7, color: '#ffffff', letterSpacing: 0.5 }}>{company.name}</Text>
              {company.ruc && <Text style={{ fontSize: 7, color: '#ffffff', letterSpacing: 0.5 }}>  ·  RUC: {company.ruc}{company.dv ? `-${company.dv}` : ''}</Text>}
              {company.phone && <Text style={{ fontSize: 7, color: '#ffffff', letterSpacing: 0.5 }}>  ·  {company.phone}</Text>}
              {company.address && <Text style={{ fontSize: 7, color: '#ffffff', letterSpacing: 0.5 }}>  ·  {company.address}</Text>}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  function renderElegant() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.e_page]}>
          {/* Top border accent */}
          <View style={[styles.e_borderTop, { backgroundColor: primaryColor }]} />
          
          {/* Header */}
          <View style={styles.e_header}>
            <View style={{ width: '50%' }}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.e_logo} />
              ) : (
                <Text style={{ fontSize: 26, fontFamily: 'Helvetica-Bold', color: primaryColor, letterSpacing: -0.5 }}>{company.name}</Text>
              )}
              {company.ruc && <Text style={{ fontSize: 9, color: '#71717a', marginTop: 6 }}>RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ''}</Text>}
              {company.phone && <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>Tel: {company.phone}</Text>}
              {company.address && <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>{company.address}</Text>}
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <Text style={[styles.e_invoiceTitle, { color: primaryColor }]}>FACTURA</Text>
              <Text style={styles.e_invoiceNumber}>N° FAC-{invNum}</Text>
            </View>
          </View>

          <View style={styles.e_divider} />

          {/* Info Grid */}
          <View style={styles.e_infoGrid}>
            <View style={styles.e_infoBox}>
              <Text style={styles.e_label}>Facturado A</Text>
              <Text style={styles.e_valueBold}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={styles.e_valueText}>{invoice.client.email}</Text>}
              {invoice.client.phone && <Text style={styles.e_valueText}>{invoice.client.phone}</Text>}
              {invoice.client.direccion && <Text style={styles.e_valueText}>{invoice.client.direccion}</Text>}
            </View>
            <View style={[styles.e_infoBox, { alignItems: 'flex-end' }]}>
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.e_label}>Fecha de Emisión</Text>
                <Text style={[styles.e_valueBold, { fontSize: 11 }]}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              </View>
              {invoice.dueDate && (
                <View>
                  <Text style={styles.e_label}>Fecha de Vencimiento</Text>
                  <Text style={[styles.e_valueBold, { fontSize: 11 }]}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Table */}
          <View style={[styles.e_tableHeader, { borderBottomColor: primaryColor }]}>
            <Text style={[styles.e_th, { width: '50%', color: primaryColor }]}>Descripción</Text>
            <Text style={[styles.e_th, { width: '12%', textAlign: 'center', color: primaryColor }]}>Cant.</Text>
            <Text style={[styles.e_th, { width: '15%', textAlign: 'right', color: primaryColor }]}>P. Unit.</Text>
            <Text style={[styles.e_th, { width: '10%', textAlign: 'right', color: primaryColor }]}>ITBMS</Text>
            <Text style={[styles.e_th, { width: '13%', textAlign: 'right', color: primaryColor }]}>Total</Text>
          </View>
          {invoice.items.map((item: any) => (
            <View key={item.id} style={styles.e_tableRow}>
              <View style={{ width: '50%', paddingRight: 10 }}>
                <Text style={[styles.e_td, styles.fontBold, { color: '#18181b' }]}>{item.description}</Text>
                {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
              </View>
              <Text style={[styles.e_td, { width: '12%', textAlign: 'center' }]}>{item.quantity}</Text>
              <Text style={[styles.e_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.e_td, { width: '10%', textAlign: 'right' }]}>{formatCurrency(item.applyTax ? item.taxAmount || 0 : 0)}</Text>
              <Text style={[styles.e_td, styles.fontBold, { width: '13%', textAlign: 'right', color: '#18181b' }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
            </View>
          ))}

          {/* Totals */}
          <View style={styles.e_totalsSection}>
            <View style={styles.e_totalsBox}>
              <View style={styles.e_totalRow}>
                <Text style={styles.e_totalText}>Subtotal</Text>
                <Text style={styles.e_totalBold}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              <View style={styles.e_totalRow}>
                <Text style={styles.e_totalText}>ITBMS (7%)</Text>
                <Text style={styles.e_totalBold}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
              <View style={[styles.e_totalFinal, { borderTopColor: primaryColor }]}>
                <Text style={[styles.e_totalFinalText, { color: primaryColor }]}>TOTAL USD</Text>
                <Text style={[styles.e_totalFinalText, { color: primaryColor }]}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes & Payments */}
          <View style={styles.e_notesSection}>
            {invoice.notes && (
              <View style={styles.e_notesBox}>
                <Text style={[styles.e_label, { color: primaryColor, marginBottom: 6 }]}>Notas / Términos</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View style={styles.e_notesBox}>
                <Text style={[styles.e_label, { color: primaryColor, marginBottom: 6 }]}>Opciones de Pago</Text>
                {renderPaymentOptions(false)}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 30, left: 45, right: 45, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#a1a1aa', letterSpacing: 1 }}>{company.name} • Gracias por su preferencia</Text>
          </View>
        </Page>
      </Document>
    )
  }

  function renderBold() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.b_page]}>
          {/* Header with background */}
          <View style={[styles.b_header, { backgroundColor: primaryColor }]}>
            <View style={styles.b_logoContainer}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.b_logo} />
              ) : (
                <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: -1 }}>{company.name}</Text>
              )}
            </View>
            <View style={styles.b_titleSection}>
              <Text style={[styles.b_title, { color: '#ffffff' }]}>FACTURA</Text>
              <Text style={[styles.b_invoiceNum, { color: '#ffffff' }]}>FAC-{invNum}</Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.b_infoSection}>
            <View style={styles.b_infoBlock}>
              <Text style={styles.b_label}>Cliente</Text>
              <Text style={styles.b_valueBold}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={styles.b_valueText}>{invoice.client.email}</Text>}
              {invoice.client.phone && <Text style={styles.b_valueText}>{invoice.client.phone}</Text>}
              {invoice.client.direccion && <Text style={styles.b_valueText}>{invoice.client.direccion}</Text>}
            </View>
            <View style={[styles.b_infoBlock, { alignItems: 'flex-end' }]}>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.b_label}>Emisión</Text>
                <Text style={[styles.b_valueBold, { fontSize: 12 }]}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              </View>
              {invoice.dueDate && (
                <View>
                  <Text style={styles.b_label}>Vencimiento</Text>
                  <Text style={[styles.b_valueBold, { fontSize: 12 }]}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Company Info */}
          <View style={{ padding: 40, paddingTop: 0, paddingBottom: 20 }}>
            <View style={{ backgroundColor: '#f8f8f8', padding: 15, borderRadius: 8 }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>EMISOR</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 3 }}>{company.name}</Text>
              {company.ruc && <Text style={{ fontSize: 9, color: '#71717a' }}>RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ''}</Text>}
              {company.phone && <Text style={{ fontSize: 9, color: '#71717a' }}>Tel: {company.phone}</Text>}
              {company.address && <Text style={{ fontSize: 9, color: '#71717a' }}>{company.address}</Text>}
            </View>
          </View>

          {/* Table */}
          <View style={styles.b_tableSection}>
            <View style={[styles.b_tableHeader, { borderBottomWidth: 3, borderBottomColor: primaryColor }]}>
              <Text style={[styles.b_th, { width: '50%', color: primaryColor }]}>Descripción</Text>
              <Text style={[styles.b_th, { width: '12%', textAlign: 'center', color: primaryColor }]}>Cant.</Text>
              <Text style={[styles.b_th, { width: '15%', textAlign: 'right', color: primaryColor }]}>Precio</Text>
              <Text style={[styles.b_th, { width: '10%', textAlign: 'right', color: primaryColor }]}>ITBMS</Text>
              <Text style={[styles.b_th, { width: '13%', textAlign: 'right', color: primaryColor }]}>Total</Text>
            </View>
            {invoice.items.map((item: any, index: number) => (
              <View key={item.id} style={[styles.b_tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }]}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={[styles.b_td, styles.fontBold, { color: '#18181b' }]}>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={[styles.b_td, { width: '12%', textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.b_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.b_td, { width: '10%', textAlign: 'right' }]}>{formatCurrency(item.applyTax ? item.taxAmount || 0 : 0)}</Text>
                <Text style={[styles.b_td, styles.fontBold, { width: '13%', textAlign: 'right', color: primaryColor }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.b_totalsSection}>
            <View style={[styles.b_totalsBox, { backgroundColor: '#f8f8f8' }]}>
              <View style={styles.b_totalRow}>
                <Text style={styles.b_totalText}>Subtotal</Text>
                <Text style={styles.b_totalBold}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              <View style={styles.b_totalRow}>
                <Text style={styles.b_totalText}>ITBMS (7%)</Text>
                <Text style={styles.b_totalBold}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
              <View style={[styles.b_totalFinal, { borderTopColor: primaryColor }]}>
                <Text style={[styles.b_totalFinalText, { color: primaryColor }]}>TOTAL USD</Text>
                <Text style={[styles.b_totalFinalText, { color: primaryColor }]}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes & Payments */}
          <View style={styles.b_notesSection}>
            {invoice.notes && (
              <View style={[styles.b_notesBox, { backgroundColor: '#f8f8f8' }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>NOTAS</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View style={[styles.b_notesBox, { backgroundColor: '#f8f8f8' }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>PAGO</Text>
                {renderPaymentOptions(false)}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 25, backgroundColor: primaryColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 8, color: '#ffffff', letterSpacing: 1 }}>{company.name} • Gracias por su confianza</Text>
          </View>
        </Page>
      </Document>
    )
  }

  function renderProfessional() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.p_page]}>
          {/* Sidebar */}
          <View style={[styles.p_sidebar, { backgroundColor: primaryColor }]}>
            <View style={{ padding: 30, paddingTop: 40 }}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.p_logo} />
              ) : (
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 20, letterSpacing: -0.5 }}>{company.name}</Text>
              )}
              <View style={styles.p_companyInfo}>
                <Text style={styles.p_companyName}>{company.name}</Text>
                {company.ruc && <Text style={styles.p_companyText}>RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ''}</Text>}
                {company.phone && <Text style={styles.p_companyText}>Tel: {company.phone}</Text>}
                {company.address && <Text style={styles.p_companyText}>{company.address}</Text>}
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.p_content}>
            <Text style={[styles.p_invoiceTitle, { color: primaryColor }]}>FACTURA</Text>
            <Text style={styles.p_invoiceNumber}>N° FAC-{invNum}</Text>

            {/* Info Grid */}
            <View style={styles.p_infoGrid}>
              <View style={styles.p_infoBox}>
                <Text style={styles.p_label}>Facturado A</Text>
                <Text style={styles.p_valueBold}>{invoice.client.name}</Text>
                {invoice.client.email && <Text style={styles.p_valueText}>{invoice.client.email}</Text>}
                {invoice.client.phone && <Text style={styles.p_valueText}>{invoice.client.phone}</Text>}
                {invoice.client.direccion && <Text style={styles.p_valueText}>{invoice.client.direccion}</Text>}
              </View>
              <View style={[styles.p_infoBox, { alignItems: 'flex-end' }]}>
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.p_label}>Emisión</Text>
                  <Text style={[styles.p_valueBold, { fontSize: 11 }]}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
                </View>
                {invoice.dueDate && (
                  <View>
                    <Text style={styles.p_label}>Vencimiento</Text>
                    <Text style={[styles.p_valueBold, { fontSize: 11 }]}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Table */}
            <View style={[styles.p_tableHeader, { borderBottomColor: primaryColor }]}>
              <Text style={[styles.p_th, { width: '50%', color: primaryColor }]}>Descripción</Text>
              <Text style={[styles.p_th, { width: '12%', textAlign: 'center', color: primaryColor }]}>Cant.</Text>
              <Text style={[styles.p_th, { width: '15%', textAlign: 'right', color: primaryColor }]}>P. Unit.</Text>
              <Text style={[styles.p_th, { width: '10%', textAlign: 'right', color: primaryColor }]}>ITBMS</Text>
              <Text style={[styles.p_th, { width: '13%', textAlign: 'right', color: primaryColor }]}>Total</Text>
            </View>
            {invoice.items.map((item: any) => (
              <View key={item.id} style={styles.p_tableRow}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={[styles.p_td, styles.fontBold, { color: '#18181b' }]}>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={[styles.p_td, { width: '12%', textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.p_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.p_td, { width: '10%', textAlign: 'right' }]}>{formatCurrency(item.applyTax ? item.taxAmount || 0 : 0)}</Text>
                <Text style={[styles.p_td, styles.fontBold, { width: '13%', textAlign: 'right', color: '#18181b' }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}

            {/* Totals */}
            <View style={styles.p_totalsSection}>
              <View style={styles.p_totalsBox}>
                <View style={styles.p_totalRow}>
                  <Text style={styles.p_totalText}>Subtotal</Text>
                  <Text style={styles.p_totalBold}>{formatCurrency(invoice.subtotal)}</Text>
                </View>
                <View style={styles.p_totalRow}>
                  <Text style={styles.p_totalText}>ITBMS (7%)</Text>
                  <Text style={styles.p_totalBold}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>
                <View style={[styles.p_totalFinal, { borderTopColor: primaryColor }]}>
                  <Text style={[styles.p_totalFinalText, { color: primaryColor }]}>TOTAL USD</Text>
                  <Text style={[styles.p_totalFinalText, { color: primaryColor }]}>{formatCurrency(invoice.total)}</Text>
                </View>
              </View>
            </View>

            {/* Notes & Payments */}
            <View style={styles.p_notesSection}>
              {invoice.notes && (
                <View style={styles.p_notesBox}>
                  <Text style={[styles.p_label, { color: primaryColor, marginBottom: 6 }]}>Notas</Text>
                  <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
                </View>
              )}
              {company.paymentDetails && (
                <View style={styles.p_notesBox}>
                  <Text style={[styles.p_label, { color: primaryColor, marginBottom: 6 }]}>Pago</Text>
                  {renderPaymentOptions(false)}
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 30, left: 220, right: 40, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#a1a1aa', letterSpacing: 1 }}>{company.name} • Gracias por su preferencia</Text>
          </View>
        </Page>
      </Document>
    )
  }

  function renderCreative() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.cr_page]}>
          {/* Header Banner */}
          <View style={[styles.cr_headerBanner, { backgroundColor: primaryColor }]}>
            <View style={{ width: '50%' }}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.cr_logo} />
              ) : (
                <Text style={{ fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: -0.5 }}>{company.name}</Text>
              )}
            </View>
            <View style={styles.cr_invoiceInfo}>
              <Text style={styles.cr_invoiceTitle}>FACTURA</Text>
              <Text style={styles.cr_invoiceNumber}>N° FAC-{invNum}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.cr_content}>
            {/* Info Grid */}
            <View style={styles.cr_infoGrid}>
              <View style={styles.cr_infoBox}>
                <Text style={styles.cr_label}>Cliente</Text>
                <Text style={styles.cr_valueBold}>{invoice.client.name}</Text>
                {invoice.client.email && <Text style={styles.cr_valueText}>{invoice.client.email}</Text>}
                {invoice.client.phone && <Text style={styles.cr_valueText}>{invoice.client.phone}</Text>}
                {invoice.client.direccion && <Text style={styles.cr_valueText}>{invoice.client.direccion}</Text>}
              </View>
              <View style={[styles.cr_infoBox, { alignItems: 'flex-end' }]}>
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.cr_label}>Emisión</Text>
                  <Text style={[styles.cr_valueBold, { fontSize: 11 }]}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
                </View>
                {invoice.dueDate && (
                  <View>
                    <Text style={styles.cr_label}>Vencimiento</Text>
                    <Text style={[styles.cr_valueBold, { fontSize: 11 }]}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Company Info Box */}
            <View style={{ backgroundColor: '#f8f8f8', padding: 15, borderRadius: 10, marginBottom: 25 }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>EMISOR</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 3 }}>{company.name}</Text>
              {company.ruc && <Text style={{ fontSize: 9, color: '#71717a' }}>RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ''}</Text>}
              {company.phone && <Text style={{ fontSize: 9, color: '#71717a' }}>Tel: {company.phone}</Text>}
            </View>

            {/* Table */}
            <View style={[styles.cr_tableHeader, { backgroundColor: primaryColor }]}>
              <Text style={[styles.cr_th, { width: '50%' }]}>Descripción</Text>
              <Text style={[styles.cr_th, { width: '12%', textAlign: 'center' }]}>Cant.</Text>
              <Text style={[styles.cr_th, { width: '15%', textAlign: 'right' }]}>Precio</Text>
              <Text style={[styles.cr_th, { width: '10%', textAlign: 'right' }]}>ITBMS</Text>
              <Text style={[styles.cr_th, { width: '13%', textAlign: 'right' }]}>Total</Text>
            </View>
            {invoice.items.map((item: any, index: number) => (
              <View key={item.id} style={[styles.cr_tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }]}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={[styles.cr_td, styles.fontBold, { color: '#18181b' }]}>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={[styles.cr_td, { width: '12%', textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.cr_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.cr_td, { width: '10%', textAlign: 'right' }]}>{formatCurrency(item.applyTax ? item.taxAmount || 0 : 0)}</Text>
                <Text style={[styles.cr_td, styles.fontBold, { width: '13%', textAlign: 'right', color: primaryColor }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}

            {/* Totals */}
            <View style={styles.cr_totalsSection}>
              <View style={[styles.cr_totalsBox, { backgroundColor: '#f8f8f8' }]}>
                <View style={styles.cr_totalRow}>
                  <Text style={styles.cr_totalText}>Subtotal</Text>
                  <Text style={styles.cr_totalBold}>{formatCurrency(invoice.subtotal)}</Text>
                </View>
                <View style={styles.cr_totalRow}>
                  <Text style={styles.cr_totalText}>ITBMS (7%)</Text>
                  <Text style={styles.cr_totalBold}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>
                <View style={[styles.cr_totalFinal, { borderTopColor: primaryColor }]}>
                  <Text style={[styles.cr_totalFinalText, { color: primaryColor }]}>TOTAL USD</Text>
                  <Text style={[styles.cr_totalFinalText, { color: primaryColor }]}>{formatCurrency(invoice.total)}</Text>
                </View>
              </View>
            </View>

            {/* Notes & Payments */}
            <View style={styles.cr_notesSection}>
              {invoice.notes && (
                <View style={[styles.cr_notesBox, { backgroundColor: '#f8f8f8' }]}>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>NOTAS</Text>
                  <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
                </View>
              )}
              {company.paymentDetails && (
                <View style={[styles.cr_notesBox, { backgroundColor: '#f8f8f8' }]}>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>PAGO</Text>
                  {renderPaymentOptions(false)}
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, backgroundColor: primaryColor, opacity: 0.9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 8, color: '#ffffff', letterSpacing: 1 }}>{company.name} • Gracias por su preferencia</Text>
          </View>
        </Page>
      </Document>
    )
  }

  function renderExecutive() {
    return (
      <Document>
        <Page size="A4" orientation={orientation} style={[styles.page, styles.ex_page]}>
          {/* Header */}
          <View style={styles.ex_header}>
            <View style={styles.ex_logoSection}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.ex_logo} />
              ) : (
                <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: primaryColor, letterSpacing: -0.5, marginBottom: 10 }}>{company.name}</Text>
              )}
              <Text style={styles.ex_companyName}>{company.name}</Text>
              {company.ruc && <Text style={styles.ex_companyText}>RUC: {company.ruc}{company.dv ? ` DV: ${company.dv}` : ''}</Text>}
              {company.phone && <Text style={styles.ex_companyText}>Tel: {company.phone}</Text>}
              {company.address && <Text style={styles.ex_companyText}>{company.address}</Text>}
            </View>
            <View style={styles.ex_invoiceSection}>
              <Text style={styles.ex_invoiceLabel}>Factura</Text>
              <Text style={[styles.ex_invoiceNumber, { color: primaryColor }]}>FAC-{invNum}</Text>
              <View style={styles.ex_dateBox}>
                <View style={styles.ex_dateItem}>
                  <Text style={styles.ex_dateLabel}>Emisión</Text>
                  <Text style={styles.ex_dateValue}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
                </View>
                {invoice.dueDate && (
                  <View style={styles.ex_dateItem}>
                    <Text style={styles.ex_dateLabel}>Vencimiento</Text>
                    <Text style={styles.ex_dateValue}>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={[styles.ex_divider, { backgroundColor: primaryColor }]} />

          {/* Info Grid */}
          <View style={styles.ex_infoGrid}>
            <View style={styles.ex_infoBox}>
              <Text style={styles.ex_label}>Facturado A</Text>
              <Text style={styles.ex_valueBold}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={styles.ex_valueText}>{invoice.client.email}</Text>}
              {invoice.client.phone && <Text style={styles.ex_valueText}>{invoice.client.phone}</Text>}
              {invoice.client.direccion && <Text style={styles.ex_valueText}>{invoice.client.direccion}</Text>}
            </View>
            <View style={[styles.ex_infoBox, { alignItems: 'flex-end' }]}>
              <View style={{ backgroundColor: '#f8f8f8', padding: 12, borderRadius: 6, minWidth: 180 }}>
                <Text style={{ fontSize: 8, color: primaryColor, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Resumen</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 9, color: '#71717a' }}>Subtotal:</Text>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{formatCurrency(invoice.subtotal)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 9, color: '#71717a' }}>ITBMS:</Text>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#e4e4e7' }}>
                  <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Total:</Text>
                  <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: primaryColor }}>{formatCurrency(invoice.total)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={[styles.ex_tableHeader, { borderBottomColor: primaryColor }]}>
            <Text style={[styles.ex_th, { width: '50%', color: primaryColor }]}>Descripción</Text>
            <Text style={[styles.ex_th, { width: '12%', textAlign: 'center', color: primaryColor }]}>Cant.</Text>
            <Text style={[styles.ex_th, { width: '15%', textAlign: 'right', color: primaryColor }]}>P. Unit.</Text>
            <Text style={[styles.ex_th, { width: '10%', textAlign: 'right', color: primaryColor }]}>ITBMS</Text>
            <Text style={[styles.ex_th, { width: '13%', textAlign: 'right', color: primaryColor }]}>Total</Text>
          </View>
          {invoice.items.map((item: any) => (
            <View key={item.id} style={styles.ex_tableRow}>
              <View style={{ width: '50%', paddingRight: 10 }}>
                <Text style={[styles.ex_td, styles.fontBold, { color: '#18181b' }]}>{item.description}</Text>
                {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 3 }}>Ref: {item.service.name}</Text>}
              </View>
              <Text style={[styles.ex_td, { width: '12%', textAlign: 'center' }]}>{item.quantity}</Text>
              <Text style={[styles.ex_td, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.ex_td, { width: '10%', textAlign: 'right' }]}>{formatCurrency(item.applyTax ? item.taxAmount || 0 : 0)}</Text>
              <Text style={[styles.ex_td, styles.fontBold, { width: '13%', textAlign: 'right', color: '#18181b' }]}>{formatCurrency(item.lineTotal || item.total)}</Text>
            </View>
          ))}

          {/* Notes & Payments */}
          <View style={styles.ex_notesSection}>
            {invoice.notes && (
              <View style={[styles.ex_notesBox, { borderLeftColor: primaryColor }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>Notas / Términos</Text>
                <Text style={{ fontSize: 9, color: '#3f3f46', lineHeight: 1.5 }}>{invoice.notes}</Text>
              </View>
            )}
            {company.paymentDetails && (
              <View style={[styles.ex_notesBox, { borderLeftColor: primaryColor }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: primaryColor, marginBottom: 6 }}>Opciones de Pago</Text>
                {renderPaymentOptions(false)}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#a1a1aa', letterSpacing: 1 }}>{company.name} • Excelencia en cada detalle</Text>
          </View>
        </Page>
      </Document>
    )
  }
}
