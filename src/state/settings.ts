import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Interval as TonalInterval } from "tonal";
import { drawIntervalAtom, drawNoteAtom } from "./board";
import { Settings, settingsDefaultValue } from "./_default";

export const settingsAtom = atomWithStorage<Settings>(
  "settings",
  settingsDefaultValue
);
export const switchModeAtom = atom(null, (_get, set) => {
  set(settingsAtom, (prevSettings) => ({
    ...prevSettings,
    mode: prevSettings.mode === "simple" ? "alterated" : "simple",
  }));

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
      const currentIntervalIndex = prevSettings[prevSettings.mode].intervals.findIndex(
        (i) => i.num === interval.num
      );

      if (currentIntervalIndex === -1) {
        throw new Error(`Interval ${intervalName} not in settings`);
      }

      const updatedSettings: Settings =
        prevSettings.mode === "simple"
          ? {
              ...prevSettings,
              simple: {
                intervals: [
                  ...prevSettings.simple.intervals.slice(0, currentIntervalIndex),
                  {
                    ...prevSettings.simple.intervals[currentIntervalIndex],
                    activated:
                      !prevSettings.simple.intervals[currentIntervalIndex].activated,
                  },
                  ...prevSettings.simple.intervals.slice(currentIntervalIndex + 1),
                ],
              }
            }
          : {
              ...prevSettings,
              alterated: {
                intervals: [
                  ...prevSettings.alterated.intervals.slice(0, currentIntervalIndex),
                  {
                    ...prevSettings.alterated.intervals[currentIntervalIndex],
                    qs: {
                      ...prevSettings.alterated.intervals[currentIntervalIndex].qs,
                      [interval.q]:
                        !prevSettings.alterated.intervals[currentIntervalIndex].qs[
                          interval.q
                        ],
                    },
                  },
                  ...prevSettings.alterated.intervals.slice(currentIntervalIndex + 1),
                ],
              }
            };

      return updatedSettings;
    });

    set(drawNoteAtom);
    set(drawIntervalAtom);
  }
);
