import React from "react";
import { Button, ExtendButtonBase, ButtonTypeMap } from "@mui/material";
import {
  useForm,
  SubmitHandler,
  Control,
  UnpackNestedValue,
  Resolver,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormContext = React.createContext<{
  control: Control<any, object>;
  disabled: boolean;
}>({ disabled: false, control: {} as any });

interface FormProps<T> {
  initialState: UnpackNestedValue<T>;
  disabled?: boolean;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  onSubmit: SubmitHandler<T>;
  children?: React.ReactNode;
  submitProps?: Omit<ExtendButtonBase<ButtonTypeMap>, "onChange">;
  resetProps?: Omit<ExtendButtonBase<ButtonTypeMap>, "onChange">;
  resolver?: Resolver<T, object>;
}

export function NmForm<T>({
  initialState,
  disabled,
  showReset,
  submitText,
  resetText,
  children,
  onSubmit,
  submitProps,
  resetProps,
  resolver,
}: FormProps<T>) {
  const { handleSubmit, reset, control } = useForm<T>({
    defaultValues: initialState,
    resolver,
  });

  const { t } = useTranslation();

  return (
    <FormContext.Provider
      value={{
        control,
        disabled: disabled || false,
      }}
    >
      <form>
        {children}
        <br />
        <Button {...submitProps} onClick={handleSubmit(onSubmit)}>
          {submitText ? submitText : t("common.submit")}
        </Button>
        {showReset && (
          <Button {...resetProps} onClick={() => reset()} variant={"outlined"}>
            {resetText ? resetText : t("common.reset")}
          </Button>
        )}
      </form>
    </FormContext.Provider>
  );
}
