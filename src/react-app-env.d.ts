/// <reference types="react-scripts" />

declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

export declare type Modify<T, R> = Omit<T, keyof R> & R;

export { Theme, ThemeOptions } from '@mui/material/styles'
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions extends DeepPartial<Theme> {
  }
}