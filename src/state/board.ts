import { atom } from "jotai";
import { settingsAtom } from "./settings";
import { Interval as TonalInterval, IntervalName } from "tonal";
import {
  alteratedNotes,
  drawNote,
  getExpectedNote,
  isInterval,
  simpleNotes,
} from "../note";
import { draw, memo } from "radash";
import {
  AlteratedSettingsInterval,
  NoteMode,
  SimpleSettingsInterval,
  getSettingsDefaultValue,
} from "./_default";

const _flattenSimpleSettingsIntervals = (
  settingsIntervals: SimpleSettingsInterval[]
) => {
  return settingsIntervals
    .filter(({ activated }) => activated)
    .map<IntervalName>(({ num, q }) => `${num}${q}`)
    .map((intervalName) => TonalInterval.get(intervalName))
    .filter(isInterval);
};
const flattenSimpleSettingsIntervals = memo(_flattenSimpleSettingsIntervals);

const _flattenAlteratedSettingsIntervals = (
  settingsIntervals: AlteratedSettingsInterval[]
) =>
  settingsIntervals.flatMap((settingsInterval) =>
    Object.entries(settingsInterval.qs)
      .filter(([, activated]) => activated)
      .map<IntervalName>(([q]) => `${settingsInterval.num}${q}`)
      .map((intervalName) => TonalInterval.get(intervalName))
      .filter(isInterval)
  );
const flattenAlteratedSettingsIntervals = memo(
  _flattenAlteratedSettingsIntervals
);

export const intervalsAtom = atom((get) => {
  const settings = get(settingsAtom);

  if (settings.mode === NoteMode.Simple) {
    return flattenSimpleSettingsIntervals(settings.simple.intervals);
  } else {
    return flattenAlteratedSettingsIntervals(settings.alterated.intervals);
  }
});

export const baseNotesAtom = atom((get) => {
  const settings = get(settingsAtom);
  return settings.mode === NoteMode.Simple ? simpleNotes : alteratedNotes;
});

const initialSettings = getSettingsDefaultValue("settings");

const drawnNote = drawNote(
  initialSettings.mode === NoteMode.Simple ? simpleNotes : alteratedNotes
);
const drawnInterval = draw(
  initialSettings.mode === NoteMode.Simple
    ? flattenSimpleSettingsIntervals(initialSettings.simple.intervals)
    : flattenAlteratedSettingsIntervals(initialSettings.alterated.intervals)
);

if (drawnNote == null) {
  throw new Error("Drawn note is null");
}
if (drawnInterval == null) {
  throw new Error("Drawn interval is null");
}

export const currentNoteAtom = atom(drawnNote);
export const currentIntervalAtom = atom(drawnInterval);

export const drawNoteAtom = atom(null, (_get, set) => {
  const baseNotes = _get(baseNotesAtom);
  const drawnNote = drawNote(baseNotes);
  if (drawnNote == null) {
    throw new Error("Drawn note is null");
  }
  set(currentNoteAtom, drawnNote);
});
export const drawIntervalAtom = atom(null, (_get, set) => {
  const intervals = _get(intervalsAtom);
  const drawnInterval = draw(intervals);
  if (drawnInterval == null) {
    throw new Error("Drawn interval is null");
  }
  set(currentIntervalAtom, drawnInterval);
});
export const expectedNoteAtom = atom((get) => {
  const { mode } = get(settingsAtom);
  const currentNote = get(currentNoteAtom);
  const currentInterval = get(currentIntervalAtom);

  const expectedNote = getExpectedNote(currentNote, currentInterval, mode);

  return expectedNote;
});
