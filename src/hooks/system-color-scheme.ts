import { useMediaQuery } from "@mui/material"

export const useSystemColorScheme = () => {
  const systemIsDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  return systemIsDarkMode ? 'dark' : 'light'
}
