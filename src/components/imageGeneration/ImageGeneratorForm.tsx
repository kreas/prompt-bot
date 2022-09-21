/* eslint-disable @next/next/no-img-element */
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import Image from 'next/image'
import PromptModal from './PromptModal'
import AdvanceControls from './AdvanceControls'
import StandardControls from './StandardControls'
import FormField from './FormField'
import { trpc } from 'src/utils/trpc'
import { Dream, DreamImage } from '@prisma/client'
import Lottie from 'lottie-react'
import workingAnimation from '../../animations/working-3.json'

const initialValues = {
  prompt: '',
  width: 448,
  height: 448,
  steps: 30,
  seed: 0,
  aspectRation: '1:1',
  interface: 'standard',
  quality: 'mid',
}

const ImageGenerationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobID, setJobID] = useState<string | null>(null)
  const [dream, setDream] = useState<(Dream & { dreamImages: DreamImage[] }) | null>(null)

  const createImage = trpc.useMutation('dreams.create', {
    onSuccess: (data: any) => {
      setIsSubmitting(true)
      setJobID(data.jobID)
    },
  })

  const { isLoading } = createImage

  trpc.useQuery(['dreams.fetch', { id: jobID! }], {
    enabled: !!jobID && isSubmitting,
    refetchInterval: 1000,
    onSuccess: (data: any) => {
      if (data?.status === 'complete') {
        setIsSubmitting(false)
        setDream(data)
      }
    },
  })

  const image = dream?.dreamImages[0]
  const isWorking = isLoading || isSubmitting

  const handleSubmit = async (values: Record<string, string | number>) => {
    if (!Boolean(values?.prompt)) return

    if (values.interface === 'standard') {
      switch (values.aspectRation) {
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
          values.width = 768
          values.height = 448
          break
      }

      switch (values.quality) {
        case 'low':
          values.steps = 20
        case 'mid':
          values.steps = 35
        case 'high':
          values.steps = 50
      }
    }

    try {
      createImage.mutate(values as any)
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(props) => {
        return (
          <Form className="flex flex-row flex-1 px-4 gap-4">
            <section className="hidden md:block" style={{ width: 275 }}>
              <FormField label="Controls" value={false} badge={false} hint="Choose a version of image controls">
                <div className="btn-group flex">
                  <Field
                    name="interface"
                    type="radio"
                    data-title="standard"
                    className="btn flex-1 tab tab-lifted"
                    value="standard"
                  />
                  <Field
                    name="interface"
                    type="radio"
                    data-title="advanced"
                    className="btn flex-1 tab tab-lifted"
                    value="advance"
                  />
                </div>
              </FormField>

              {props.values.interface === 'standard' ? (
                <StandardControls values={props.values} />
              ) : (
                <AdvanceControls values={props.values} />
              )}
            </section>

            <section className="flex flex-col flex-1">
              <div className="flex flex-1 bg-base-200 rounded-xl p-4 justify-center relative" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                {image && (
                  <figure className={`flex items-center ${isWorking ? 'blur-sm' : ''}`}>
                    <img src={image.image} alt={dream.prompt} className="h-full w-auto object-scale-down" />
                  </figure>
                )}
                {isWorking && (
                  <div className="flex justify-center align-middle w-full h-full z-100 absolute">
                    <Lottie animationData={workingAnimation} className="w-96 h-96 m-auto" />
                  </div>
                )}
              </div>

              <div className="input-group mt-4 pb-4">
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
                <button className="btn btn-accent btn-bordered" type="submit" disabled={isWorking}>
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
