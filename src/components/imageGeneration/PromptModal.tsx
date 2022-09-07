import { Field } from "formik";
import type { MouseEventHandler } from "react";

interface PromptModalProps {
  onSubmit: MouseEventHandler<HTMLAnchorElement>
}

const PromptModal: React.FC<PromptModalProps> = ({ onSubmit: handleSubmit }) => {
  return (
    <div className="modal" id="prompt-modal">
      <div className="modal-box w-11/12 max-w-5xl relative">
        <h3 className="font-bold text-lg">Prompt</h3>
        <Field name="prompt">
          {({ field }: { field: { onChange: () => void; value: string } }) => (
            <textarea
              name="prompt"
              id="prompt-text-area"
              className="textarea textarea-bordered w-full h-48 mt-2 leading-tight"
              onChange={field.onChange}
              defaultValue={field.value}
            />
          )}
        </Field>
        <div className="text-sm opacity-60">
          <p>
            <strong>Example of a great prompt: </strong>
            skyfall, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp
            focus, illustration, art by artgerm and greg rutkowski and alphonse mucha and william - adolphe bouguereau.
          </p>
          <p className="mt-2">
            There is a prompt builder <em>coming soon</em>. But till then,&nbsp;
            <a
              href="https://promptomania.com/stable-diffusion-prompt-builder/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Check this out.
            </a>
            .
          </p>
        </div>
        <div className="modal-action">
          <a href="#" className="btn btn-ghost">
            Cancel
          </a>
          <a href="#" className="btn" onClick={handleSubmit}>
            Save
          </a>
        </div>
      </div>
    </div>
  )
}

export default PromptModal
