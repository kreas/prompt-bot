import { PromptGeneratorContext, Steps } from "src/contexts/PromptGeneratorContext"
import { useContext } from "react"
import Show from "components/Show"

const Concepts = () => {
  const { step, setStep, concepts, setConcepts, data } = useContext(PromptGeneratorContext)
  const conceptsSet = new Set(concepts)

  return (
    <Show when={step === Steps.Concepts}>
      <>
        <div className="flex mt-4 flex-wrap">
          {data.movements.map((concept: string) => (
            <button
              className={`btn btn-primary m-1 btn-sm capitalize ${conceptsSet.has(concept) ? 'btn-info' : 'btn-outline'}`}
              type="button"
              key={concept}
              onClick={() => {
                conceptsSet.has(concept) ? conceptsSet.delete(concept) : conceptsSet.add(concept)
                setConcepts(Array.from(conceptsSet))
              }}
            >{concept}</button>
          ))}
        </div>

        <div className="flex justify-between mt-4 gap-4">
          <button className="btn btn-outline opacity-60 hover:opacity-100" type="button" onClick={() => setStep(Steps.Medium)}>Previous</button>
          <button className="btn btn-accent btn-bordered" type="button" onClick={() => setStep(Steps.Review)}>Next</button>
        </div>
      </>
    </Show>
  )
}

export default Concepts