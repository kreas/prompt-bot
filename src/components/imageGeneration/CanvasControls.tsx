import { CanvasContext } from 'src/contexts/CanvasContext'
import Image from 'next/image'
import { useContext } from 'react'

const CanvasControls: React.FC = () => {
  const { image, isWorking, favoriteImage, favorite, upscaleImage } = useContext(CanvasContext)

  if (isWorking) return <></>

  return (
    <div
      className="absolute top-4 right-4 bg-base-200 z-10 p-4 rounded rounded-lg opacity-30 hover:opacity-100 flex flex-col"
      style={{ background: 'rgba(255,255,255,0.1)' }}
    >
      <div className="tooltip tooltip-left" data-tip={favorite ? 'unfavorite' : 'favorite'}>
        <button type="button" title="favorite" onClick={() => favoriteImage.mutate({ imageId: image.id })}>
          <Image
            unoptimized
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
            <Image unoptimized src="/icons/chevrons-up.svg" width={24} height={24} alt="download" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CanvasControls
