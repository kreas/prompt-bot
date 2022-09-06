import type { NextPage } from 'next'
import Head from 'next/head'
import { Formik, Field, Form } from 'formik'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'

const Timer: React.FC<{ timer: number; show: boolean }> = ({ timer, show }) => {
  if (!show) return null

  return (
    <div
      className="flex justify-center h-full"
      style={{ textShadow: '3px 2px 7px rgba(0,0,0,0.6)', alignItems: 'center' }}
    >
      <div className="font-mono text-4xl">
        <span>{timer.toFixed(1)}</span>
      </div>
    </div>
  )
}

type FormFieldProps = {
  label: string
  children: React.ReactNode
  value: string | number | boolean
  hint?: string
  badge?: boolean
}

const FormField: React.FC<FormFieldProps> = ({ label, children, value, hint, badge = true }) => {
  return (
    <label className="mt-4">
      <div className="flex">
        <div className="flex-1">{label}</div>
        {badge && <div className="badge badge-lg">{value}</div>}
      </div>
      {hint && <div className="text-sm opacity-60 mb-2">{hint}</div>}
      {children}
    </label>
  )
}

const Home: NextPage = () => {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [image, setImage] = useState(null)
  const [timer, setTimer] = useState(0.0)

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setTimer(timer + 0.1)
      }, 100)

      return () => clearInterval(interval)
    }

    setTimer(0.0) // reset timer
  }, [isSubmitting, timer])

  // TODO: this really should be a websocket
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const longPoll: any = async (jobId: string) => {
    const resp = await axios.get(`/api/images/${jobId}`)

    if (resp.data.status === 'pending') {
      return setTimeout(() => longPoll(jobId), 1000)
    }

    setImage(resp.data[0].image)
    setIsSubmitting(false)
  }

  return (
    <>
      <Head>
        <title>Scrollrack</title>
        <meta name="description" content="AI powered asset generator for Magic The Gathering" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session ? (
        <Formik
          initialValues={{ prompt: '', width: 512, height: 512, steps: 30, seed: 0 }}
          onSubmit={async (values: Record<string, string | number>) => {
            if (!Boolean(values?.prompt)) return
            setIsSubmitting(true)
            try {
              const response = await axios.post('/api/generate', values)
              longPoll(response.data.job_id)
            } catch (error) {
              console.error(error)
              setIsSubmitting(false)
            }
          }}
        >
          {(props) => (
            <Form className="flex flex-row flex-1 mr-2 px-4">
              <section className="flex-1 hidden md:block" style={{ maxWidth: 300 }}>
                <div className="form-control mt-2">
                  <FormField label="Width" value={`${props.values.width}px`} hint="Width of your image.">
                    <Field name="width" type="range" min="512" max="768" step="64" className="range range-sm" />
                  </FormField>

                  <FormField label="Height" value={`${props.values.height}px`} hint="Height of your image.">
                    <Field name="height" type="range" min="512" max="768" step="64" className="range range-sm" />
                  </FormField>

                  <FormField
                    label="Steps"
                    value={props.values.steps}
                    hint="How many steps to spend generating your image."
                  >
                    <Field name="steps" type="range" min="30" max="75" step="1" className="range range-sm" />
                  </FormField>

                  <FormField
                    label="Seed"
                    value={props.values.seed}
                    hint="The seed used to generate your image. Enable to manually set a seed."
                    badge={false}
                  >
                    <Field name="seed" type="number" className="input w-full bg-neutral" />
                  </FormField>
                </div>
              </section>
              <section className="flex ml-4 flex-1 form-control align-center">
                <div
                  className="flex bg-base-200 rounded-xl p-4 justify-center"
                  style={{ height: 'calc(100vh - 160px)' }}
                >
                  {image ? (
                    <div className="drop-shadow-md p-4 bg-neutral-focus rounded-md">
                      {isSubmitting && (
                        <div
                          className="flex flex-col justify-center align-middle absolute w-full h-full top-0 left-0 rounded-md text-3xl text-shadow-lg "
                          style={{ backdropFilter: 'blur(10px)' }}
                        >
                          <Timer timer={timer} show={true} />
                        </div>
                      )}
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} className="rounded-md md:h-full" alt={props.values.prompt} />
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 justify-center align-middle">
                      <Timer timer={timer} show={isSubmitting} />
                    </div>
                  )}
                </div>

                <div className="input-group mt-4">
                  <a className="btn btn-outline border-r-none" href="#my-modal-2">
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

                <div className="modal" id="my-modal-2">
                  <div className="modal-box w-11/12 max-w-5xl">
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
                    <div className='text-sm opacity-60'>
                      <p>
                        <strong>Example of a great prompt: </strong>
                        skyfall, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth,
                        sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha and william -
                        adolphe bouguereau.
                      </p>
                      <p className='mt-2'>
                        There is a prompt builder <em>coming soon</em>. But till then,&nbsp; 
                        <a href="https://promptomania.com/stable-diffusion-prompt-builder/" target="_blank" rel="noreferrer" className='underline'>Check this out.</a>.
                      </p>
                    </div>
                    <div className="modal-action">
                      <a href="#" className="btn" onClick={props.submitForm}>
                        Save
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </Form>
          )}
        </Formik>
      ) : (
        <div>
          <button onClick={() => signIn()} className="btn btn-primary">
            Sign-in
          </button>
        </div>
      )}
    </>
  )
}

export default Home
