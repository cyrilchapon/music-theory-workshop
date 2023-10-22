import * as React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export type NavbarProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RootComponent extends React.ElementType<any> = "header"
> = AppBarProps<
  RootComponent,
  {
    onDrawerToggle: () => void;
  }
>;

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  onDrawerToggle,
  ...props
}) => {
  return (
    <>
      <AppBar {...props}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Interval tester
          </Typography>

          {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button sx={{ color: "#fff" }}>
            Coucou
          </Button>
        </Box> */}

          <IconButton
            color="inherit"
            edge="end"
            onClick={onDrawerToggle}
            sx={{ ml: 2 }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Padding mixin */}
      <Toolbar />
    </>
  );
};
