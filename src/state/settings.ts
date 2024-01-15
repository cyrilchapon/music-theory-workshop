import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Interval as TonalInterval } from "tonal";
import { intervalsAtom } from "./board";
import { NoteMode, Settings, settingsDefaultValue } from "./_default";
import { UnreachableCaseError } from "ts-essentials";
import { skipAnswerNoteAtom } from "./answer";

export const settingsAtom = atomWithStorage<Settings>(
  "settings",
  settingsDefaultValue
);
export const switchModeAtom = atom(null, (_get, set) => {
  set(settingsAtom, (prevSettings) => ({
    ...prevSettings,
    mode: prevSettings.mode === NoteMode.Simple ? NoteMode.Alterated : NoteMode.Simple,
  }));

  set(skipAnswerNoteAtom);
});
export const setModeAtom = atom(null, (_get, set, value: NoteMode) => {
  set(settingsAtom, (prevSettings) => ({
    ...prevSettings,
    mode: value,
  }));

  set(skipAnswerNoteAtom);
});
export const toggleIntervalAtom = atom(
  null,
  (_get, set, intervalName: string) => {
    const { length: activeIntervalsCount } = _get(intervalsAtom);

    const interval = TonalInterval.get(intervalName);

    if (interval.empty) {
      throw new Error(`Interval ${intervalName} not found`);
    }

    set(settingsAtom, (prevSettings) => {
      const { mode } = prevSettings;

      const currentIntervalIndex = prevSettings[mode].intervals.findIndex(
        (i) => i.num === interval.num
      );

      if (currentIntervalIndex === -1) {
        throw new Error(`Interval ${intervalName} not in settings`);
      }

      switch (mode) {
        case NoteMode.Simple: {
          // If about to deactivate the last one, cancel
          if (
            activeIntervalsCount <= 1 &&
            prevSettings.simple.intervals[currentIntervalIndex].activated
          ) {
            return prevSettings;
          }

          const updatedSettings: Settings = {
            ...prevSettings,
            simple: {
              intervals: [
                ...prevSettings.simple.intervals.slice(0, currentIntervalIndex),
                {
                  ...prevSettings.simple.intervals[currentIntervalIndex],
                  activated:
                    !prevSettings.simple.intervals[currentIntervalIndex]
                      .activated,
                },
                ...prevSettings.simple.intervals.slice(
                  currentIntervalIndex + 1
                ),
              ],
            },
          };

          return updatedSettings;
        }
        case NoteMode.Alterated: {
          // If about to deactivate the last one, cancel
          if (
            activeIntervalsCount <= 1 &&
            prevSettings.alterated.intervals[currentIntervalIndex].qs[
              interval.q
            ]
          ) {
            return prevSettings;
          }

          const updatedSettings: Settings = {
            ...prevSettings,
            alterated: {
              intervals: [
                ...prevSettings.alterated.intervals.slice(
                  0,
                  currentIntervalIndex
                ),
                {
                  ...prevSettings.alterated.intervals[currentIntervalIndex],
                  qs: {
                    ...prevSettings.alterated.intervals[currentIntervalIndex]
                      .qs,
                    [interval.q]:
                      !prevSettings.alterated.intervals[currentIntervalIndex]
                        .qs[interval.q],
                  },
                },
                ...prevSettings.alterated.intervals.slice(
                  currentIntervalIndex + 1
                ),
              ],
            },
          };
          return updatedSettings;
        }
        default: {
          throw new UnreachableCaseError(mode);
        }
      }
    });

    set(skipAnswerNoteAtom);
  }
);
