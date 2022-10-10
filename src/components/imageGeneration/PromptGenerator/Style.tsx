import Show from "components/Show"
import { useContext } from "react"
import { PromptGeneratorContext, Steps } from "src/contexts/PromptGeneratorContext"
import data from 'src/data/output.json'

const Style = () => {
  const { step, styles, setStyles, setStep } = useContext(PromptGeneratorContext)
  const stylesSet = new Set(styles)

  return (
    <Show when={step === Steps.Style}>
      <>
        <div className="flex mt-4 flex-wrap">
          {data.styles.map((style) => (
            <button
              className={`btn btn-primary m-1 btn-sm capitalize ${stylesSet.has(style) ? 'btn-info' : 'btn-outline'}`}
              type="button"
              key={style}
              onClick={() => {
                stylesSet.has(style) ? stylesSet.delete(style) : stylesSet.add(style)
                setStyles(Array.from(stylesSet))
              }}
            >
              {style}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 gap-4">
          <button className="btn btn-outline opacity-60 hover:opacity-100" type="button" onClick={() => setStep(Steps.Subject)}>Previous</button>
          <button className="btn btn-accent btn-bordered" type="button" onClick={() => setStep(Steps.Medium)}>Next</button>
        </div>
      </>
    </Show>
  )
}

export default Style
