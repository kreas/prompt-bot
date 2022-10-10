import { CanvasContext } from "src/contexts/CanvasContext"
import { useContext } from "react"
import Lottie from "lottie-react"
import workingAnimation from '../../animations/working-3.json'

const WorkingIndicator: React.FC = () => {
  const { isWorking } = useContext(CanvasContext)

  if (!isWorking) return <></>

  return (
    <div className="flex justify-center align-middle w-full h-full z-100 absolute">
      <Lottie animationData={workingAnimation} className="w-96 h-96 m-auto" />
    </div>
  )
}

export default WorkingIndicator
