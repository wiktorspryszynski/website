import type { ReactNode } from 'react'

interface ProjBtnProps {
  href?: string
  optional?: boolean // when true, render nothing if href is missing/empty.
  blur?: boolean // when true, give the button a frosted-glass backdrop.
  className?: string
  children: ReactNode
}

export default function ProjBtn({ href, optional, blur, className, children }: ProjBtnProps) {
  if (optional && !href) return null
  const classes = ['proj-btn', blur && 'proj-btn-blur', className].filter(Boolean).join(' ')
  return (
    <a
      className={classes}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </a>
  )
}
