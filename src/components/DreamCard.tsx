import Image from 'next/image'
import { useState } from 'react'
import { trpc } from 'src/utils/trpc'
import { truncate } from 'src/utils/truncate'
import CopyPrompt from './CopyPrompt'

export interface DreamObj {
  id: string
  dreamId: number
  prompt: string
  image: string
  seed: number
  createdAt: Date
  width: number
  height: number
  user: Record<string, any>
  favorite: boolean
}

interface DreamCardProps {
  image: DreamObj
  selectImage: (id: string) => void
}

const ImageCard: React.FC<DreamCardProps> = ({ image, selectImage }) => {
  const [isFavorite, setIsFavorite] = useState(image.favorite)
  const mutation = trpc.useMutation('gallery.toggle-favorite')

  const handleFavorite = () => {
    mutation.mutate({ imageId: image.id })
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="card bg-neutral shadow-xl w-full aspect-photo mb-5">
      <figure>
        <a href='#preview' onClick={() => selectImage(image.id)}>
          <Image src={image?.image} alt="image.prompt" key={image?.id} width={image?.width} height={image?.height} />
        </a>
      </figure>
      <button className="absolute z-10 bg-transparent right-3 top-3" onClick={handleFavorite}>
        <Image
          src={isFavorite ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
          width={24}
          height={24}
          className="absolute z-10 top-2 right-2 opacity-30 hover:opacity-100"
          alt="favorite"
        />
      </button>
      <div className="card-body p-4">
        <p className="text-sm">{truncate(image?.prompt, 200)}</p>
        <div className="bg-base-200 rounded-lg p-2">
          <div className="dropdown dropdown-top dropdown-end flex">
            <div className="flex-1 flex text-sm items-center">
              <Image src={image?.user?.image} alt="user" width={24} height={24} className="mask mask-circle" />
              <span className="ml-2">{image?.user.name}</span>
            </div>
            <label tabIndex={0} className="btn btn-ghost btn-sm text-sm w-11">
              <Image src="/icons/more-vertical.svg" alt="share" width={24} height={24} />
            </label>
            <div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-md bg-base-100 rounded-box w-52 mb-1 text-sm"
              >
                <li>
                  <CopyPrompt prompt={image?.prompt} className={''} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCard
