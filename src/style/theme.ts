import {
  PaletteMode,
  createTheme as _createTheme,
  responsiveFontSizes,
} from "@mui/material";

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
  responsiveFontSizes(
    _createTheme({
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
    }),
    {
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
    }
  );

export default createTheme;
