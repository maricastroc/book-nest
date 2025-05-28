/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react'

export const useGridColumns = (gridRef: React.RefObject<HTMLElement>) => {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    if (!gridRef.current) return

    const calculateColumns = () => {
      const grid = gridRef.current!
      const gridStyle = window.getComputedStyle(grid)
      const columnGap = parseFloat(gridStyle.gap)
      const gridWidth = grid.clientWidth
      const firstChild = grid.firstElementChild as HTMLElement

      if (!firstChild) return 1

      const itemWidth = firstChild.offsetWidth
      const columns = Math.floor(
        (gridWidth + columnGap) / (itemWidth + columnGap),
      )

      return Math.max(1, columns)
    }

    const updateColumns = () => {
      setColumns(calculateColumns())
    }

    const resizeObserver = new ResizeObserver(updateColumns)
    resizeObserver.observe(gridRef.current)

    // Adicione um delay para garantir que os elementos estejam renderizados
    const initTimer = setTimeout(updateColumns, 100)

    return () => {
      resizeObserver.disconnect()
      clearTimeout(initTimer)
    }
  }, [gridRef])

  return columns
}
