import { atom } from "jotai";
import { Note } from "@tonaljs/core";
import { drawIntervalAtom, drawNoteAtom, expectedNoteAtom } from "./board";

const _answerNoteAtom = atom<Note | null>(null);
const _answerProgressTimeout = atom<NodeJS.Timeout | null>(null);

const _answerProgressIntervalAtom = atom<number | null>(null);

export const answerProgressIntervalAtom = atom((get) =>
  get(_answerProgressIntervalAtom)
);

export const stopProgressTimeoutAtom = atom(null, (get, set) => {
  const previousTimeout = get(_answerProgressTimeout);
  if (previousTimeout != null) {
    clearTimeout(previousTimeout);
  }
  set(_answerProgressTimeout, null);
})

export const skipAnswerNoteAtom = atom(null, (_get, set) => {
  set(stopProgressTimeoutAtom)

  set(_answerNoteAtom, null);
  set(drawNoteAtom);
  set(drawIntervalAtom);
  set(_answerProgressIntervalAtom, null);
});

export const answerNoteAtom = atom(
  (get) => {
    return get(_answerNoteAtom);
  },
  (get, set, note: Note) => {
    set(stopProgressTimeoutAtom);

    const expectedNote = get(expectedNoteAtom);
    const delayToNext = note === expectedNote ? 500 : 2000;

    set(_answerNoteAtom, note);
    set(_answerProgressIntervalAtom, delayToNext);

    const timeout = setTimeout(
      () => {
        set(_answerNoteAtom, null);
        set(drawNoteAtom);
        set(drawIntervalAtom);
        set(_answerProgressIntervalAtom, null);
        set(_answerProgressTimeout, null);
      },
      note === expectedNote ? 500 : 2000
    );

    set(_answerProgressTimeout, timeout);
  }
);
