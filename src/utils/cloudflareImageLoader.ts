const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src
}

export const cloudflareLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
  console.log(src)
  const params = [`width=${width}`]

  if (quality) {
    params.push(`quality=${quality}`)
  }

  return `https://app.scrollrack.quest/cdn-cgi/image/${paramsString}/${src}`
}
