import Link from "next/link"

type ControlLinkType = {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  tooltip?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export const ControlLink: React.FC<ControlLinkType> = ({ children, onClick, href, tooltip, target='_self' }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!onClick) return
    e.preventDefault()
    onClick()
  }

  return (
    <div className="tooltip tooltip-left" data-tip={tooltip}>
      <Link href={href || '#'} onClick={handleClick}>
        <a target={target} className="flex justify-center p-3 rounded opacity-50 hover:opacity-100" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{children}</a>
      </Link>
    </div>
  )
}
