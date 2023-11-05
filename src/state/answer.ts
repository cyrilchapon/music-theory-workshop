import { atom } from "jotai";
import { Note } from "@tonaljs/core";

export const answerNoteAtom = atom<Note | null>(null);
