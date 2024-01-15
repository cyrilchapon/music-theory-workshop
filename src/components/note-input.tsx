import {
  Button,
  ButtonGroup,
  ButtonProps,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Note } from "@tonaljs/core";
import { FunctionComponent } from "react";
import { alteratedInputNotes, simpleInputNotes } from "../note";
import { useAtomValue } from "jotai";
import { settingsAtom } from "../state/settings";
import { NoteMode } from "../state/_default";

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
      <Grid2 container justifyContent={"center"} spacing={2}>
        {mode === NoteMode.Simple
          ? simpleInputNotes.map((note) => (
              <Grid2
                container
                key={note.letter}
                xs={4}
                sm={3}
                md={"auto"}
                spacing={0}
                justifyContent={"center"}
              >
                <NoteButton
                  note={note}
                  answeredNote={answeredNote}
                  expectedNote={expectedNote}
                  onClick={answeredNote == null ? onInput : null}
                  size={isMobile ? "small" : "large"}
                />
              </Grid2>
            ))
          : alteratedInputNotes.map((noteGroup) => (
              <Grid2 key={noteGroup.letter} xs={12} sm={6} md={4} lg={3}>
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
              </Grid2>
            ))}
      </Grid2>
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
            : // Are notes enharmonics ?
            expectedNote.height === answeredNote.height
            ? "warning"
            : "error"
          : // Answer was right ?
          expectedNote === answeredNote
          ? "neutral"
          : // Current note was the expected one ?
          expectedNote === note
          ? "success"
          : "neutral"
        : "neutral"
    }
    sx={{ textTransform: "none", fontFamily: "monospace" }}
  >
    {note.name}
  </Button>
);
