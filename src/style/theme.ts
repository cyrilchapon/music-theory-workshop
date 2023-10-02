import { PaletteMode, createTheme as _createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    enormous: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    enormous?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    enormous: true;
  }
}

export const createTheme = (mode: PaletteMode) =>
  _createTheme({
    palette: {
      mode,
    },
    typography: {
      enormous: {
        fontSize: "10rem",
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

export default createTheme;
