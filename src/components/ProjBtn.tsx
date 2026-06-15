import type { ReactNode } from 'react'

interface ProjBtnProps {
  href?: string
  optional?: boolean // when true, render nothing if href is missing/empty.
  className?: string
  children: ReactNode
}

export default function ProjBtn({ href, optional, className, children }: ProjBtnProps) {
  if (optional && !href) return null
  return (
    <a
      className={`proj-btn${className ? ` ${className}` : ''}`}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </a>
  )
}
