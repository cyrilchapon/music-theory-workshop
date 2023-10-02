export const _simpleBaseNotes = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type SimpleBaseNote = (typeof _simpleBaseNotes)[number];
export const simpleBaseNotes = _simpleBaseNotes as unknown as SimpleBaseNote[];

export const _complexBaseNotes = [
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

export const simpleNth = (nth: number) =>
  simpleBaseNotes.map<NoteTuple<SimpleBaseNote>>((note, index, arr) => [
    note,
    arr[(index + Math.round(nth)) % 7],
  ]);

export const simpleAscSeconds = simpleNth(1);
export const simpleAscThirds = simpleNth(2);
export const simpleAscQuarts = simpleNth(3);
export const simpleAscQuints = simpleNth(4);
export const simpleAscSixths = simpleNth(5);
export const simpleAscSeventh = simpleNth(6);

export const simpleDescSeconds = simpleNth(-1);
export const simpleDescThirds = simpleNth(-2);
export const simpleDescQuarts = simpleNth(-3);
export const simpleDescQuints = simpleNth(-4);
export const simpleDescSixths = simpleNth(-5);
export const simpleDescSeventh = simpleNth(-6);
