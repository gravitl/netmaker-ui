
import { ToastContent, ToastOptions, UpdateOptions } from "react-toastify";

// type SecondArgumentType<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : never;

export type ToastPromiseType = string | UpdateOptions
export type ToastPromiseFunctionType<T> = (value: T) => ToastPromiseType
export interface ToastPromiseParams<T, E = any> {
  pending: ToastPromiseType;
  success: ToastPromiseType | ToastPromiseFunctionType<T>;
  error: ToastPromiseType | ToastPromiseFunctionType<E>;
}

export interface ToastPayload {
  method: "info" | "warn" | "success" | "error"
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