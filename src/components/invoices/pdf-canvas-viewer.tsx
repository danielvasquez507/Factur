"use client"

import { useEffect, useState, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2 } from "lucide-react"
import { usePDF } from "@react-pdf/renderer"

// Configure the worker using unpkg CDN (Fallback for Next.js Turbopack)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PDFCanvasViewer({ document }: { document: React.ReactElement }) {
  const [instance] = usePDF({ document })
  const blob = instance.blob

  const [numPages, setNumPages] = useState<number>(1)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      setObjectUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setObjectUrl(null)
    }
  }, [blob])

  if (!blob || !objectUrl) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-white text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center overflow-hidden relative">
      <style>{`
        .react-pdf__Document {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .react-pdf__Page {
          max-width: 100% !important;
          max-height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          background: transparent !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
        .react-pdf__Page__canvas {
          max-width: 100% !important;
          max-height: 100% !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
        }
      `}</style>
      
      <Document
        file={objectUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        }
        error={
          <div className="w-full h-full flex items-center justify-center text-red-500">
            Error al renderizar el documento.
          </div>
        }
        className="w-full h-full flex flex-col items-center justify-center bg-transparent"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={1.5} // High-res rendering
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  )
}
