import Show from "components/Show"
import { useContext, useEffect, useState } from "react"
import { PromptGeneratorContext, Steps } from "src/contexts/PromptGeneratorContext"

type ReviewProps = {
  onUse: (field: string, value: any) => void
  onSubmit: () => void
}

const Review = ({ onUse: handleSetPrompt, onSubmit: handleSubmit }: ReviewProps) => {
  const { step, setStep, subject, styles, mediums, concepts } = useContext(PromptGeneratorContext)
  const result = `${subject} ${mediums.join(', ')} ${concepts.join(', ')} by ${styles.join(', ')}`
  const [value, setValue] = useState<string>(result)

  const handleNext = () => {
    handleSetPrompt('prompt', value)
    if (window) {
      window.location.hash = '#'
    }
    setStep(Steps.Subject)
    handleSubmit()
  }

  useEffect(() => {
    setValue(result)
  }, [step])

  return (
    <Show when={step === Steps.Review}>
      <>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="my-4 input input-bordered" />

        <div className="flex justify-between mt-4 gap-4">
          <button className="btn btn-outline opacity-60 hover:opacity-100" type="button" onClick={() => setStep(Steps.Subject)}>Previous</button>
          <button onClick={handleNext} className="btn btn-success">Let's Go</button>
        </div>
      </>
    </Show>
  )
}

export default Review