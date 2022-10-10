import Show from "components/Show"
import { useContext } from "react"
import { PromptGeneratorContext, Steps } from "src/contexts/PromptGeneratorContext"

const Subject = () => {
  const { step, setStep, subject, setSubject } = useContext(PromptGeneratorContext)
  const placeholders = [
    'A volcanic island covered in fire',
    'A city in the clouds',
    'A mage creating a portal to another world',
    'A dragon flying over a castle',
    'A knight fighting a dragon',
    'An orc raiding a village',
    'An elf standing near a campfire',
    'A mysterious forest',
    'A magical Goat'
  ]

  const placeholder = 'Example: ' + placeholders[Math.floor(Math.random() * placeholders.length)]

  const validSubject = subject.length > 3

  const handleNext = () => {
    validSubject && setStep(Steps.Style)
  }


  return (
    <Show when={step === Steps.Subject}>
      <>
      <input type="text" name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="input input-bordered w-full mt-4" placeholder={placeholder} />
      <div className="flex justify-end mt-4 gap-4">
        <button className="btn btn-accent btn-bordered" type="button" disabled={!validSubject} onClick={handleNext}>Next</button>
      </div>
      </>
    </Show>
  )
}

export default Subject