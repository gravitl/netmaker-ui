
import { ToastContent, ToastOptions, toast } from "react-toastify";

type SecondArgumentType<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : never;
type ToastPromiseParams = SecondArgumentType<typeof toast.promise>

export interface ToastPayload {
  method: "info" | "warn" | "success" | "error"
  content: ToastContent
  options?: ToastOptions
}

export interface AsyncToastPayload {
  params: ToastPromiseParams
  promise: Promise<any>
  options?: ToastOptions
}