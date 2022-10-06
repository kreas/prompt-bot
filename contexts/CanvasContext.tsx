import { Dream, DreamImage, UpscaledDream } from '@prisma/client'
import { createContext, useState } from 'react'
import { trpc } from 'src/utils/trpc'

type CanvasContextProps = {
  children: React.ReactNode
}

export const CanvasContext = createContext<any>(null)

export const CanvasContextProvider: React.FC<CanvasContextProps> = ({ children }) => {
  const [jobID, setJobID] = useState<string | null>(null)
  const [dream, setDream] = useState<(Dream & { dreamImages: DreamImage[] }) | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [favorite, setIsFavorite] = useState(false)
  const [upscaleID, setUpscaleID] = useState<string | null>(null)
  const [seedLocked, setSeedLocked] = useState(false)

  const createImage = trpc.useMutation('dreams.create', {
    onSuccess: (data: any) => {
      setIsSubmitting(true)
      setJobID(data.jobID)
    },
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

  const favoriteImage = trpc.useMutation('gallery.toggle-favorite', {
    onSuccess: () => setIsFavorite(!favorite),
  })

  const upscaleImage = trpc.useMutation('dreams.upscale', {
    onSuccess: (data: any) => setUpscaleID(data.jobID),
  })

  const extractImageFromDream = () => {
    const record = dream?.dreamImages[0] as DreamImage & { upscaledDream: UpscaledDream | null }
    if (!record) return null

    if (record.upscaledDream) {
      record.image = record.upscaledDream.upscaledImageURL as string
    }

    return record
  }

  trpc.useQuery(['dreams.upscaleStatus', { id: upscaleID! }], {
    enabled: !!upscaleID,
    refetchInterval: 1000,
    onSuccess: (data: any) => {
      if (data.status === 'complete') {
        setUpscaleID(null)
        fetchImage.refetch()
      }
    },
  })

  const image = extractImageFromDream()

  const isWorking = createImage.isLoading || isSubmitting || !!upscaleID

  return (
    <CanvasContext.Provider
      value={{
        image,
        isWorking,
        jobID,
        createImage,
        dream,
        setDream,
        favorite,
        favoriteImage,
        upscaleImage,
        fetchImage,
        setIsSubmitting,
        seedLocked,
        setSeedLocked,
        setIsFavorite,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}
