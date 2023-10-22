import { FunctionComponent } from "react";
import { SettingsShift, useSettings } from "../context/settings";
import {
  Box,
  BoxProps,
  FormLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { intervals } from "../constants";
import { capitalize } from "radash";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type SettingsDrawerBoxProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RootComponent extends React.ElementType<any> = "div"
> = BoxProps<RootComponent>;

export const SettingsDrawerBox: FunctionComponent<SettingsDrawerBoxProps> = (
  props
) => {
  const [shifts, setShifts] = useSettings();

  return (
    <Box {...props}>
      <Stack spacing={2}>
        {shifts.map((shift, shiftIndex) => (
          <Grid2 container alignItems={"center"} key={intervals[shiftIndex]}>
            <Grid2 xs={4}>
              <FormLabel component="legend">
                {capitalize(intervals[shiftIndex])}
              </FormLabel>
            </Grid2>

            <Grid2 xs={8}>
              <ToggleButtonGroup
                size="small"
                value={[
                  ...(shift.asc ? [`${intervals[shiftIndex]}-asc`] : []),
                  ...(shift.desc ? [`${intervals[shiftIndex]}-desc`] : []),
                ]}
                onChange={(val) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const shiftLongCode = (val.currentTarget as any)
                    .value as string;
                  const [shiftCode, _shiftSide] = shiftLongCode.split("-");
                  const shiftSide = _shiftSide as "asc" | "desc";

                  setShifts((prevShifts) => {
                    const currentShiftIndex = intervals.indexOf(shiftCode);
                    const updatedCurrentShift: SettingsShift = {
                      ...prevShifts[currentShiftIndex],
                      [shiftSide]: !prevShifts[currentShiftIndex][shiftSide],
                    };
                    return [
                      ...prevShifts.slice(0, currentShiftIndex),
                      updatedCurrentShift,
                      ...prevShifts.slice(currentShiftIndex + 1),
                    ];
                  });
                }}
              >
                <ToggleButton value={`${intervals[shiftIndex]}-asc`}>
                  <ArrowUpwardIcon />
                </ToggleButton>

                <ToggleButton value={`${intervals[shiftIndex]}-desc`}>
                  <ArrowDownwardIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid2>
          </Grid2>
        ))}
      </Stack>
    </Box>
  );
};
