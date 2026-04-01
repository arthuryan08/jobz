interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
}

export function Sparkline({ data, width = 200, height = 50, className }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const padY = 4
  const usableH = height - padY * 2

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: padY + usableH - ((v - min) / range) * usableH,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-gradient)" />
      <path d={linePath} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Current value dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="white" />
    </svg>
  )
}
