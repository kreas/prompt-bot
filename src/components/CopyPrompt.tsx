import { useState } from 'react'
import Image from 'next/image'

interface CopyPromptProps {
  prompt: string
  className: string
}

const CopyPrompt: React.FC<CopyPromptProps> = ({ prompt, className = '' }) => {
  const [copied, setCopied] = useState(false)

  if (!prompt) return null

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <button
      className={`${copied && 'tooltip tooltip-open'} text-center tooltip-top tooltip-info flex gap-2 capitalize ${className}`}
      data-tip="copied"
      onClick={() => copyPrompt(prompt)}
    >
      <Image src="/icons/clipboard.svg" alt="copy" width={14} height={14} />
      Copy Prompt
    </button>
  )
}

export default CopyPrompt
