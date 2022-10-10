import { PromptGeneratorContext, Steps } from "src/contexts/PromptGeneratorContext"
import { useContext } from "react"
import data from 'src/data/output.json'
import Show from "components/Show"

const Style = () => {
  const { step, setStep, mediums, setMediums } = useContext(PromptGeneratorContext)
  const mediumsSet = new Set(mediums)

  return (
    <Show when={step === Steps.Medium}>
      <>
        <div className="flex mt-4 flex-wrap">
          {data.genres.map((medium) => (
            <button
              className={`btn btn-primary m-1 btn-sm capitalize ${mediumsSet.has(medium) ? 'btn-info' : 'btn-outline'}`}
              type="button"
              key={medium}
              onClick={() => {
                mediumsSet.has(medium) ? mediumsSet.delete(medium) : mediumsSet.add(medium)
                setMediums(Array.from(mediumsSet))
              }}
            >
              {medium}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 gap-4">
          <button className="btn btn-outline opacity-60 hover:opacity-100" type="button" onClick={() => setStep(Steps.Style)}>Previous</button>
          <button className="btn btn-accent btn-bordered" type="button" onClick={() => setStep(Steps.Concepts)}>Next</button>
        </div>
      </>
    </Show>

  )
}

export default Style