import { type ThemeDefinition } from 'vuetify'

const mkpLightBlue = '#42c0eb'
const mkpMediumBlue = '#12a5e2'
const mkpDarkBlue = '#004972'
const mkpLightenGrey1 = '#BDBDBD'
const mkpDarkGrey = '#424242'
const mkpError = '#B00020'
const mkpInfo = '#2196F3'
const mkpWarning = '#EAB308'
const mkpSucces = '#84cc16'
const white = '#F2F0EF'
const mkpSurfaceLight = '#F8F9FA'

export const MKPThemes: any = {
  mkpLightTheme: {
    dark: false,
    colors: {
      background: white,
      surface: '#F8F9FA',
      primary: mkpLightBlue,
      'primary-darken-1': mkpMediumBlue,
      'on-primary': white,
      secondary: mkpDarkBlue,
      'secondary-darken-1': '#018786',
      error: mkpError,
      info: '#2196F3',
      success: mkpSucces,
      warning: mkpWarning,
      text: mkpDarkBlue,
      border: mkpLightenGrey1,
      'border-hover': '#a4a4a4',
      highlightText: mkpDarkBlue,
    },
  } as ThemeDefinition,
  mkpDarkTheme: {
    dark: true,
    colors: {
      background: '#16161d',
      surface: '#2b2b32',
      primary: mkpLightBlue,
      'primary-darken-1': mkpMediumBlue,
      'on-primary': white,
      secondary: mkpLightBlue,
      'secondary-darken-1': mkpLightBlue,
      error: '#FF7575',
      info: '#2196F3',
      success: mkpSucces,
      warning: mkpWarning,
      text: white,
      border: mkpDarkGrey,
      'border-hover': '#4f4f4f',
      highlightText: '#b8e3f6',
    },
  } as ThemeDefinition,
}

export const MKPPortalTheme: any = {
  dark: false,
  colors: {
    background: white,
    surface: mkpSurfaceLight,
    primary: mkpLightBlue,
    secondary: mkpDarkBlue,
    error: mkpError,
    info: mkpInfo,
    success: mkpSucces,
    warning: mkpWarning,
    text: mkpDarkBlue,
    border: mkpLightenGrey1,
    highlightText: mkpDarkBlue,
  },
} as ThemeDefinition
