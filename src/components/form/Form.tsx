import React from "react";
import { Button } from "@mui/material";
import { useForm, SubmitHandler, Control } from "react-hook-form";

export const FormContext = React.createContext<{
  control: Control<any, object>
  disabled: boolean
}>({disabled: false, control: {} as any});

export function NmForm<T>(props: {
  initialState: T;
  disabled?: boolean;
  onSubmit: SubmitHandler<T>;
  children?: React.ReactNode;
}) {
  const { handleSubmit, reset, control } = useForm<T>({
    defaultValues: props.initialState as any,
  });

  return (
    <FormContext.Provider value={{
      control,
      disabled: props.disabled || false
      }}>
      <form>
        {/* {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { control });
          }
          return child;
        })} */}
        {props.children}
        <br />
        <Button onClick={handleSubmit(props.onSubmit)}>Submit</Button>
        <Button onClick={() => reset()} variant={"outlined"}>
          Reset
        </Button>
      </form>
    </FormContext.Provider>
  );
}
