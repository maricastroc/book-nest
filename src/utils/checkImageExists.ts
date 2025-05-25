export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) return false

    const contentType = response.headers.get('content-type')

    return contentType ? contentType.startsWith('image/') : false
  } catch (error) {
    return false
  }
}
