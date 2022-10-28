import { Dream, DreamImage, UpscaledDream, User } from '@prisma/client'
import Image from 'next/image'
import { trpc } from 'src/utils/trpc'
import CopyPrompt from '../CopyPrompt'
import Lottie from 'lottie-react'
import spinner from '../../animations/spinner.json'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { cloudflareLoader } from 'src/utils/cloudflareImageLoader'
import { ControlLink } from '../controls/ControlLink'

type PreviewImage = {
  id: string
  url: string
  seed: number
  width: number
  height: number
  prompt: string
  dream: Dream
  user: User
  upscaled: boolean
}

type DreamPreviewProps = {
  dreamId: string
}

type ImageData = DreamImage & { dream: Dream & { user: User }; upscaledDream: UpscaledDream | null }

const formatImageData = (data: ImageData): PreviewImage => {
  const image = {
    id: data.id,
    seed: data.seed,
    url: data.image,
    width: data.dream.width,
    height: data.dream.height,
    prompt: data.dream.prompt,
    dream: data.dream,
    user: data.dream.user,
    upscaled: false,
  }

  if (data?.upscaledDream && data?.upscaledDream?.status === 'complete') {
    image.url = data.upscaledDream.upscaledImageURL as string
    image.width = image.width * data.upscaledDream.scale
    image.height = image.height * data.upscaledDream.scale
    image.upscaled = true
  }

  return image
}

const DreamPreview: React.FC<DreamPreviewProps> = ({ dreamId }) => {
  const { data: session } = useSession()
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [image, setImage] = useState<PreviewImage | null>(null)

  const imageQuery = trpc.useQuery(['gallery.image', { id: dreamId }], {
    onSuccess(data) {
      if (!data) return
      setImage(formatImageData(data))
    },
  })

  const upscaler = trpc.useMutation('dreams.upscale', {
    onSuccess: () => setIsUpscaling(true),
  })

  trpc.useQuery(['dreams.upscaleStatus', { id: upscaler.data?.jobID as string }], {
    enabled: isUpscaling,
    refetchInterval: 1000,
    onSuccess(data) {
      if (data?.status === 'complete') {
        setIsUpscaling(false)
        imageQuery.refetch()
      }
    },
  })

  if (!image) {
    return (
      <div className="w-full h-full flex justify-center">
        <Lottie animationData={spinner} loop={true} className="w-48" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row lg:h-full justify-center align-center">
      <div className="flex-auto bg-base-200 justify-center align-center rounded rounded-xl p-4">
        <section id={`dream-${image.id}`} className="h-full hidden lg:flex">
          <figure className="w-full max-h-full relative">
            <Image
              loader={cloudflareLoader}
              src={image.url}
              width={image.dream.width}
              height={image.dream.height}
              alt={image.dream.prompt}
              layout="fill"
              objectFit="contain"
            />
          </figure>

          <div className="relative flex flex-col top-4 right-4 gap-2">
            <ControlLink href={`/gallery/${image.id}`} tooltip="View full size">
              <Image unoptimized src="/icons/link.svg" width={20} height={20} alt="Direct Link" layout="fixed" />
            </ControlLink>

            <ControlLink href={image.url} tooltip="Open in a new Window">
              <Image
                unoptimized
                src="/icons/external-link.svg"
                width={20}
                height={20}
                alt="Open in a new Window"
                layout="fixed"
              />
            </ControlLink>
          </div>
        </section>

        <section id={`dream-${image.id}`} className="flex lg:hidden">
          <figure className="w-full max-h-full">
            <Image
              loader={cloudflareLoader}
              src={image.url}
              width={image.width}
              height={image.height}
              alt={image.prompt}
              layout="responsive"
            />
          </figure>
        </section>
      </div>

      <section className="lg:w-96 lg:pl-4 flex flex-col">
        <div className="bg-base-200 rounded rounded-xl p-2 items-center flex mt-2 lg:mt-0">
          <Image
            unoptimized
            src={image.user.image || 'unknown'}
            width={35}
            height={35}
            alt={image.user.name || 'unknown'}
            className="mask mask-circle block"
          />
          <div className="ml-2">
            <span className="opacity-70">by </span>
            <strong>{image.user.name}</strong>
          </div>
        </div>

        <div className="prose bg-base-200 rounded rounded-xl p-4 mt-2">
          <p>{image.prompt}</p>
          <div className="flex space-x-2 text-sm">
            <CopyPrompt prompt={image.prompt} className="btn btn-block" />
          </div>
        </div>

        <div id="stats" className="ml-2 mt-4 flex flex-col flex-1 gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs opacity-70 uppercase">Seed</div>
              <div className="text-lg">
                {image.seed}
                <button
                  className="btn btn-sm btn-ghost px-2"
                  onClick={() => navigator.clipboard.writeText(`${image.seed}`)}
                >
                  <Image unoptimized src="/icons/clipboard.svg" width={14} height={14} alt="Copy" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs opacity-70 uppercase">Size</div>
              <div className="text-lg">
                {image.width} x {image.height}
              </div>
            </div>

            <div>
              <div className="text-xs opacity-70 uppercase">Steps</div>
              <div className="text-lg">{image.dream.steps}</div>
            </div>

            <div>
              <div className="text-xs opacity-70 uppercase">Guidance Scale</div>
              <div className="text-lg">7.5</div>
            </div>
          </div>

          <div className="mt-1 flex flex-1 flex-col" style={{ justifyContent: 'end' }}>
            {image.user.id === session?.user?.id && !image.upscaled && (
              <button
                className="btn px-2 btn-block"
                onClick={() => upscaler.mutate({ imageId: image.id })}
                disabled={isUpscaling}
              >
                {isUpscaling ? 'Upscaling...' : 'Upscale'}
              </button>
            )}

            <button className="btn btn-disabled px-2 btn-block mt-2" disabled>
              Buy a print
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DreamPreview
