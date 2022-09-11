import Image from 'next/image'
import { ImageObj } from './ImageCard'

export interface ImageModalProps {
  image: ImageObj
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose: handleClose }) => {
  return (
    <>
      <input type="checkbox" id="gallery-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-6xl" style={{ width: image.width }}>
          <label
            htmlFor="gallery-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            style={{ zIndex: 50 }}
            onClick={handleClose}
          >
            ✕
          </label>
          <div className="rounded rounded-xl flex">
            <Image
              src={image.image}
              width={image.width}
              height={image.height}
              alt={image.prompt}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ImageModal
