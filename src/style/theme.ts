import {
  PaletteMode,
  ThemeOptions,
  createTheme as _createTheme,
  responsiveFontSizes,
} from "@mui/material";
import { amber, deepOrange, grey, teal } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  interface TypographyVariants {
    enormous: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    enormous?: React.CSSProperties;
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

declare module "@mui/material/LinearProgress" {
  interface LinearProgressPropsColorOverrides {
    neutral: true;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    enormous: true;
  }
}

export const createTheme = (mode: PaletteMode) => {
  let theme = _createTheme({
    palette: {
      mode,
      success: {
        main: teal[400],
        light: teal[300],
        dark: teal[500],
      },
      error: {
        main: deepOrange[400],
        light: deepOrange[300],
        dark: deepOrange[500],
      },
    },
    typography: {
      enormous: {
        fontSize: "10rem",
        lineHeight: 1,
      },
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            // Map the new variant to render a <h1> by default
            enormous: "div",
          },
        },
      },
    },
  });

  const derivatedThemeOptions: ThemeOptions = {
    palette: {
      neutral: theme.palette.augmentColor({
        color: mode === "light" ? { main: grey[800] } : { main: grey[200] },
        name: "neutral",
      }),
      warning: theme.palette.augmentColor({
        color: {
          main: amber[500],
          light: amber[400],
          dark: amber[600],
        },
        name: "warning",
      }),
    },
  };

  theme = _createTheme(theme, derivatedThemeOptions);

  theme = responsiveFontSizes(theme, {
    variants: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "subtitle1",
      "subtitle2",
      "body1",
      "body2",
      "button",
      "caption",
      "overline",
      "enormous",
    ],
  });

  return theme;
};

export default createTheme;
