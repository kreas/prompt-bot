import type { NextPage } from 'next'
import Head from 'next/head'
import { Formik, Field, Form } from 'formik'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'

const Timer: React.FC<{ timer: number; show: boolean }> = ({ timer, show }) => {
  if (!show) return null

  return (
    <div
      className="flex text-3xl justify-center h-full"
      style={{ textShadow: '3px 2px 7px rgba(0,0,0,0.6)', alignItems: 'center' }}
    >
      <span>{timer.toFixed(1)}s</span>
    </div>
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
                  <div className="mt-4">
                    <Field name="width" type="range" min="512" max="768" step="64" className="range" />
                    <div className="flex">
                      <div className="flex-1">Width</div>
                      <div className="w-full text-right">{props.values.width}px</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Field name="height" type="range" min="512" max="768" step="64" className="range" />
                    <div className="flex">
                      <div className="flex-1">Height</div>
                      <div className="w-full text-right">{props.values.height}px</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Field name="steps" type="range" min="20" max="50" step="1" className="range" />
                    <div className="flex">
                      <div className="flex-1">Steps</div>
                      <div className="w-full text-right">{props.values.steps}</div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="flex ml-4 flex-1 form-control align-center">
                <div className="flex flex-1 bg-base-200 rounded-xl p-4 overflow-y-auto">
                  {image ? (
                    <div className="m-auto drop-shadow-md p-4 bg-neutral-focus rounded-md inline">
                      <div className="relative">
                        {isSubmitting && (
                          <div
                            className="flex flex-col justify-center align-middle absolute w-full h-full top-0 left-0 rounded-md text-3xl text-shadow-lg "
                            style={{ backdropFilter: 'blur(10px)' }}
                          >
                            <Timer timer={timer} show={true} />
                          </div>
                        )}
                        {image && <img src={image} width="100%" className="rounded-md" />}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 justify-center align-middle">
                      <Timer timer={timer} show={isSubmitting} />
                    </div>
                  )}
                </div>

                <div className="input-group mt-4">
                  <Field name="prompt" type="text" className="input w-full bg-neutral" autoComplete="off" />
                  <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                    go
                  </button>
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
