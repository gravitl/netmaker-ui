import { all, race, take, takeEvery } from "redux-saga/effects";
import { toast as toastAction } from "./actions";
import { toast, ToastOptions, TypeOptions } from "react-toastify";
import {
  AsyncToastPayload,
  GeneratorToastPayload,
  ToastPromiseFunctionType,
  ToastPromiseType,
} from "./types";
import { getType } from "typesafe-actions";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
};

const defaultPromiseOptions: ToastOptions = {
  rtl: false,
  autoClose: 5000,
  hideProgressBar: false,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  closeOnClick: true,
  draggable: true,
  draggablePercent: 80,
  /* DRAGGABLE_PERCENT */
  draggableDirection: "x",
  /* X */
  role: "alert",
  theme: "light",
  ...defaultOptions,
};

function handleToast(action: ReturnType<typeof toastAction>) {
  toast[action.payload.method](action.payload.content, {
    ...defaultOptions,
    ...action.payload.options,
  });
}

function asyncToastUpdate<T>(
  id: React.ReactText,
  type: TypeOptions,
  param: ToastPromiseType | ToastPromiseFunctionType<T>,
  value: T
) {
  let render;
  if (typeof param === "function") {
    render = param(value);
  } else {
    render = param;
  }
  if (typeof render === "string") {
    toast.update(id, {
      render,
      type,
      isLoading: false,
      ...defaultPromiseOptions,
    });
  } else {
    toast.update(id, { ...defaultPromiseOptions, ...render });
  }
}

export async function asyncToastSaga<T = any>(
  action: AsyncToastPayload<T>
): Promise<T> {
  const id = toast.loading(action.params.pending, {
    ...defaultPromiseOptions,
    autoClose: false,
  });

  try {
    const value = await action.promise.method(...action.promise.params);
    asyncToastUpdate(id, "success", action.params.success, value);
    return value;
  } catch (reason: any) {
    asyncToastUpdate(id, "error", action.params.error, reason.response);
    throw reason;
  }
}

export function* generatorToastSaga(action: GeneratorToastPayload) {
  const id = toast.loading(action.params.pending, {
    ...defaultPromiseOptions,
    autoClose: false,
  });

  const {
    success,
    error,
  }: {
    success?: ReturnType<typeof action.success>;
    error?: ReturnType<typeof action.error>;
  } = yield race({
    success: take(getType(action.success)),
    error: take(getType(action.error)),
  });
  if (success)
    asyncToastUpdate(id, "success", action.params.success, success.payload);
  else if (error)
    asyncToastUpdate(id, "error", action.params.error, error.payload);
}

export function* saga() {
  yield all([takeEvery(toastAction, handleToast)]);
}
