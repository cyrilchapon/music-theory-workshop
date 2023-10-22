const _simpleBaseNotes = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type SimpleBaseNote = (typeof _simpleBaseNotes)[number];
export const simpleBaseNotes = _simpleBaseNotes as unknown as SimpleBaseNote[];

const _complexBaseNotes = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
] as const;
export type ComplexBaseNote = (typeof _complexBaseNotes)[number];
export const complexBaseNotes =
  _complexBaseNotes as unknown as ComplexBaseNote[];

export type BaseNote = SimpleBaseNote | ComplexBaseNote;

export type NoteTuple<BaseNote extends SimpleBaseNote | ComplexBaseNote> = [
  left: BaseNote,
  right: BaseNote
];

const _simpleShifts = [1, 2, 3, 4, 5, 6, 7] as const;
export type SimpleShift = (typeof _simpleShifts)[number];
export const simpleShifts = _simpleShifts as unknown as SimpleShift[];

export const simpleNth = (nth: number) => (note: SimpleBaseNote) => {
  const nthIndex = (simpleBaseNotes.indexOf(note) + Math.round(nth)) % 7;
  return simpleBaseNotes.at(nthIndex)!;
};
