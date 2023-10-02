import {
  Box,
  Button,
  Container,
  CssBaseline,
  Drawer,
  LinearProgress,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useSystemColorScheme } from "./hooks/system-color-scheme";
import createTheme from "./style/theme";
import { useCallback, useMemo, useState } from "react";
import { useDraw, useShuffle } from "./hooks/random";
import { useAnimationFrameProgress } from "./hooks/animation-frame";
import { SimpleBaseNote, simpleBaseNotes, simpleAscQuints } from "./note";
import { NoteInput } from "./components/note-input";

const App = () => {
  const systemColorScheme = useSystemColorScheme();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const theme = useMemo(
    () => createTheme(systemColorScheme),
    [systemColorScheme]
  );

  const [shuffledBaseNotes, reshuffle] = useShuffle(simpleBaseNotes);
  const [currentNoteTuple, redraw] = useDraw(simpleAscQuints, true);

  const [answerNote, setAnswerNote] = useState<SimpleBaseNote | null>(null);

  const [progressing, nextProgress, startNext, stopNext] =
    useAnimationFrameProgress(() => {
      reset();
    });

  const reset = useCallback(() => {
    setAnswerNote(null);
    reshuffle();
    redraw();
    stopNext();
  }, [setAnswerNote, reshuffle, redraw, stopNext]);

  const submitAnswer = useCallback(
    (note: SimpleBaseNote) => {
      setAnswerNote(note);
      startNext(note != null && note === currentNoteTuple[1] ? 200 : 2000);
    },
    [setAnswerNote, startNext, currentNoteTuple]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />

      <main>
        <Container>
          <Stack
            alignItems={"center"}
            justifyContent={"flex-start"}
            spacing={3}
          >
            <Typography variant="enormous">{currentNoteTuple[0]}</Typography>

            <Button size="large" onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>

            <Button size="large" onClick={reset}>
              Skip
            </Button>

            <Box alignSelf={"stretch"}>
              <LinearProgress
                variant="determinate"
                value={progressing ? nextProgress : 0}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    transition: "none",
                  },
                }}
              />
            </Box>

            <NoteInput
              onInput={submitAnswer}
              baseNotes={shuffledBaseNotes}
              answeredNote={answerNote}
              expectedNote={currentNoteTuple[1]}
            />
          </Stack>
        </Container>
      </main>

      <Drawer
        anchor={"left"}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Box sx={{ width: 300, padding: 2 }}>
          hey
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default App;
