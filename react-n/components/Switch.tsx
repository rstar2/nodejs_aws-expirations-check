import { Switch as DefaultSwitch, SwitchProps } from "react-native";

import { useThemeColor } from "./Themed";

export function Switch(
  props: Omit<SwitchProps, "thumbColor" | "trackColor"> & {
    lightThumbColor?: string;
    darkThumbColor?: string;
    lightTrackColor?: string;
    darkTrackColor?: string;
  }
) {
  const {
    lightThumbColor,
    darkThumbColor,
    lightTrackColor,
    darkTrackColor,
    ...otherProps
  } = props;

  const thumbColor = useThemeColor(
    { light: lightThumbColor, dark: darkThumbColor },
    "button"
  );
  const trackColor = useThemeColor(
    { light: lightTrackColor, dark: darkTrackColor },
    "buttonBackground"
  );

  return (
    <DefaultSwitch
      // use same color for on/off
      trackColor={{ true: trackColor, false: trackColor }}
      thumbColor={thumbColor}
	  //   if needed to have different colors when on/off
      //   thumbColor={otherProps.value ? thumbColor : "grey"}
      {...otherProps}
    />
  );
}
