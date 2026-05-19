"use client"
import React, { useEffect, useRef } from "react"
import gsap from "gsap"

type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: number }

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas = canvasEl as HTMLCanvasElement
    const ctx = canvas.getContext("2d")
    let raf = 0
    let w = (canvas.width = canvas.clientWidth)
    let h = (canvas.height = canvas.clientHeight)

    // Initialize particles once
    if (!particlesRef.current.length) {
      const temp: Particle[] = []
      for (let i = 0; i < 40; i++) {
        temp.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 2 + Math.random() * 3,
          hue: 180 + Math.random() * 200,
        })
      }
      particlesRef.current = temp
    }

    function onResize() {
      w = canvas.width = canvas.clientWidth
      h = canvas.height = canvas.clientHeight
    }

    window.addEventListener("resize", onResize)

    function render() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
        g.addColorStop(0, `hsla(${p.hue},90%,60%,0.18)`)
        g.addColorStop(1, `hsla(${p.hue},80%,40%,0)`)
        ctx.fillStyle = g
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(render)
    }

    // subtle GSAP breathing for velocities
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(particlesRef.current, { duration: 6, stagger: 0.05, vx: () => (Math.random() - 0.5) * 0.6, vy: () => (Math.random() - 0.5) * 0.6 })

    render()

    return () => {
      cancelAnimationFrame(raf)
      tl.kill()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-20 opacity-55 pointer-events-none mix-blend-screen" />
}

