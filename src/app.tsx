import { Box, Container, CssBaseline, Drawer } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useSystemColorScheme } from "./hooks/system-color-scheme";
import createTheme from "./style/theme";
import { useMemo, useState } from "react";
import { Root } from "./components/root";
import { Navbar } from "./components/navbar";
import { SettingsDrawerBox } from "./components/settings-drawer-box";

const App = () => {
  const systemColorScheme = useSystemColorScheme();

  const theme = useMemo(
    () => createTheme(systemColorScheme),
    [systemColorScheme]
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />

      <Navbar
        onDrawerToggle={() => setSettingsOpen((prev) => !prev)}
        component={"nav"}
      />

      <Box component={"main"} pt={{ xs: 2, md: 3 }}>
        <Container>
          <Root />
        </Container>
      </Box>

      <Drawer
        anchor={"right"}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <SettingsDrawerBox sx={{ width: 400, padding: 2 }} />
      </Drawer>
    </ThemeProvider>
  );
};

export default App;
