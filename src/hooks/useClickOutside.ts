import { useEffect } from 'react'

export function useClickOutside(
  refs: React.RefObject<HTMLElement>[],
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      )

      if (clickedOutside) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [refs, callback])
}
