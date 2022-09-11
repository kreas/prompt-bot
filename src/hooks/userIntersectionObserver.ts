import { RefObject, useEffect } from 'react'

type UseIntersectionObserverParams = {
  enabled: boolean | undefined
  target: RefObject<HTMLElement>
  onIntersect: () => void
  root?: RefObject<HTMLElement>
  rootMargin?: string
  threshold?: number
}

export const useIntersectionObserver = ({
  enabled = true,
  onIntersect,
  root,
  rootMargin = '0px',
  target,
  threshold = 0.1,
}: UseIntersectionObserverParams) => {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root?.current,
        rootMargin,
        threshold,
      }
    )

    const el = target && target.current

    if (!el) {
      return
    }

    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [enabled, root, rootMargin, threshold, target, onIntersect])
}
