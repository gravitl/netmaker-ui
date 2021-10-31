import { ToastContent, ToastOptions, UpdateOptions } from 'react-toastify'
import { PayloadActionCreator } from 'typesafe-actions'

export type ToastPromiseType = string | UpdateOptions
export type ToastPromiseFunctionType<T> = (value: T) => ToastPromiseType
export interface ToastPromiseParams<T, E = any> {
  pending: ToastPromiseType
  success: ToastPromiseType | ToastPromiseFunctionType<T>
  error: ToastPromiseType | ToastPromiseFunctionType<E>
}

export interface ToastPayload {
  method: 'info' | 'warn' | 'success' | 'error'
  content: ToastContent
  options?: ToastOptions
}

export interface AsyncToastPayload<T> {
  params: ToastPromiseParams<T>
  promise: {
    method: (...args: any[]) => Promise<T>
    params: any[]
  }
  options?: ToastOptions
}

export interface GeneratorToastPayload {
  params: ToastPromiseParams<any>
  success: PayloadActionCreator<string, any>
  error: PayloadActionCreator<string, Error>
  options?: ToastOptions
}
