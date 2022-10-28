import { CanvasContext } from 'src/contexts/CanvasContext'
import Image from 'next/image'
import { useContext } from 'react'
import { ControlButton } from './CanvasButton'

const CanvasControls: React.FC = () => {
  const { image, isWorking, favoriteImage, favorite, upscaleImage } = useContext(CanvasContext)

  if (isWorking) return <></>

  return (
    <>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <ControlButton onClick={() => window.open(image.image)} tooltip="Open in new window" tooltipDirection="right">
          <Image
            src='/icons/external-link.svg'
            width={24}
            height={24}
            alt="Open in a new Window"
          />
        </ControlButton>
      </div>

      <div
        className="absolute top-4 right-4 z-10 flex flex-col gap-2"
      >
        <ControlButton onClick={() => favoriteImage.mutate({ imageId: image.id })} tooltip="Toggle favorite">
          <Image
            src={favorite ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
            width={24}
            height={24}
            alt="favorite"
          />
        </ControlButton>

        {!image.upscaledDream && (
          <ControlButton tooltip="Upscale" onClick={() => upscaleImage.mutate({ imageId: image.id })}>
            <Image unoptimized src="/icons/chevrons-up.svg" width={24} height={24} alt="upscale" />
          </ControlButton>
        )}
      </div>
    </>
  )
}

export default CanvasControls
