import {
  Button,
  ButtonGroup,
  ButtonProps,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Note } from "@tonaljs/core";
import { FunctionComponent } from "react";
import { alteratedInputNotes, simpleInputNotes } from "../note";
import { useAtomValue } from "jotai";
import { settingsAtom } from "../state/settings";

export type NoteInputProps = {
  onInput: (note: Note) => void;
  expectedNote: Note;
  answeredNote: Note | null;
};

export const NoteInput = ({
  onInput,
  expectedNote,
  answeredNote,
}: NoteInputProps) => {
  const { mode } = useAtomValue(settingsAtom);
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Stack spacing={2} alignItems="center">
      <Grid container justifyContent={"center"} spacing={2}>
        {mode === "simple"
          ? simpleInputNotes.map((note) => (
              <Grid
                item
                container
                key={note.letter}
                xs={4}
                sm={3}
                md={"auto"}
                justifyContent={"center"}
              >
                <NoteButton
                  note={note}
                  answeredNote={answeredNote}
                  expectedNote={expectedNote}
                  onClick={answeredNote == null ? onInput : null}
                  size={isMobile ? "small" : "large"}
                />
              </Grid>
            ))
          : alteratedInputNotes.map((noteGroup) => (
              <Grid item key={noteGroup.letter} xs={12} sm={6} md={4} lg={3}>
                <ButtonGroup size="small" fullWidth>
                  {noteGroup.notes.map((note) => (
                    <NoteButton
                      key={note.name}
                      fullWidth
                      note={note}
                      answeredNote={answeredNote}
                      expectedNote={expectedNote}
                      onClick={answeredNote == null ? onInput : null}
                    />
                  ))}
                </ButtonGroup>
              </Grid>
            ))}
      </Grid>
    </Stack>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoteButtonProps<RootComponent extends React.ElementType<any> = "button"> =
  ButtonProps<
    RootComponent,
    {
      note: Note;
      answeredNote: Note | null;
      expectedNote: Note;
      onClick: ((note: Note) => void) | null;
    }
  >;

export const NoteButton: FunctionComponent<NoteButtonProps> = ({
  note,
  answeredNote,
  expectedNote,
  onClick,
  ...props
}) => (
  <Button
    {...props}
    onClick={onClick != null ? onClick.bind(null, note) : undefined}
    variant={
      answeredNote != null && (answeredNote === note || expectedNote === note)
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
    sx={{ textTransform: "none", fontFamily: "monospace" }}
  >
    {note.name}
  </Button>
);
