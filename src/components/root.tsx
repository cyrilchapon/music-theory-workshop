import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useDraw, useShuffle } from "../hooks/random";
import { SimpleBaseNote, simpleBaseNotes } from "../note";
import {
  UseRequestAnimationFrameCallback,
  useRequestAnimationFrame,
} from "../hooks/animation-frame";
import { useSettingsShifts } from "../hooks/use-settings-shifts";
import { NoteInput } from "./note-input";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export const Root = () => {
  const shifts = useSettingsShifts();

  const [shuffledBaseNotes, reshuffle] = useShuffle(simpleBaseNotes);
  const [_currentNote, redrawNote] = useDraw(simpleBaseNotes, true);
  const currentNote = _currentNote!;
  const [currentShift, redrawShift] = useDraw(shifts);

  const expectedNote =
    currentShift != null ? currentShift.getNth(currentNote) : null;

  const [answerNote, setAnswerNote] = useState<SimpleBaseNote | null>(null);

  const [nextDuration, setNextDuration] = useState(2000);

  const reset = useCallback(() => {
    setAnswerNote(null);
    reshuffle();
    redrawNote();
    redrawShift();
  }, [setAnswerNote, reshuffle, redrawNote, redrawShift]);

  const [nextProgress, setNextProgress] = useState(0);
  const handleTick = useCallback<UseRequestAnimationFrameCallback>(
    ({ time }) => {
      const progress = (time / nextDuration) * 100;
      setNextProgress(progress);
    },
    [nextDuration, setNextProgress]
  );

  const [start, pause, startNext, stopNext] = useRequestAnimationFrame(
    handleTick,
    {
      stopValue: nextDuration,
      autoStopCb: reset,
    }
  );

  const progressing = start && !pause;

  const handleSubmitAnswer = useCallback(
    (note: SimpleBaseNote) => {
      // stopNext();
      setAnswerNote(note);
      console.log("submit");
      setNextDuration(note != null && note === expectedNote ? 200 : 2000);
      startNext();
    },
    [setAnswerNote, startNext, setNextDuration, expectedNote]
  );

  const handleSkip = useCallback(() => {
    stopNext();
    reset();
  }, [stopNext, reset]);

  return (
    <Stack alignItems={"center"} justifyContent={"flex-start"} spacing={3}>
      <Grid2 container alignItems={"center"} spacing={{ xs: 2, md: 4 }}>
        <Grid2 xs={12} md={6}>
          <Typography textAlign={{ xs: "center", md: "right" }}>
            <>
              {currentShift != null ? (
                <>
                  Quelle est la <strong>{currentShift.name}</strong> de
                </>
              ) : (
                <>Pas d'intervalle sélectionné</>
              )}
            </>
          </Typography>
        </Grid2>

        <Grid2 xs={12} md={6}>
          <Typography
            textAlign={{ xs: "center", md: "left" }}
            variant="enormous"
          >
            {currentNote}
          </Typography>
        </Grid2>
      </Grid2>

      <Button size="large" onClick={handleSkip}>
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

      {expectedNote != null ? (
        <NoteInput
          onInput={handleSubmitAnswer}
          baseNotes={shuffledBaseNotes}
          answeredNote={answerNote}
          expectedNote={expectedNote}
        />
      ) : null}
    </Stack>
  );
};
