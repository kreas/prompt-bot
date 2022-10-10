import data from 'src/data/output.json'

import { createContext, ReactElement, useEffect, useState } from "react"

export enum Steps {
  Subject,
  Style,
  Medium,
  Concepts,
  Review,
}

type PromptGenerator = {
  step: Steps
  setStep: (step: Steps) => void
  subject: string
  setSubject: (subject: string) => void
  styles: string[]
  setStyles: (style: string[]) => void
  mediums: string
  setMediums: (medium: string[]) => void
  concepts: string[]
  setConcepts: (concepts: string[]) => void
  data: typeof data
}

export const PromptGeneratorContext = createContext<PromptGenerator | Record<any, any>>({})

export const PromptGeneratorProvider = ({ children }: { children: ReactElement }) => {
  const [step, setStep] = useState<Steps>(Steps.Subject)
  const [subject, setSubject] = useState<string>('')
  const [styles, setStyles] = useState<string[]>([])
  const [mediums, setMediums] = useState<string[]>([])
  const [concepts, setConcepts] = useState<string[]>([])

  return (
    <PromptGeneratorContext.Provider value={{ step, setStep, subject, setSubject, styles, setStyles, mediums, setMediums, concepts, setConcepts, data }}>
      {children}
    </PromptGeneratorContext.Provider>
  )
}
