import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Stack,
  // Tooltip,
  Typography,
} from "@mui/material";
import { FunctionComponent, useCallback, useState } from "react";
import {
  UseRequestAnimationFrameCallback,
  useRequestAnimationFrame,
} from "../hooks/animation-frame";
import { NoteInput } from "./note-input";
import { Note, Interval } from "@tonaljs/core";
import {
  intervalsWords,
  qualitiesAbbrWords,
  qualitiesWords,
} from "../constants";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentIntervalAtom,
  currentNoteAtom,
  drawIntervalAtom,
  drawNoteAtom,
} from "../state/board";
import { getExpectedNote } from "../note";
import { settingsAtom } from "../state/settings";
import { NoteMode } from "../state/_default";

export const Root = () => {
  const { mode } = useAtomValue(settingsAtom);
  const currentNote = useAtomValue(currentNoteAtom);
  const currentInterval = useAtomValue(currentIntervalAtom);

  const redrawNote = useSetAtom(drawNoteAtom);
  const redrawInterval = useSetAtom(drawIntervalAtom);

  const expectedNote = getExpectedNote(currentNote, currentInterval, mode);

  const redraw = useCallback(() => {
    redrawNote();
    redrawInterval();
  }, [redrawNote, redrawInterval]);

  const [answerNote, setAnswerNote] = useState<Note | null>(null);

  const [nextDuration, setNextDuration] = useState(2000);

  const reset = useCallback(() => {
    setAnswerNote(null);
    redraw();
  }, [setAnswerNote, redraw]);

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
    (note: Note) => {
      // stopNext();
      setAnswerNote(note);
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
      <Grid
        container
        alignItems={"center"}
        spacing={{ xs: 2, md: 4 }}
        alignSelf={"stretch"}
      >
        <Grid item xs={12} md={6}>
          <Typography textAlign={{ xs: "center", md: "right" }}>
            Quelle est la
            <br />
            <IntervalExpression mode={mode} interval={currentInterval} />
            &nbsp;de
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            textAlign={{ xs: "center", md: "left" }}
            variant="enormous"
            fontFamily="monospace"
          >
            {currentNote.name}
          </Typography>
        </Grid>
      </Grid>

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
          answeredNote={answerNote}
          expectedNote={expectedNote}
        />
      ) : null}
    </Stack>
  );
};

const IntervalExpression: FunctionComponent<{
  interval: Interval;
  mode: NoteMode;
}> = ({ mode, interval }) => (
  // <Tooltip
  //   title={`${intervalsWords[interval.num as keyof typeof intervalsWords]} ${
  //     qualitiesWords[interval.q as keyof typeof qualitiesAbbrWords]
  //   }`}
  // >
  //   <Typography
  //     component={"abbr"}
  //     fontWeight={"bold"}
  //     sx={{ textDecoration: "underline dotted" }}
  //   >
  //     {interval.num}
  //     {<>&nbsp;</>}
  //     {qualitiesAbbrWords[interval.q as keyof typeof qualitiesAbbrWords]}
  //   </Typography>
  // </Tooltip>
  <Typography component="span" fontWeight={"bold"}>
    {intervalsWords[interval.num as keyof typeof intervalsWords]}
    {mode === "alterated" ? (
      <>
        &nbsp;
        {qualitiesWords[interval.q as keyof typeof qualitiesAbbrWords]}
      </>
    ) : null}
  </Typography>
);
