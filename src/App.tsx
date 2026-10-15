import { useEffect, useRef, useState } from 'react'

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("no canvas")
      return
    };

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.log("no ctx")
      return
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    ctx.translate(centerX, centerY)
    ctx.scale(5,5)
    ctx.translate(-centerX,-centerY)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // mat
    ctx.fillStyle = "#23262b"
    ctx.fillRect(
      (canvas.width - 144) / 2,
      (canvas.height - 144) / 2,
      144,
      144
  )

  // tile
  ctx.strokeStyle = "#2c3038"
  ctx.lineWidth = 0.6

  for (let i = -2; i <=2; i++) {
    const offset = i*24;
    ctx.beginPath()
    ctx.moveTo(centerX+offset, centerY-72)
    ctx.lineTo(centerX+ offset,centerY+72)
    ctx.moveTo(centerX-72, centerY+offset)
    ctx.lineTo(centerX+72, centerY+offset)
    ctx.stroke()
  }

  // wall
  ctx.strokeStyle = "#fff"
  ctx.lineWidth = 1

  ctx.strokeRect(
    centerX-72,
    centerY-72,
    144,
    144
  )
})
 
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <canvas ref={canvasRef} id="field"></canvas>
    </div>
  )
}

export default App
