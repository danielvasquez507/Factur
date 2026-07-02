import sharp from 'sharp'
import { join } from 'path'
import { mkdir } from 'fs/promises'
import crypto from 'crypto'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'logos')

export async function saveCompanyLogo(file: File): Promise<string> {
  // Asegurarnos de que el directorio existe
  await mkdir(UPLOAD_DIR, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Nombre único para prevenir colisiones
  const filename = `${crypto.randomUUID()}.webp`
  const filepath = join(UPLOAD_DIR, filename)

  // Optimizar, redimensionar y convertir a WebP
  await sharp(buffer)
    .resize({ width: 400, height: 400, fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(filepath)

  // Retornar la ruta relativa servida por Next.js
  return `/uploads/logos/${filename}`
}
