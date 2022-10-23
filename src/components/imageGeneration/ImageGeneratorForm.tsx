/* eslint-disable @next/next/no-img-element */
import { Form, Formik } from 'formik'
import { useContext, useEffect, useRef } from 'react'
import StandardControls from './StandardControls'
import { CanvasContext } from 'src/contexts/CanvasContext'
import CanvasControls from './CanvasControls'
import WorkingIndicator from './WorkingIndicator'
import PromptBar from './PromptBar'
import PromptGenerator from './PromptGenerator'

const initialValues = {
  prompt: '',
  seed: 0,
  aspectRatio: '1:1',
  quality: 'mid',
}

const ImageGenerationForm: React.FC = () => {
  const { dream, image, isWorking, createImage, isSubmitting, setIsSubmitting, setIsFavorite, seedLocked } = useContext(CanvasContext)
  const updateFieldValue = useRef<any>(null)

  const handleSubmit = async (values: Record<string, string | number>) => {
    if (!Boolean(values?.prompt)) return
    setIsFavorite(false)

    try {
      createImage.mutate({ ...values, seedLocked: seedLocked })
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (dream?.dreamImages[0]) {
      const seed = dream.dreamImages[0].seed
      updateFieldValue.current('seed', seed)
    }
  }, [dream])

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue, submitForm }) => {
          updateFieldValue.current = setFieldValue

          const handleGenerate = () => {
            isWorking || submitForm()
          }

          return (
            <>
              <Form className="flex flex-row flex-1 px-4 gap-4">
                <StandardControls values={values} />

                <section className="flex flex-col flex-1">
                  <div
                    className="flex flex-1 bg-base-200 rounded-lg p-4 justify-center relative"
                    style={{ maxHeight: 'calc(100vh - 160px)' }}
                  >
                    {image && (
                      <>
                        <CanvasControls />
                        <figure className={`flex items-center ${isWorking ? 'blur-sm' : ''}`}>
                          <img src={image.image} alt={dream?.prompt} className="h-full w-auto object-scale-down" />
                        </figure>
                      </>
                    )}

                    <WorkingIndicator />
                  </div>

                  <PromptBar submitForm={handleGenerate} className="mt-4 pb-4" />

                </section>
              </Form>
              <PromptGenerator onUse={setFieldValue} onSubmit={submitForm} />
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default ImageGenerationForm
