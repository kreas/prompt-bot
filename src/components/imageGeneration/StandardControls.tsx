import { Field } from "formik"
import FormField from "./FormField"

interface StandardControlsProps {
  values: Record<string, string | number | undefined>
}

const StandardControls: React.FC<StandardControlsProps> = () => {
  return (
    <div className="form-control">
      <FormField label="Aspect Ratio" hint="Choose an aspect ratio for your image." value={false} badge={false}>
        <div className="btn-group flex">
          <Field name="aspectRation" type="radio" data-title="1:1" className="btn flex-1" value="1:1" />
          <Field name="aspectRation" type="radio" data-title="2:3" className="btn flex-1" value="2:3" />
          <Field name="aspectRation" type="radio" data-title="3:2" className="btn flex-1" value="3:2" />
          <Field name="aspectRation" type="radio" data-title="16:9" className="btn flex-1" value="16:9" />
        </div>
      </FormField>

      <FormField label="Quality" hint="Choose an aspect ratio for your image." value={false} badge={false}>
        <div className="btn-group flex">
          <Field name="quality" type="radio" data-title="low" className="btn flex-1" value="low" />
          <Field name="quality" type="radio" data-title="mid" className="btn flex-1" value="mid" />
          <Field name="quality" type="radio" data-title="high" className="btn flex-1" value="high" />
        </div>
      </FormField>
    </div>
  )
}

export default StandardControls
