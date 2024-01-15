import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { FunctionComponent, useCallback } from "react";
import { NoteInput } from "./note-input";
import { Note, Interval } from "@tonaljs/core";
import {
  intervalsWords,
  qualitiesAbbrWords,
  qualitiesWords,
} from "../constants";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentIntervalAtom,
  currentNoteAtom,
  expectedNoteAtom,
} from "../state/board";
import { settingsAtom } from "../state/settings";
import { NoteMode } from "../state/_default";
import {
  answerNoteAtom,
  answerProgressIntervalAtom,
  skipAnswerNoteAtom,
} from "../state/answer";

export const Root = () => {
  const { mode } = useAtomValue(settingsAtom);
  const currentNote = useAtomValue(currentNoteAtom);
  const currentInterval = useAtomValue(currentIntervalAtom);
  const expectedNote = useAtomValue(expectedNoteAtom);

  const [answerNote, setAnswerNote] = useAtom(answerNoteAtom);
  const skipNote = useSetAtom(skipAnswerNoteAtom);
  const answerProgressInterval = useAtomValue(answerProgressIntervalAtom);

  const progressing = answerProgressInterval != null;

  const handleSubmitAnswer = useCallback(
    (note: Note) => {
      setAnswerNote(note);
    },
    [setAnswerNote]
  );

  const handleSkip = useCallback(() => {
    skipNote();
  }, [skipNote]);

  return (
    <Stack alignItems={"center"} justifyContent={"flex-start"} spacing={3}>
      <Grid2
        container
        alignItems={"center"}
        spacing={{ xs: 2, md: 4 }}
        alignSelf={"stretch"}
      >
        <Grid2 xs={6}>
          <Typography textAlign={"right"}>
            Quelle est la
            <br />
            <IntervalExpression mode={mode} interval={currentInterval} />
            &nbsp;de
          </Typography>
        </Grid2>

        <Grid2 xs={6}>
          <Typography
            textAlign={"left"}
            variant="enormous"
            fontFamily="monospace"
          >
            {currentNote.name}
          </Typography>
        </Grid2>
      </Grid2>

      <Button size="large" color="neutral" variant="text" onClick={handleSkip}>
        Passer
      </Button>

      <Box alignSelf={"stretch"}>
        <LinearProgress
          variant="determinate"
          value={progressing ? 100 : 0}
          color={
            progressing
              ? answerNote === expectedNote
                ? "success"
                : answerNote?.height === expectedNote.height
                ? "warning"
                : "error"
              : "neutral"
          }
          sx={{
            "& .MuiLinearProgress-bar": {
              transitionDuration: progressing
                ? `${answerProgressInterval}ms`
                : "0s",
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
  <Typography component="span" fontWeight={"bold"}>
    {intervalsWords[interval.num as keyof typeof intervalsWords]}
    {mode === NoteMode.Alterated ? (
      <>
        &nbsp;
        {qualitiesWords[interval.q as keyof typeof qualitiesAbbrWords]}
      </>
    ) : null}
  </Typography>
);
