import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function NewSubmission() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/my-books')
  }, [router])

  return null
}
