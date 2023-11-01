import { Interval as TonalInterval } from "tonal";
import { Interval } from "@tonaljs/core";

export type SimpleSettingsInterval = {
  num: Interval["num"];
  q: Interval["q"];
  activated: boolean;
};

export type AlteratedSettingsInterval = {
  num: Interval["num"];
  qs: Record<Interval["q"], boolean>;
};

export type SettingsInterval =
  | SimpleSettingsInterval
  | AlteratedSettingsInterval;

export type NoteMode = "simple" | "alterated";

export type Settings = {
  mode: NoteMode,
  simple: {
    intervals: SimpleSettingsInterval[]
  },
  alterated: {
    intervals: AlteratedSettingsInterval[]
  }
}

const defaultActivatedSimpleIntervals = ["3", "5"];
const defaultActivatedAlteratedIntervals = ["3M", "5P"];
export const settingsDefaultValue: Settings = {
  mode: 'simple',
  simple: {
    intervals: [0, 2, 4, 5, 7, 9, 11]
    .map(TonalInterval.fromSemitones)
    .map((intervalName) => {
      const interval = TonalInterval.get(intervalName) as Interval;

      return {
        mode: "simple",
        num: interval.num,
        q: interval.q,
        activated: defaultActivatedSimpleIntervals.includes(`${interval.num}`),
      };
    }),
  },
  alterated: {
    intervals: TonalInterval.names().map((intervalName) => {
      const interval = TonalInterval.get(intervalName) as Interval;
  
      const availableQualities =
        interval.type === "perfectable" ? ["d", "P", "A"] : ["d", "m", "M", "A"];
  
      return {
        mode: "alterated",
        num: interval.num,
        qs: availableQualities.reduce<AlteratedSettingsInterval["qs"]>(
          (acc, q) => ({
            ...acc,
            [q]: defaultActivatedAlteratedIntervals.includes(
              `${interval.num}${q}`
            ),
          }),
          {} as AlteratedSettingsInterval["qs"]
        ),
      };
    }),
  }
}

export const getSettingsDefaultValue = (key: string) => {
  const item = localStorage.getItem(key)
  if (item == null) {
    return settingsDefaultValue
  }

  try {
    const parsedSettings = JSON.parse(item) as Settings
    return parsedSettings
  } catch (err) {
    console.error(err)
    return settingsDefaultValue
  }
}