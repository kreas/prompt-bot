import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Timer from 'components/Timer'
import PromptModal from './PromptModal'
import AdvanceControls from './AdvanceControls'
import StandardControls from './StandardControls'
import FormField from './FormField'

const initialValues = {
  prompt: '',
  width: 512,
  height: 512,
  steps: 30,
  seed: 0,
  aspectRation: '1:1',
  interface: 'standard',
  quality: 'mid',
}

const ImageGenerationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [image, setImage] = useState(null)

  const longPoll: any = async (jobId: string) => {
    const resp = await axios.get(`/api/images/${jobId}`)

    if (resp.data.status === 'pending') {
      return setTimeout(() => longPoll(jobId), 2000)
    }

    setImage(resp.data[0].image)
    setIsSubmitting(false)
  }

  const handleSubmit = async (values: Record<string, string | number>) => {
    if (!Boolean(values?.prompt)) return
    setIsSubmitting(true)

    if (values.interface === 'standard') {
      switch(values.aspectRation) {
        case '1:1':
          values.width = 512
          values.height = 512
          break
        case '2:3':
          values.width = 512
          values.height = 768
          break
        case '3:2':
          values.width = 768
          values.height = 512
          break
        case '16:9':
          values.width = 1024
          values.height = 512
          break
      }

      switch(values.quality) {
        case 'low':
          values.steps = 20
        case 'mid':
          values.steps = 35
        case 'high':
          values.steps = 50
      }
    }

    try {
      const response = await axios.post('/api/generate', values)
      longPoll(response.data.job_id)
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
    }
  }


  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(props) => {
        return (
          <Form className="flex flex-row flex-1 mr-2 px-4">
            <section className="flex-1 hidden md:block" style={{ maxWidth: 300 }}>
              <FormField label="Controls" value={false} badge={false} hint="Choose a version of image controls">
                <div className="btn-group flex">
                  <Field name="interface" type="radio" data-title="standard" className="btn flex-1 tab tab-lifted" value="standard" />
                  <Field name="interface" type="radio" data-title="advanced" className="btn flex-1 tab tab-lifted" value="advance" />
                </div>
              </FormField>

              {props.values.interface === 'standard' ? (
                <StandardControls values={props.values} />
              ) : (
                <AdvanceControls values={props.values} />
              )}
            </section>

            <section className="flex ml-4 flex-1 form-control align-center">
              <div className="flex bg-base-200 rounded-xl p-4 justify-center" style={{ height: 'calc(100vh - 160px)' }}>
                {image ? (
                  <div className="drop-shadow-md p-4 bg-neutral-focus rounded-md">
                    {isSubmitting && (
                      <div
                        className="flex flex-col justify-center align-middle absolute w-full h-full top-0 left-0 rounded-md text-3xl text-shadow-lg "
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        <Timer show={true} />
                      </div>
                    )}
                    {image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} className="rounded-md md:h-full" alt={props.values.prompt} />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 justify-center align-middle">
                    <Timer show={isSubmitting} />
                  </div>
                )}
              </div>

              <div className="input-group mt-4">
                <a className="btn btn-outline border-r-none" href="#prompt-modal">
                  <Image src="/icons/maximize-2.svg" alt="Maximize" width={16} height={16} />
                </a>

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
                          props.submitForm()
                        }
                      }}
                    />
                  )}
                </Field>
                <button className="btn btn-accent btn-bordered" type="submit" disabled={isSubmitting}>
                  go
                </button>
              </div>
            </section>

            <PromptModal onSubmit={props.submitForm} />
          </Form>
        )
      }}
    </Formik>
  )
}

export default ImageGenerationForm
