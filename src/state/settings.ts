import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Interval as TonalInterval } from "tonal";
import { drawIntervalAtom, drawNoteAtom } from "./board";
import {
  Settings,
  alteratedSettingsDefaultValue,
  settingsDefaultValue,
  simpleSettingsDefaultValue,
} from "./_default";

export const settingsAtom = atomWithStorage<Settings>(
  "settings",
  settingsDefaultValue
);
export const switchModeAtom = atom(null, (_get, set) => {
  set(settingsAtom, (prevSettings) =>
    prevSettings.mode === "simple"
      ? alteratedSettingsDefaultValue
      : simpleSettingsDefaultValue
  );

  set(drawNoteAtom);
  set(drawIntervalAtom);
});
export const toggleIntervalAtom = atom(
  null,
  (_get, set, intervalName: string) => {
    const interval = TonalInterval.get(intervalName);

    if (interval.empty) {
      throw new Error(`Interval ${intervalName} not found`);
    }

    set(settingsAtom, (prevSettings) => {
      const currentIntervalIndex = prevSettings.intervals.findIndex(
        (i) => i.num === interval.num
      );

      if (currentIntervalIndex === -1) {
        throw new Error(`Interval ${intervalName} not in settings`);
      }

      const updatedSettings: Settings =
        prevSettings.mode === "simple"
          ? {
              ...prevSettings,
              intervals: [
                ...prevSettings.intervals.slice(0, currentIntervalIndex),
                {
                  ...prevSettings.intervals[currentIntervalIndex],
                  activated:
                    !prevSettings.intervals[currentIntervalIndex].activated,
                },
                ...prevSettings.intervals.slice(currentIntervalIndex + 1),
              ],
            }
          : {
              ...prevSettings,
              intervals: [
                ...prevSettings.intervals.slice(0, currentIntervalIndex),
                {
                  ...prevSettings.intervals[currentIntervalIndex],
                  qs: {
                    ...prevSettings.intervals[currentIntervalIndex].qs,
                    [interval.q]:
                      !prevSettings.intervals[currentIntervalIndex].qs[
                        interval.q
                      ],
                  },
                },
                ...prevSettings.intervals.slice(currentIntervalIndex + 1),
              ],
            };

      return updatedSettings;
    });

    set(drawNoteAtom);
    set(drawIntervalAtom);
  }
);
