import { AxiosInstance, AxiosResponse } from 'axios'
import { SelectEffect, CallEffect, SagaReturnType } from 'redux-saga/effects'

export type KeyOf<T, I> = {
  [K in keyof T]: T[K] extends I ? K : never
}[keyof T]
export type KeysOfAxios = KeyOf<
  AxiosInstance,
  (url: string, ...args: any[]) => Promise<AxiosResponse<any>>
>

export type ApiRequestSignatureGenerator<K extends KeysOfAxios, R> = (
  method: K,
  ...params: Required<Parameters<AxiosInstance[K]>>
) => Generator<
  SelectEffect | CallEffect<SagaReturnType<AxiosInstance[K]>>,
  AxiosResponse<R>,
  AxiosInstance & AxiosResponse<R>
>
