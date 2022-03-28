import { createTheme } from '@mui/material/styles'
import { orange } from '@mui/material/colors'
import { ThemeOptions, PaletteMode } from '@mui/material'

// file for theme choices
const netmakerColors = {
  purple: '#73509f',
  blue: '#119da4',
  green: '#0ead69',
  orange: '#fd4c41',
  black: '#110b35', 
  white: '#f5f5f5',
}

export const darkTheme = createTheme({
    status: {
      danger: orange[500],
    },
    palette: {
      mode: 'dark' as PaletteMode,
      primary: {
        main: netmakerColors.blue,
      },
      secondary: {
        main: netmakerColors.orange,
      },
      common: {
        black: netmakerColors.black,
        white: netmakerColors.white,
      },
      // background: {
      //   paper: netmakerColors.black,
      // },
    },
} as ThemeOptions)

export const lightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: netmakerColors.blue,
    },
    secondary: {
      main: netmakerColors.orange,
    },
    common: {
      black: netmakerColors.black,
      white: netmakerColors.white,
    },
  },
  status: {
    danger: netmakerColors.orange,
  },
} as ThemeOptions)

// let currentTheme = darkTheme

export const useCurrentTheme = (mode: 'light' | 'dark') => {
  if (mode === 'light') {
    return lightTheme
  }
  return darkTheme
}

// export const useSetTheme = () => (theme: Theme) => (currentTheme = theme)
