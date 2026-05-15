"use client"

import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { useEffect, useRef } from "react"

interface Row {
  y: number
  x: number
  direction: 1 | -1
}

const FONT_SIZE = 32
const GAP = 8
const SPEED = 0.6
const OPACITY = 0.08

function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let rows: Row[] = []

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const rowHeight = FONT_SIZE + GAP
      const rowCount = Math.ceil(canvas.height / rowHeight) + 1

      rows = Array.from({ length: rowCount }, (_, i) => ({
        y: i * rowHeight + FONT_SIZE,
        x: 0,
        direction: (i % 2 === 0 ? 1 : -1) as 1 | -1,
      }))
    }

    init()
    window.addEventListener("resize", init)

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const style = getComputedStyle(document.documentElement)
      const fg = style.getPropertyValue("--foreground").trim() || "0 0% 9%"

      ctx.font = `900 ${FONT_SIZE}px sans-serif`
      ctx.textBaseline = "middle"

      const textWidth = ctx.measureText("404").width
      const spacing = textWidth + GAP

      rows.forEach((row) => {
        row.x += SPEED * row.direction

        const offset = ((row.x % spacing) + spacing) % spacing
        const startX = -spacing + offset

        for (let x = startX; x < canvas.width + spacing; x += spacing) {
          ctx.globalAlpha = OPACITY
          ctx.fillStyle = `hsl(${fg})`
          ctx.fillText("404", x, row.y)
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}



export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 overflow-hidden">
      <BackgroundCanvas />

      <div className="relative z-10 text-center">
        {/* 404 Number */}
        <h1 className="text-[150px] font-bold leading-none tracking-tighter text-foreground sm:text-[200px]">
          404
        </h1>

        {/* Message */}
        <div className="mt-4 space-y-2">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        {/* Instagram Link */}
        <div className="mt-8">
          <Button asChild size="icon" className="rounded-full">
            <a href="https://instagram.com/siagiansr_" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-muted-foreground">
          siagiansr.me
        </p>
      </div>
    </main>
  )
}
