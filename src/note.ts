import { Note, NoNote, Interval, NoInterval } from "@tonaljs/core";
import { draw } from "radash";
import { Range, NoteName, Note as TonalNote } from "tonal";
import { NoteMode } from "./state/_default";

// Asserters
export const isNote = (maybeNote: Note | NoNote): maybeNote is Note =>
  !maybeNote.empty;
export const isInterval = (
  maybeInterval: Interval | NoInterval
): maybeInterval is Interval => !maybeInterval.empty;

// Base notes
const baseNoteNames: NoteName[] = Range.chromatic(["A1", "G#2"], {
  sharps: true,
  pitchClass: true,
});

const simpleBaseNoteNames: NoteName[] = Range.chromatic(["A1", "G#2"], {
  sharps: false,
  pitchClass: true,
});

const _baseNotes = baseNoteNames.map(TonalNote.get).filter(isNote);
const _simpleNotes = simpleBaseNoteNames.map(TonalNote.get).filter(isNote);

export const alteratedNotes = _baseNotes;
export const simpleNotes = _simpleNotes.filter((note) => note.alt === 0);

// Draw
const _drawNote = (baseNotes: Note[]): Note[] => {
  const note = draw(baseNotes);
  if (note == null) {
    return [];
  }

  const enharmonic = TonalNote.get(TonalNote.enharmonic(note.name));

  return [
    note,
    ...(enharmonic.empty || enharmonic == note ? [] : [enharmonic]),
  ];
};

export const drawNote = (baseNotes: Note[]): Note | null => {
  const noteWithEnharmonics = _drawNote(baseNotes);
  return draw(noteWithEnharmonics);
};

// Input
export const simpleInputNotes = simpleNotes;
export type InputNoteGroup = {
  letter: NoteName;
  notes: Note[];
};
export const alteratedInputNotes = simpleNotes.map<InputNoteGroup>((note) => ({
  letter: note.letter,
  notes: [
    TonalNote.get(`${note.letter}bb`) as Note,
    TonalNote.get(`${note.letter}b`) as Note,
    TonalNote.get(`${note.letter}`) as Note,
    TonalNote.get(`${note.letter}#`) as Note,
    TonalNote.get(`${note.letter}##`) as Note,
  ],
}));

// Expectation
export const simplify = (note: Note): Note => {
  const simpleNote = TonalNote.get(note.letter);

  if (!isNote(simpleNote)) {
    throw new TypeError(`Cannot simplify ${note.name}`);
  }

  return simpleNote;
};

export const getExpectedNote = (
  note: Note,
  interval: Interval,
  mode: NoteMode
) => {
  const expectedAlteratedNote = TonalNote.get(
    TonalNote.transpose(note.name, interval)
  );

  if (!isNote(expectedAlteratedNote)) {
    throw new TypeError(`Cannot transpose ${note.name} by ${interval.name}`);
  }

  const expectedNote =
    mode === NoteMode.Simple ? simplify(expectedAlteratedNote) : expectedAlteratedNote;

  return expectedNote;
};
