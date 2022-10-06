import { CanvasContext } from "contexts/CanvasContext";
import { Field } from "formik";
import { useContext } from "react";

type PromptBarProps = {
  submitForm: () => void
  className?: string
}

const PromptBar: React.FC<PromptBarProps> = ({ submitForm, className }) => {
  const { isWorking } = useContext(CanvasContext);

  return (
    <div className={`input-group ${className}`}>
      <Field name="prompt">
        {({ field }: { field: { onChange: () => void; value: string } }) => (
          <textarea
            name="prompt"
            id="prompt-text-area-small"
            className="input input-bordered w-full overflow-hidden leading-tight"
            onChange={field.onChange}
            defaultValue={field.value}
            style={{ resize: 'none', padding: '0.525rem' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submitForm()
              }
            }}
          />
        )}
      </Field>
      <button className="btn btn-accent btn-bordered" type="submit" disabled={isWorking}>
        go
      </button>
    </div>
  )
}

export default PromptBar
