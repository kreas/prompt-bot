import { CanvasContext } from 'src/contexts/CanvasContext'
import Image from 'next/image'
import { useContext } from 'react'
import { ControlButton } from './ControlButton'
import { ControlLink } from './ControlLink'

const CanvasControls: React.FC = () => {
  const { image, isWorking, favoriteImage, favorite, upscaleImage } = useContext(CanvasContext)

  if (isWorking) return <></>

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
      <ControlLink href={`/gallery/${image.id}`} target="_self" tooltip="Open in new window">
        <Image
          src='/icons/link.svg'
          width={20}
          height={20}
          alt="View in gallery"
        />
      </ControlLink>

      <ControlLink href={image.image} target="_blank" tooltip="Open in new window">
        <Image
          src='/icons/external-link.svg'
          width={20}
          height={20}
          alt="Open in a new Window"
        />
      </ControlLink>

      <ControlButton onClick={() => favoriteImage.mutate({ imageId: image.id })} tooltip="Toggle favorite">
        <Image
          src={favorite ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
          width={20}
          height={20}
          alt="favorite"
        />
      </ControlButton>

      {!image.upscaledDream && (
        <ControlButton tooltip="Upscale" onClick={() => upscaleImage.mutate({ imageId: image.id })}>
          <Image
            src="/icons/chevrons-up.svg"
            width={20}
            height={20}
            alt="upscale"
          />
        </ControlButton>
      )}
    </div>
  )
}

export default CanvasControls
