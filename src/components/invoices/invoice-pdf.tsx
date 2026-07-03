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
  c_logo: { width: 120, height: 60, objectFit: 'contain' },
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
  m_headerBanner: { height: 120, paddingHorizontal: 40, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between' },
  m_logo: { width: 140, height: 60, objectFit: 'contain' },
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
})

const resolveImageUrl = (url: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}${url}`;
  }
  return url;
}

export function InvoicePDF({ invoice, company }: { invoice: any, company: any }) {
  const formatCurrency = (val: number | string) => `$${Number(val).toFixed(2)}`
  
  const template = company.invoiceTemplate || 'modern'
  const invNum = String(invoice.invoiceNumber).padStart(6, '0')
  const logoUrl = resolveImageUrl(company.logoUrl)
  
  const colorMap: Record<string, string> = {
    blue: '#2563eb',
    emerald: '#059669',
    slate: '#475569',
    red: '#dc2626',
    orange: '#ea580c',
    purple: '#9333ea',
    pink: '#db2777',
    amber: '#d97706',
    rose: '#e11d48'
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
        {paymentOpts.yappy?.enabled && <Text style={{ fontSize: 9, color: '#3f3f46' }}>• Yappy: {paymentOpts.yappy.phone}</Text>}
        {paymentOpts.ach?.enabled && (
          <View style={{ marginTop: 4 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#18181b' }}>• Transferencia ACH:</Text>
            <View style={{ marginLeft: 10, marginTop: 2 }}>
              <Text style={{ fontSize: 9, color: '#3f3f46' }}>Banco: {paymentOpts.ach.bank}</Text>
              <Text style={{ fontSize: 9, color: '#3f3f46' }}>Tipo: {paymentOpts.ach.accountType}</Text>
              <Text style={{ fontSize: 9, color: '#3f3f46' }}>Cuenta: {paymentOpts.ach.accountNumber}</Text>
              <Text style={{ fontSize: 9, color: '#3f3f46' }}>A nombre de: {paymentOpts.ach.owner}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
  
  if (template === 'classic') {
    return (
      <Document>
        <Page size="A4" style={[styles.page, styles.c_page]}>
          {/* Header */}
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
            </View>
          </View>

          {/* Info Section */}
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

          {/* Table */}
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

          {/* Totals */}
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

          {/* Notes & Payments */}
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
          
          {/* Footer watermark/line */}
          <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#a1a1aa', letterSpacing: 1 }}>{company.name} • Gracias por su preferencia</Text>
          </View>
        </Page>
      </Document>
    )
  }

  // MODERN TEMPLATE
  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.m_page]}>
        {/* Color Banner */}
        <View style={[styles.m_headerBanner, { backgroundColor: primaryColor }]}>
          <View style={{ width: '60%' }}>
            {logoUrl ? (
              <Image src={logoUrl} style={[styles.m_logo, { filter: 'brightness(0) invert(1)' }]} /> // Attempt to invert if possible, otherwise just display
            ) : (
              <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: -1 }}>{company.name}</Text>
            )}
            {company.ruc && <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>RUC: {company.ruc} {company.dv && `DV: ${company.dv}`}</Text>}
          </View>
          <View style={{ width: '40%', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Factura N°</Text>
            <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>FAC-{invNum}</Text>
          </View>
        </View>

        {/* Content Section */}
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

        {/* Table */}
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

        {/* Totals */}
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

        {/* Notes & Payments */}
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

        {/* Footer */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, backgroundColor: primaryColor, opacity: 0.8 }} />
      </Page>
    </Document>
  )
}
