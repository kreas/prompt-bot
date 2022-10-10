import { PromptGeneratorProvider } from 'src/contexts/PromptGeneratorContext'
import Concepts from './Concepts'
import Mediums from './Mediums'
import Menu from './Menu'
import Review from './Review'
import Style from './Style'
import Subject from './Subject'

type PromptGeneratorProps = {
  onUse: (field: string, value: any) => void
  onSubmit: () => void
}

const PromptGenerator= ({ onUse, onSubmit }: PromptGeneratorProps) => {
  return (
    <PromptGeneratorProvider>
      <>
        <div id="generator-modal" className="modal px-8" style={{ zIndex: 20_000 }}>
          <a href="#" className="fixed top-0 left-0 w-screen h-screen" onClick={() => console.log('clicked')}></a>
          <div className="modal-box w-11/12 max-w-5xl pb-8">
            <Menu />
            <section className="flex flex-col">
              <Subject />
              <Style />
              <Mediums />
              <Concepts />
              <Review onUse={onUse} onSubmit={onSubmit} />
            </section>
          </div>
        </div>
      </>
    </PromptGeneratorProvider>
  )
}

export default PromptGenerator