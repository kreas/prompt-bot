import { Dream, DreamImage, FavoriteDream, User } from '@prisma/client'
import { TRPCClientErrorLike } from '@trpc/client'
import { UseInfiniteQueryResult } from 'react-query'

type Query = UseInfiniteQueryResult<
  {
    dreams:
      | (Dream & {
          user: User
          dreamImages: (DreamImage & {
            FavoriteDreams: FavoriteDream[]
          })[]
        })[]
      | undefined
    nextCursor: string | null
  },
  TRPCClientErrorLike<any>
>

export const extractDreams = (query: Query) => {
  const dreams = query.data?.pages.map((page) => page.dreams).flat() || []

  return dreams.map((dream: any) => {
    const image = dream.dreamImages[0]

    return {
      id: image.id,
      dreamId: dream.id,
      prompt: dream.prompt,
      image: image.image,
      seed: image.seed,
      createdAt: dream.createdAt,
      width: dream.width,
      height: dream.height,
      user: dream.user,
      favorite: image.FavoriteDreams.length > 0,
    }
  })
}
