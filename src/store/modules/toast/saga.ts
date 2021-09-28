import { all, takeEvery } from "redux-saga/effects"
import { toast as toastAction, asyncToast as asyncToastAction } from "./actions"
import { toast } from "react-toastify";

function handleToast(action: ReturnType<typeof toastAction>) {
  toast[action.payload.method](action.payload.content, {
    ...action.payload.options
  });
}

function* handleAsyncToast(action: ReturnType<typeof asyncToastAction>) {
  yield toast.promise(action.payload.promise, action.payload.params);
}

export function* saga() {
  yield all([
    takeEvery(toastAction, handleToast),
    takeEvery(asyncToastAction, handleAsyncToast),
  ])
}
