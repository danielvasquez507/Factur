import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { format } from 'date-fns'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#3f3f46',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    color: '#18181b',
    fontWeight: 'bold',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 5,
  },
  infoText: {
    marginTop: 3,
    fontSize: 9,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clientBox: {
    width: '45%',
  },
  companyBox: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 3,
  },
  table: {
    width: '100%',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  col1: { width: '50%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  totalsBox: {
    width: '40%',
    marginLeft: 'auto',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#e4e4e7',
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    paddingTop: 10,
  }
})

export function InvoicePDF({ invoice, company }: { invoice: any, company: any }) {
  const formatCurrency = (val: number | string) => `$${Number(val).toFixed(2)} USD`
  
  const template = company.invoiceTemplate || 'modern'
  
  // Mapeo de colores al HEX
  const colorMap: Record<string, string> = {
    blue: '#2563eb',
    emerald: '#059669',
    slate: '#334155'
  }
  const primaryColor = colorMap[company.invoiceColor] || '#18181b'
  
  if (template === 'classic') {
    return (
      <Document>
        <Page size="A4" style={{ padding: 50, fontFamily: 'Helvetica', fontSize: 10, color: '#3f3f46' }}>
          <View style={{ alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#d4d4d8', paddingBottom: 20 }}>
            {company.logoUrl ? (
              <Image src={company.logoUrl} style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 10 }} />
            ) : (
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#18181b', marginBottom: 10 }}>{company.name}</Text>
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: primaryColor, letterSpacing: 2 }}>FACTURA COMERCIAL</Text>
            {company.ruc && <Text style={{ fontSize: 10, marginTop: 5, color: '#71717a' }}>RUC: {company.ruc} {company.dv && `DV: ${company.dv}`}</Text>}
            <Text style={{ fontSize: 10, marginTop: 2, color: '#71717a' }}>N° INV-{String(invoice.invoiceNumber).padStart(6, '0')}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
            <View style={{ width: '50%' }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: primaryColor, marginBottom: 5 }}>FACTURADO A:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{invoice.client.name}</Text>
              <Text style={{ marginTop: 2 }}>{invoice.client.email}</Text>
              {invoice.client.phone && <Text style={{ marginTop: 2 }}>{invoice.client.phone}</Text>}
            </View>
            <View style={{ width: '40%', textAlign: 'right' }}>
              <Text style={{ fontWeight: 'bold' }}>FECHA DE EMISIÓN:</Text>
              <Text style={{ marginBottom: 10 }}>{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
              {invoice.dueDate && (
                <>
                  <Text style={{ fontWeight: 'bold' }}>VENCIMIENTO:</Text>
                  <Text>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>
                </>
              )}
            </View>
          </View>

          <View style={{ width: '100%', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: primaryColor, paddingBottom: 5, marginBottom: 5 }}>
              <Text style={{ width: '50%', fontWeight: 'bold', color: primaryColor }}>Descripción</Text>
              <Text style={{ width: '15%', fontWeight: 'bold', color: primaryColor, textAlign: 'center' }}>Cant.</Text>
              <Text style={{ width: '15%', fontWeight: 'bold', color: primaryColor, textAlign: 'right' }}>Precio Unit.</Text>
              <Text style={{ width: '20%', fontWeight: 'bold', color: primaryColor, textAlign: 'right' }}>Total</Text>
            </View>
            {invoice.items.map((item: any) => (
              <View key={item.id} style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' }}>
                <View style={{ width: '50%' }}>
                  <Text>{item.description}</Text>
                  {item.service && <Text style={{ fontSize: 8, color: '#71717a', marginTop: 2 }}>Ref: {item.service.name}</Text>}
                </View>
                <Text style={{ width: '15%', textAlign: 'center' }}>{item.quantity}</Text>
                <Text style={{ width: '15%', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={{ width: '20%', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.lineTotal || item.total)}</Text>
              </View>
            ))}
          </View>

          <View style={{ width: '40%', marginLeft: 'auto', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
              <Text>ITBMS (7%)</Text>
              <Text>{formatCurrency(invoice.taxAmount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 2, borderTopColor: primaryColor, marginTop: 4, fontWeight: 'bold', fontSize: 12, color: primaryColor }}>
              <Text>Total USD</Text>
              <Text>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>

          {invoice.notes && (
            <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: primaryColor, marginBottom: 5 }}>NOTAS / TÉRMINOS:</Text>
              <Text style={{ fontSize: 9 }}>{invoice.notes}</Text>
            </View>
          )}
        </Page>
      </Document>
    )
  }

  // MODERNA
  return (
    <Document>
      <Page size="A4" style={{ padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#3f3f46' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
          <View>
            {company.logoUrl ? (
              <Image src={company.logoUrl} style={{ width: 100, height: 60, objectFit: 'contain' }} />
            ) : (
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#18181b' }}>{company.name}</Text>
            )}
            {company.ruc && <Text style={{ fontSize: 10, marginTop: 5, color: '#71717a' }}>RUC: {company.ruc} {company.dv && `DV: ${company.dv}`}</Text>}
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: primaryColor, letterSpacing: -1 }}>INVOICE</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#18181b', marginTop: 5 }}>INV-{String(invoice.invoiceNumber).padStart(6, '0')}</Text>
            <Text style={{ marginTop: 5 }}>Fecha: {format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</Text>
            {invoice.dueDate && <Text style={{ marginTop: 2 }}>Vence: {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</Text>}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, backgroundColor: '#f4f4f5', padding: 15, borderRadius: 8 }}>
          <View style={{ width: '60%' }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#71717a', marginBottom: 5 }}>FACTURADO A:</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#18181b' }}>{invoice.client.name}</Text>
            {invoice.client.email && <Text style={{ marginTop: 2 }}>{invoice.client.email}</Text>}
            {invoice.client.phone && <Text style={{ marginTop: 2 }}>{invoice.client.phone}</Text>}
          </View>
        </View>

        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', backgroundColor: `${primaryColor}20`, padding: 10, borderRadius: 4 }}>
            <Text style={{ width: '50%', fontWeight: 'bold', color: '#18181b' }}>Descripción</Text>
            <Text style={{ width: '15%', fontWeight: 'bold', color: '#18181b', textAlign: 'center' }}>Cant.</Text>
            <Text style={{ width: '15%', fontWeight: 'bold', color: '#18181b', textAlign: 'right' }}>Precio Unit.</Text>
            <Text style={{ width: '20%', fontWeight: 'bold', color: '#18181b', textAlign: 'right' }}>Total</Text>
          </View>
          {invoice.items.map((item: any) => (
            <View key={item.id} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' }}>
              <View style={{ width: '50%' }}>
                <Text style={{ color: '#18181b' }}>{item.description}</Text>
                {item.service && <Text style={{ fontSize: 8, color: '#a1a1aa', marginTop: 2 }}>Ref: {item.service.name}</Text>}
              </View>
              <Text style={{ width: '15%', textAlign: 'center' }}>{item.quantity}</Text>
              <Text style={{ width: '15%', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={{ width: '20%', textAlign: 'right', fontWeight: 'bold', color: '#18181b' }}>{formatCurrency(item.lineTotal || item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
          <View style={{ width: '40%', backgroundColor: '#fafafa', padding: 15, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
              <Text style={{ color: '#71717a' }}>Subtotal</Text>
              <Text>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
              <Text style={{ color: '#71717a' }}>ITBMS (7%)</Text>
              <Text>{formatCurrency(invoice.taxAmount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e4e4e7', marginTop: 5 }}>
              <Text style={{ fontWeight: 'bold', color: primaryColor, fontSize: 12 }}>Total USD</Text>
              <Text style={{ fontWeight: 'bold', color: primaryColor, fontSize: 12 }}>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {invoice.notes && (
          <View style={{ marginTop: 30, backgroundColor: '#f4f4f5', padding: 15, borderRadius: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#71717a', marginBottom: 5 }}>NOTAS / TÉRMINOS:</Text>
            <Text style={{ fontSize: 9, color: '#3f3f46' }}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
