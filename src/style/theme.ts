import {
  PaletteMode,
  ThemeOptions,
  createTheme as _createTheme,
  responsiveFontSizes,
} from "@mui/material";
import { teal } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    expectedSuccess: Palette["primary"];
  }

  interface TypographyVariants {
    enormous: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    enormous?: React.CSSProperties;
  }

  interface PaletteOptions {
    expectedSuccess?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    expectedSuccess: true;
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
      expectedSuccess: theme.palette.augmentColor({
        color: {
          main: teal[400],
        },
        name: "expectedSuccess",
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
