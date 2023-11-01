import { FunctionComponent, useCallback } from "react";
import {
  settingsAtom,
  switchModeAtom,
  toggleIntervalAtom,
} from "../state/settings";
import {
  Box,
  BoxProps,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Stack,
  Switch,
  SwitchProps,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
// import { capitalize } from "radash";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { intervalsWords, qualitiesAbbrWords } from "../constants";
import { Interval, IntervalName } from "@tonaljs/core";
import { useAtomValue, useSetAtom } from "jotai";
import {
  AlteratedSettingsInterval,
  SimpleSettingsInterval,
} from "../state/_default";

type SettingsDrawerBoxProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RootComponent extends React.ElementType<any> = "div"
> = BoxProps<RootComponent>;

export const SettingsDrawerBox: FunctionComponent<SettingsDrawerBoxProps> = (
  props
) => {
  const settings = useAtomValue(settingsAtom);
  const switchMode = useSetAtom(switchModeAtom);
  const toggleInterval = useSetAtom(toggleIntervalAtom);

  const handleToggleInterval = useCallback(
    (intervalName: string) => {
      toggleInterval(intervalName);
    },
    [toggleInterval]
  );

  const handleModeChange = useCallback(() => {
    switchMode();
  }, [switchMode]);

  return (
    <Box {...props}>
      <Stack spacing={2}>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.mode === "alterated"}
                onChange={handleModeChange}
              />
            }
            label="Altérations"
          />
        </Box>

        <Divider />

        <Stack spacing={2}>
          {settings.mode === "simple"
            ? settings.simple.intervals.map((interval) => (
                <Grid container alignItems={"center"} key={interval.num}>
                  <Grid item xs={4}>
                    <FormLabel component="legend">
                      {
                        intervalsWords[
                          interval.num as keyof typeof intervalsWords
                        ]
                      }
                    </FormLabel>
                  </Grid>

                  <Grid item xs={8}>
                    <SimpleSettingsIntervalSwitch
                      interval={interval}
                      onToggle={handleToggleInterval}
                      checked={interval.activated}
                    />
                  </Grid>
                </Grid>
              ))
            : settings.alterated.intervals.map((interval) => (
                <Grid container alignItems={"center"} key={interval.num}>
                  <Grid item xs={4}>
                    <FormLabel component="legend">
                      {
                        intervalsWords[
                          interval.num as keyof typeof intervalsWords
                        ]
                      }
                    </FormLabel>
                  </Grid>

                  <Grid item xs={8}>
                    <AlteratedSettingsIntervalButton
                      interval={interval}
                      onToggle={handleToggleInterval}
                    />
                  </Grid>
                </Grid>
              ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export type SimpleSettingsIntervalSwitchProps = Omit<
  SwitchProps,
  "onChange"
> & {
  onToggle: (intervalName: IntervalName) => void;
  interval: SimpleSettingsInterval;
};
export const SimpleSettingsIntervalSwitch: FunctionComponent<
  SimpleSettingsIntervalSwitchProps
> = ({ onToggle, interval, ...props }) => (
  <Switch
    onChange={onToggle.bind(null, `${interval.num}${interval.q}`)}
    {...props}
  />
);

export type AlteratedSettingsIntervalButtonProps = Omit<
  ToggleButtonGroupProps,
  "value" | "onChange"
> & {
  onToggle: (intervalName: IntervalName) => void;
  interval: AlteratedSettingsInterval;
};

export const AlteratedSettingsIntervalButton: FunctionComponent<
  AlteratedSettingsIntervalButtonProps
> = ({ onToggle, interval, ...props }) => (
  <ToggleButtonGroup
    {...props}
    size="small"
    value={Object.entries(interval.qs)
      .filter(([, activated]) => activated)
      .map(([q]) => `${interval.num}${q}`)}
    onChange={(val) => {
      const intervalName = (val.currentTarget as HTMLButtonElement).value;

      onToggle(intervalName);
    }}
  >
    {(Object.entries(interval.qs) as [Interval["q"], boolean][]).map(([q]) => (
      <ToggleButton
        key={q}
        value={`${interval.num}${q}`}
        sx={{
          fontVariant: "initial",
          textTransform: "none",
          width: q === "P" ? 100 : 50,
        }}
      >
        {/* TODO: write correctly */}
        {qualitiesAbbrWords[q as keyof typeof qualitiesAbbrWords]}
        {/* <ArrowUpwardIcon /> */}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);
