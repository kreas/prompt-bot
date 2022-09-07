import { Field } from "formik"
import FormField from "./FormField"

interface AdvanceControlsProps {
  values: Record<string, string | number>
}

const AdvanceControls: React.FC<AdvanceControlsProps> = ({ values }) => {
  return (
    <div className="form-control">
      <FormField label="Width" value={`${values.width}px`} hint="Width of your image.">
        <Field name="width" type="range" min="448" max="768" step="64" className="range range-sm" />
      </FormField>

      <FormField label="Height" value={`${values.height}px`} hint="Height of your image.">
        <Field name="height" type="range" min="448" max="768" step="64" className="range range-sm" />
      </FormField>

      <FormField label="Steps" value={values.steps} hint="How many steps to spend generating your image.">
        <Field name="steps" type="range" min="30" max="75" step="1" className="range range-sm" />
      </FormField>

      <FormField
        label="Seed"
        value={values.seed}
        hint="The seed used to generate your image. Enable to manually set a seed."
        badge={false}
      >
        <Field name="seed" type="number" className="input w-full bg-neutral" />
      </FormField>
    </div>
  )
}

export default AdvanceControls
