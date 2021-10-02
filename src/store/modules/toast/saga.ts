import { all, takeEvery } from "redux-saga/effects"
import { toast as toastAction, asyncToast as asyncToastAction } from "./actions"
import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "bottom-right"
}

function handleToast(action: ReturnType<typeof toastAction>) {
  toast[action.payload.method](action.payload.content, {
    ...defaultOptions,
    ...action.payload.options
  });
}

function* handleAsyncToast(action: ReturnType<typeof asyncToastAction>) {
  yield toast.promise(action.payload.promise, action.payload.params, {
    ...defaultOptions,
    ...action.payload.options
  });
}

export function* saga() {
  yield all([
    takeEvery(toastAction, handleToast),
    takeEvery(asyncToastAction, handleAsyncToast),
  ])
}
