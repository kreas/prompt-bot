import { Field } from 'formik'
import FormField from './FormField'
import Image from 'next/image'
import { useContext } from 'react'
import { CanvasContext } from 'contexts/CanvasContext'
interface StandardControlsProps {
  values: Record<string, string | number | undefined>
}

const StandardControls: React.FC<StandardControlsProps> = ({ values }) => {
  const {seedLocked, setSeedLocked } = useContext(CanvasContext)

  return (
    <section className="hidden md:block" style={{ width: 275 }}>
      <div className="form-control">
        <FormField label="Aspect Ratio" hint="Choose an aspect ratio for your image." value={false} badge={false}>
          <div className="btn-group flex">
            <Field name="aspectRatio" type="radio" data-title="1:1" className="btn flex-1" value="1:1" />
            <Field name="aspectRatio" type="radio" data-title="2:3" className="btn flex-1" value="2:3" />
            <Field name="aspectRatio" type="radio" data-title="3:2" className="btn flex-1" value="3:2" />
            <Field name="aspectRatio" type="radio" data-title="16:9" className="btn flex-1" value="16:9" />
          </div>
        </FormField>

        <FormField
          label="Steps"
          hint="How many steps to spend generating (diffusing) your image."
          value={false}
          badge={false}
        >
          <div className="btn-group flex">
            <Field name="quality" type="radio" data-title="low" className="btn flex-1" value="low" />
            <Field name="quality" type="radio" data-title="mid" className="btn flex-1" value="mid" />
            <Field name="quality" type="radio" data-title="high" className="btn flex-1" value="high" />
            <Field name="quality" type="radio" data-title="max" className="btn flex-1" value="max" />
          </div>
        </FormField>

        <FormField
          label="Seed"
          value={values.seed}
          hint="The seed used to generate your image. Enable to manually set a seed."
          badge={false}
        >
          <div className="input-group">
            <Field name="seed" type="number" className="input w-full bg-neutral" disabled={seedLocked} />
            <button className="btn btn-square btn-outline btn-primary" type='button' onClick={() => setSeedLocked(!seedLocked)}>
              {seedLocked ? (
                <Image unoptimized src="/icons/lock.svg" width={16} height={16} alt="Locked" />
              ) : (
                <Image unoptimized src="/icons/unlock.svg" width={16} height={16} alt="Unlocked" />
              )}
            </button>
          </div>
        </FormField>
      </div>
    </section>
  )
}

export default StandardControls
