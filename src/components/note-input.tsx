import { Button, Stack } from "@mui/material";
import { BaseNote } from "../note";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export type NoteInputProps<TNote extends BaseNote> = {
  onInput: (note: TNote) => void;
  baseNotes: TNote[];
  expectedNote: TNote;
  answeredNote: TNote | null;
};

export const NoteInput = <TNote extends BaseNote>({
  onInput,
  baseNotes,
  expectedNote,
  answeredNote,
}: NoteInputProps<TNote>) => {
  return (
    <Stack spacing={2} alignItems="center">
      <Grid2 container justifyContent={"center"} spacing={2}>
        {baseNotes.map((note) => (
          <Grid2 key={note} xs={6} sm={4} md={3}>
            <Button
              onClick={
                answeredNote == null ? onInput.bind(null, note) : undefined
              }
              fullWidth
              variant={
                answeredNote != null &&
                (answeredNote === note || expectedNote === note)
                  ? "contained"
                  : "outlined"
              }
              color={
                // Some answer was provided
                answeredNote != null
                  ? // Current note was the answered one ?
                    answeredNote === note
                    ? // Answer was right?
                      expectedNote === answeredNote
                      ? "success"
                      : "error"
                    : // Answer was right ?
                    expectedNote === answeredNote
                    ? "primary"
                    : // Current note was the expected one ?
                    expectedNote === note
                    ? "warning"
                    : "primary"
                  : "primary"
              }
            >
              {note}
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
};
