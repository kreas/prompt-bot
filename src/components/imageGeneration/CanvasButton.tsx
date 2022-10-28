type ControlButtonType = {
  children: React.ReactNode
  onClick: () => void
  tooltip?: string
  tooltipDirection?: 'left' | 'right' | 'top' | 'bottom'
}

export const ControlButton: React.FC<ControlButtonType> = ({ children, onClick, tooltip, tooltipDirection = 'left' }) => {
  return (
    <div className={`tooltip tooltip-${tooltipDirection}`} data-tip={tooltip}>
      <button type="button" onClick={onClick} className="flex p-4 rounded opacity-50 hover:opacity-100" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
        {children}
      </button>
    </div>
  )
}
