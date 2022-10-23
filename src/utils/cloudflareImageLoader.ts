export const cloudflareLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
  if (process.env.NODE_ENV !== 'production') return src

  const params = [`width=${width}`, 'format=auto']

  if (quality) {
    params.push(`quality=${quality}`)
  }

  const paramsString = params.join(',')

  return `https://images.scrollrack.quest/cdn-cgi/image/${paramsString}/${src}`
}
