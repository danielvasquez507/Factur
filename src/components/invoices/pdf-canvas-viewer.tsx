"use client"

import { useEffect, useState, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { usePDF } from "@react-pdf/renderer"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

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

  if (!blob || !objectUrl || instance.loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-transparent text-zinc-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse">Creando factura...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative">
      <style>{`
        .react-pdf__Document {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
        }
        .react-pdf__Page {
          width: 100% !important;
          max-width: 1000px !important;
          height: auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
          background: transparent !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
        .react-pdf__Page__canvas {
          width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
        }
      `}</style>
      
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={true}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl">
              <button 
                onClick={() => zoomIn()} 
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Acercar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={() => zoomOut()} 
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Alejar"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button 
                onClick={() => resetTransform()} 
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Ajustar a pantalla"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
            <TransformComponent wrapperClass="!w-full !h-auto min-h-full" contentClass="!w-full !h-auto min-h-full flex items-start justify-center">
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
                    className="w-full h-full flex justify-center items-center drop-shadow-2xl [&_.react-pdf__Page__canvas]:!max-w-full [&_.react-pdf__Page__canvas]:!max-h-full [&_.react-pdf__Page__canvas]:!w-auto [&_.react-pdf__Page__canvas]:!h-auto [&_.react-pdf__Page__canvas]:object-contain"
                  />
                ))}
              </Document>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
