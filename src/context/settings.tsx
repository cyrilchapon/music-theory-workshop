import {
  createContext,
  useContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  FunctionComponent,
  PropsWithChildren,
} from "react";

export type SettingsShift = {
  asc: boolean;
  desc: boolean;
};

export type SettingsContextType = [SettingsShift[], Dispatch<SetStateAction<SettingsShift[]>>];

const settingsContextShiftDefaultValue: SettingsShift[] = [
  { asc: false, desc: false },
  { asc: false, desc: true },
  { asc: false, desc: false },
  { asc: false, desc: true },
  { asc: false, desc: false },
  { asc: false, desc: false },
];

export const SettingsContext = createContext<SettingsContextType>([
  settingsContextShiftDefaultValue,
  (prevState: SetStateAction<SettingsShift[]>) => prevState,
]);

const SettingsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [settings, setSettings] = useState(settingsContextShiftDefaultValue);

  const value = useMemo<SettingsContextType>(
    () => [settings, setSettings],
    [settings, setSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

const SettingsConsumer = SettingsContext.Consumer;

const useSettings = () => useContext(SettingsContext);

export { SettingsProvider, SettingsConsumer, useSettings };
