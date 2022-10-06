export const aspectToPixels = (aspectRatio: string) => {
  console.log({ aspectRatio })
  switch (aspectRatio) {
    case '1:1':
      return { width: 512, height: 512 }
    case '2:3':
      // 64 * 8 =
      return { width: 384, height: 512 }
    case '3:2':
      return { width: 512, height: 384 }
    case '16:9':
      return { width: 576, height: 384 }
    default:
      return { width: 512, height: 512 }
  }
}

export const qualityToSteps = (quality: string) => {
  switch (quality) {
    case 'low':
      return 25
    case 'mid':
      return 50
    case 'high':
      return 75
    case 'max':
      return 100
    default:
      return 50
  }
}
