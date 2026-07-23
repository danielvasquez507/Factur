import sharp from 'sharp'
import crypto from 'crypto'

export async function saveCompanyLogo(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  // Optimizar, redimensionar y convertir a PNG 24/32 bits puros (react-pdf no soporta WebP ni procesa bien PNGs con paletas/quality)
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 400, height: 400, fit: 'inside' })
    .png()
    .toBuffer()

  // Retornar como Data URL (base64)
  const base64 = optimizedBuffer.toString('base64')
  return `data:image/png;base64,${base64}`
}
