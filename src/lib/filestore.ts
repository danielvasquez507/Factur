import sharp from 'sharp'
import crypto from 'crypto'

export async function saveCompanyLogo(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  // Optimizar, redimensionar y convertir a WebP
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 400, height: 400, fit: 'inside' })
    .webp({ quality: 80 })
    .toBuffer()

  // Retornar como Data URL (base64)
  const base64 = optimizedBuffer.toString('base64')
  return `data:image/webp;base64,${base64}`
}
