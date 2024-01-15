import { FunctionComponent, useCallback } from "react";
import {
  setModeAtom,
  settingsAtom,
  toggleIntervalAtom,
} from "../state/settings";
import {
  Box,
  BoxProps,
  Checkbox,
  CheckboxProps,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  SwitchProps,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
// import { capitalize } from "radash";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { intervalsWords, qualitiesAbbrWords } from "../constants";
import { Interval, IntervalName } from "@tonaljs/core";
import { useAtomValue, useSetAtom } from "jotai";
import {
  AlteratedSettingsInterval,
  NoteMode,
  SimpleSettingsInterval,
  assertNoteMode,
} from "../state/_default";
import { intervalsAtom } from "../state/board";

type SettingsDrawerBoxProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RootComponent extends React.ElementType<any> = "div"
> = BoxProps<RootComponent>;

export const SettingsDrawerBox: FunctionComponent<SettingsDrawerBoxProps> = (
  props
) => {
  const settings = useAtomValue(settingsAtom);
  const setMode = useSetAtom(setModeAtom);
  const toggleInterval = useSetAtom(toggleIntervalAtom);
  const activeIntervals = useAtomValue(intervalsAtom);

  const canDisable = activeIntervals.length > 1;

  const handleToggleInterval = useCallback(
    (intervalName: string) => {
      toggleInterval(intervalName);
    },
    [toggleInterval]
  );

  const handleModeChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, value: string) => {
      assertNoteMode(value);
      setMode(value)
    },
    [setMode]
  );

  return (
    <Box {...props}>
      <Stack spacing={2}>
        <Box>
          <FormControl>
            <FormLabel>Mode</FormLabel>

            <RadioGroup
              value={settings.mode}
              onChange={handleModeChange}
            >
              <FormControlLabel
                value={NoteMode.Simple}
                control={<Radio />}
                label="Simple"
              />
              <FormControlLabel
                value={NoteMode.Alterated}
                control={<Radio />}
                label="Altérations"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider />

        <Stack spacing={2}>
          {settings.mode === NoteMode.Simple
            ? (
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Intervales</FormLabel>

                <FormGroup>
                {
                  settings.simple.intervals.map((interval) => (
                    <FormControlLabel
                      key={interval.num}
                      control={
                        <SimpleSettingsIntervalCheckbox
                          interval={interval}
                          onToggle={handleToggleInterval}
                          checked={interval.activated}
                          disabled={interval.activated && !canDisable}
                        />
                      }
                      label={
                        intervalsWords[
                          interval.num as keyof typeof intervalsWords
                        ]
                      }
                    />
                  ))
                }
                </FormGroup>
              </FormControl>
            )
            : (
              <>
                <FormLabel component="legend">Intervales</FormLabel>

                {settings.alterated.intervals.map((interval) => (
                  <Grid2 container alignItems={"center"} key={interval.num}>
                    <Grid2 xs={4}>
                      <FormLabel component="legend">
                        {
                          intervalsWords[
                            interval.num as keyof typeof intervalsWords
                          ]
                        }
                      </FormLabel>
                    </Grid2>

                    <Grid2 xs={8} spacing={0}>
                      <AlteratedSettingsIntervalButton
                        interval={interval}
                        onToggle={handleToggleInterval}
                        canDisable={canDisable}
                      />
                    </Grid2>
                  </Grid2>
                ))}
              </>
            )}
        </Stack>

        <Divider />

        <>
          <FormLabel>Réponses</FormLabel>

          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Mélange"
          />
        </>
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

export type SimpleSettingsIntervalCheckboxProps = Omit<
  CheckboxProps,
  "onChange"
> & {
  onToggle: (intervalName: IntervalName) => void;
  interval: SimpleSettingsInterval;
};
export const SimpleSettingsIntervalCheckbox: FunctionComponent<
SimpleSettingsIntervalCheckboxProps
> = ({ onToggle, interval, ...props }) => (
  <Checkbox
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
  canDisable: boolean;
};

export const AlteratedSettingsIntervalButton: FunctionComponent<
  AlteratedSettingsIntervalButtonProps
> = ({ onToggle, interval, canDisable, ...props }) => (
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
    fullWidth
  >
    {(Object.entries(interval.qs) as [Interval["q"], boolean][]).map(
      ([q, activated]) => (
        <ToggleButton
          key={q}
          value={`${interval.num}${q}`}
          sx={{
            fontVariant: "initial",
            textTransform: "none",
          }}
          disabled={activated && !canDisable}
        >
          {/* TODO: write correctly */}
          {qualitiesAbbrWords[q as keyof typeof qualitiesAbbrWords]}
          {/* <ArrowUpwardIcon /> */}
        </ToggleButton>
      )
    )}
  </ToggleButtonGroup>
);
