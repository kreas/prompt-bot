const size = (n: number) => {
  const m = 64 * n
  const r = m % 64

  return r === 0 ? m : m + 64 - r
}

export const aspectToPixels = (aspectRatio: string) => {
  switch (aspectRatio) {
    case '1:1':
      return { width: size(9), height: size(9) }
    case '2:3':
      return { width: size(8), height: size(12) }
    case '3:2':
      return { width: size(12), height: size(8) }
    case '16:9':
      return { width: size(12), height: size(6) }
    default:
      return { width: size(9), height: size(9) }
  }
}

export const qualityToSteps = (quality: string) => {
  switch (quality) {
    case 'low':
      return 20
    case 'mid':
      return 25
    case 'high':
      return 40
    case 'max':
      return 50
    default:
      return 25
  }
}
