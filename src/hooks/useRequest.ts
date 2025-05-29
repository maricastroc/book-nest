// https://github.com/vercel/swr/blob/main/examples/axios-typescript/libs/useRequest.ts
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { api } from '@/lib/axios'
import qs from 'qs'

export type GetRequest = AxiosRequestConfig | null

interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate'
  > {
  data: Data | undefined
  response: AxiosResponse<Data> | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination: any
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
  > {
  fallbackData?: Data
}

const getRequestKey = (request: GetRequest) => {
  if (!request) return null
  const query = request.params ? `?${qs.stringify(request.params)}` : ''
  return `${request.method || 'GET'} ${request.url}${query}`
}

export default function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, ...config }: Config<Data, Error> = {},
): Return<Data, Error> {
  const key = getRequestKey(request)

  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    key, // <- chave estável
    request ? () => api.request<Data>(request) : null,
    {
      ...config,
      revalidateOnFocus: false,
      fallbackData:
        fallbackData &&
        ({
          status: 200,
          statusText: 'InitialData',
          config: request!,
          headers: {},
          data: fallbackData,
        } as AxiosResponse<Data>),
    },
  )

  const responseData =
    response && response.data && (Object.values(response.data)[0] as Data)

  const pagination = { ...response?.data }

  return {
    data:
      typeof responseData === 'number'
        ? response && response.data
        : responseData,
    response,
    error,
    isValidating,
    mutate,
    pagination,
  }
}
