import axios from 'axios'
import { toast } from 'react-toastify'

export function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage =
      typeof error.response.data.message === 'string'
        ? error.response.data.message
        : Object.values(error.response.data.message).join(', ')
    toast.error(errorMessage)
  } else {
    toast.error('Ooops, something went wrong. Please try again later.')
  }
}
