import { useEffect, useState } from 'react'

/**
 * Custom hook para debouncing de valores.
 *
 * @param value - O valor a ser "debounced".
 * @param delay - O atraso em milissegundos antes de atualizar o valor.
 * @returns - O valor debounced.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Define um timeout para atualizar o valor debounced após o atraso
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Limpa o timeout se o valor ou o delay mudarem
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
