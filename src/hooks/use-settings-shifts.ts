import { useMemo } from "react";
import { useSettings } from "../context/settings";
import { getSignName, intervals } from "../constants";
import { SimpleBaseNote, simpleNth, simpleShifts } from "../note";

type _Shift = {
  shiftIndex: number;
  sign: 1 | -1;
};

type Shift = {
  getNth: (note: SimpleBaseNote) => SimpleBaseNote;
  name: string;
};

export const useSettingsShifts = () => {
  const [settingsShifts] = useSettings();

  const shifts = useMemo(
    () =>
      settingsShifts
        .flatMap<_Shift | null>((settingsShift, shiftIndex) => [
          settingsShift.asc ? { shiftIndex, sign: +1 } : null,
          settingsShift.desc ? { shiftIndex, sign: -1 } : null,
        ])
        .filter((shift): shift is _Shift => shift != null)
        .map<Shift>(({ shiftIndex, sign }) => ({
          getNth: simpleNth(simpleShifts[shiftIndex] * sign),
          name: `${intervals[shiftIndex]} ${getSignName(sign)}`,
        })),
    [settingsShifts]
  );

  return shifts;
};
