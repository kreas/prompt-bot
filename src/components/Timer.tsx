import { useEffect, useState } from "react"

interface TimerProps {
    show: boolean
}

const Timer: React.FC<TimerProps> = ({ show }) => {
  const [timer, setTimer] = useState(0.0)

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        setTimer(timer + 0.1)
      }, 100)

      return () => clearInterval(interval)
    }

    setTimer(0.0) // reset timer
  }, [show, timer])

  if (!show) return null

  return (
    <div
      className="flex justify-center h-full"
      style={{ textShadow: '3px 2px 7px rgba(0,0,0,0.6)', alignItems: 'center' }}
    >
      <div className="font-mono text-4xl">
        <span>{timer.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default Timer
