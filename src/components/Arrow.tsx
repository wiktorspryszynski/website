type Direction = 'right' | 'left' | 'up' | 'down' | 'up-right'

const ROTATION: Record<Direction, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
  'up-right': -45,
}

interface ArrowProps {
  direction?: Direction
  size?: number
  className?: string
}

export default function Arrow({ direction = 'up-right', size = 16, className }: ArrowProps) {
  const deg = ROTATION[direction]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={deg !== 0 ? { transform: `rotate(${deg}deg)` } : undefined}
      className={className}
      aria-hidden
    >
      <line x1="2" y1="8" x2="12" y2="8" />
      <polyline points="8,3 13,8 8,13" />
    </svg>
  )
}
