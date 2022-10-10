import { useContext } from "react"
import { PromptGeneratorContext, Steps } from "src/contexts/PromptGeneratorContext"

const Menu = () => {
  const { step, setStep } = useContext(PromptGeneratorContext)

  const Tab = ({ label, targetStep }: { label: string, targetStep: Steps }) => {
    return (
      <li className={`tab ${step === targetStep && 'tab-active'}`}>
        <a onClick={() => { setStep(targetStep) }}>{label}</a>
      </li>
    )
  }

  return (
    <ul className="tabs tabs-boxed text-sm">
      <Tab label="Subject" targetStep={Steps.Subject} />
      <Tab label="Styles" targetStep={Steps.Style} />
      <Tab label="Mediums" targetStep={Steps.Medium} />
      <Tab label="Concepts" targetStep={Steps.Concepts} />
      <Tab label="Review" targetStep={Steps.Review} />
    </ul>
  )
}

export default Menu