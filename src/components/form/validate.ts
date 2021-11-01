import {
  UnpackNestedValue,
  FieldError,
  ResolverResult,
  FieldErrors,
  DeepMap,
  UnionLike,
  DeepPartial,
  Resolver,
} from 'react-hook-form'

export function validate<T>(validators: {
  [K in keyof UnpackNestedValue<T>]?: (
    value: UnpackNestedValue<T>[K], formData: UnpackNestedValue<T> 
  ) => FieldError | undefined;
}): Resolver<T> {
  return (data: UnpackNestedValue<T>): ResolverResult<T> => {
    const keys = Object.keys(data) as Array<keyof UnpackNestedValue<T>>
    let hasError = false
    const errors = {} as FieldErrors<T> //{ [K in keyof T]?: ({ message: string, type: string } | undefined)};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const validator = validators[key]
      if (validator) {
        const error = validator(data[key], data);
        if (error) {
          hasError = true
          errors[key as keyof FieldErrors<T>] =
            error as any
        }
      }
    }

    if (hasError) {
      return {
        errors,
        values: {},
      }
    }
    return {
      errors: {},
      values: data,
    }
  }
}
