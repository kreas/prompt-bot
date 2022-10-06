/* eslint-disable @next/next/no-img-element */
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import Image from 'next/image'
import PromptModal from './PromptModal'
import StandardControls from './StandardControls'
import { trpc } from 'src/utils/trpc'
import { Dream, DreamImage, UpscaledDream } from '@prisma/client'
import Lottie from 'lottie-react'
import workingAnimation from '../../animations/working-3.json'

const initialValues = {
  prompt: '',
  seed: 0,
  aspectRatio: '1:1',
  quality: 'mid',
}

const ImageGenerationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobID, setJobID] = useState<string | null>(null)
  const [dream, setDream] = useState<(Dream & { dreamImages: DreamImage[] }) | null>(null)
  const [favorite, setIsFavorite] = useState(false)
  const [upscaleID, setUpscaleID] = useState<string | null>(null)
  const [seedLocked, setSeedLocked] = useState(false)

  const createImage = trpc.useMutation('dreams.create', {
    onSuccess: (data: any) => {
      setIsSubmitting(true)
      setJobID(data.jobID)
    },
  })

  const favoriteImage = trpc.useMutation('gallery.toggle-favorite', {
    onSuccess: () => setIsFavorite(!favorite),
  })

  const upscaleImage = trpc.useMutation('dreams.upscale', {
    onSuccess: (data: any) => setUpscaleID(data.jobID)
  })

  const fetchImage = trpc.useQuery(['dreams.fetch', { id: jobID! }], {
    enabled: !!jobID && isSubmitting,
    refetchInterval: 1000,
    onSuccess: (data: any) => {
      if (data?.status === 'complete') {
        setIsSubmitting(false)
        setDream(data)
        setUpscaleID(null)
      }
    },
  })

  trpc.useQuery(['dreams.upscaleStatus', { id: upscaleID! }], {
    enabled: !!upscaleID,
    refetchInterval: 1000,
    onSuccess: (data: any) => {
      if (data.status === 'complete') {
        setUpscaleID(null)
        fetchImage.refetch()
      }
    }
  })

  const extractImageFromDream = () => {
    const record = dream?.dreamImages[0] as DreamImage & { upscaledDream: UpscaledDream | null}
    if (!record) return null

    if (record.upscaledDream) {
      record.image = record.upscaledDream.upscaledImageURL as string
    }

    return record
  }

  const image = extractImageFromDream()

  const isWorking = createImage.isLoading || isSubmitting || !!upscaleID

  const handleSubmit = async (values: Record<string, string | number>) => {
    if (!Boolean(values?.prompt)) return
    setIsFavorite(false)
    values.seed = seedLocked ? values.seed : 0 as any

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
              <StandardControls values={props.values} seedLocked={seedLocked} onToggleSeed={() => setSeedLocked(!seedLocked)} />
            </section>

            <section className="flex flex-col flex-1">
              <div
                className="flex flex-1 bg-base-200 rounded-lg p-4 justify-center relative"
                style={{ maxHeight: 'calc(100vh - 160px)' }}
              >
                {image && (
                  <>
                    {!isWorking && (
                      <div
                        className="absolute top-4 right-4 bg-base-200 z-10 p-4 rounded rounded-lg opacity-30 hover:opacity-100 flex flex-col"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                      >
                        <div className="tooltip tooltip-left" data-tip={favorite ? 'unfavorite' : 'favorite'}>
                          <button
                            type="button"
                            title="favorite"
                            onClick={() => favoriteImage.mutate({ imageId: image.id })}
                          >
                            <Image
                              src={favorite ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
                              width={24}
                              height={24}
                              alt="favorite"
                            />
                          </button>
                        </div>

                        {!image.upscaledDream && (
                          <div className="tooltip tooltip-left" data-tip="upscale">
                            <button
                              type="button"
                              className="block mt-4"
                              title="upscale"
                              onClick={() => upscaleImage.mutate({ imageId: image.id })}
                            >
                              <Image src="/icons/chevrons-up.svg" width={24} height={24} alt="download" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <figure className={`flex items-center ${isWorking ? 'blur-sm' : ''}`}>
                      <img src={image.image} alt={dream?.prompt} className="h-full w-auto object-scale-down" />
                    </figure>
                  </>
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
