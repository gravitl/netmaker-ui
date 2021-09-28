import { createTheme, Theme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

export const theme = createTheme({
  status: {
    danger: orange[500],
  },
  // palette: {
  //   primary: {
  //     main: '#3f51b5',
  //   },
  //   secondary: {
  //     main: '#fff',
  //   },
  // },
});

let currentTheme = theme

export const useCurrentTheme = () => {
  return currentTheme
}

export const useSetTheme = () => (theme: Theme) => currentTheme = theme