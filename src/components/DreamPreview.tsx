import { Dream, DreamImage, User } from '@prisma/client'
import Image from 'next/image'
import { trpc } from 'src/utils/trpc'
import CopyPrompt from './CopyPrompt'
import Lottie from 'lottie-react'
import spinner from '../animations/spinner.json'

type DreamPreviewProps = {
  dreamId?: string
  image?: DreamImage & { dream: Dream & { user: User } }
}

const DreamPreview: React.FC<DreamPreviewProps> = ({ dreamId, image }) => {
  if (dreamId) {
    const { data } = trpc.useQuery(['gallery.image', { id: dreamId }])
    if (data) image ||= data
  }

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
              src={image.image}
              width={image.dream.width}
              height={image.dream.height}
              alt={image.dream.prompt}
              layout="fill"
              objectFit="contain"
            />
          </figure>
        </section>

        <section id={`dream-${image.id}`} className="flex lg:hidden">
          <figure className="w-full max-h-full">
            <Image
              src={image.image}
              width={image.dream.width}
              height={image.dream.height}
              alt={image.dream.prompt}
              layout="responsive"
            />
          </figure>
        </section>

        <div
          className="block w-16 m-auto mb-4 relative bg-black text-center opacity-20 hover:opacity-100 rounded rounded-lg p-1 text-xs scale-75 hover:scale-100 transform transition duration-300 ease-in-out flex gap-4 justify-center"
          style={{ top: -50 }}
        >
          <a href={`/gallery/${image.id}`} className="opacity-50 hover:opacity-100 transition">
            <Image src="/icons/download.svg" width={14} height={14} alt="Download" />
          </a>

          <a href={image.image} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 transition">
            <Image src="/icons/maximize-2.svg" width={14} height={14} alt="Open in a new Window" />
          </a>
        </div>
      </div>

      <section className="lg:w-96 lg:pl-4 flex flex-col">
        <div className="bg-base-200 rounded rounded-xl p-2 items-center flex mt-2 lg:mt-0">
          <Image
            src={image.dream.user.image || 'unknown'}
            width={35}
            height={35}
            alt={image.dream.user.name || 'unknown'}
            className="mask mask-circle block"
          />
          <div className="ml-2">
            <span className="opacity-70">by </span>
            <strong>{image.dream.user.name}</strong>
          </div>
        </div>

        <div className="prose bg-base-200 rounded rounded-xl p-4 mt-2">
          <p>{image.dream.prompt}</p>
          <div className="flex space-x-2 text-sm">
            <CopyPrompt prompt={image.dream.prompt} className="btn btn-block" />
          </div>
        </div>

        <div id="stats" className="ml-2 mt-4 flex flex-col flex-1 gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs opacity-70 uppercase">Seed</div>
              <div className="text-lg">
                {image.seed}
                <button className="btn btn-sm btn-ghost px-2" onClick={() => navigator.clipboard.writeText(`${image?.seed || '0'}`)}>
                  <Image src="/icons/clipboard.svg" width={14} height={14} alt="Copy" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs opacity-70 uppercase">Size</div>
              <div className="text-lg">
                {image.dream.width} x {image.dream.height}
              </div>
            </div>

            <div>
              <div className="text-xs opacity-70 uppercase">Steps</div>
              <div className="text-lg">
                {image.dream.steps}
              </div>
            </div>

            <div>
              <div className="text-xs opacity-70 uppercase">Guidance Scale</div>
              <div className="text-lg">
                7.5
              </div>
            </div>
          </div>

          <div className="mt-1 flex flex-1 flex-col" style={{ justifyContent: 'end' }}>
            <button className="btn btn-disabled px-2 btn-block" disabled>
              Upscale image
            </button>
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
