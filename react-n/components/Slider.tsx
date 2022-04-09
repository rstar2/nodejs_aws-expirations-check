import DefaultSlider, {
  SliderProps,
  SliderRef,
} from "@react-native-community/slider";

import { useThemeColor } from "./Themed";

export function Slider(
  props: SliderProps & {
    lightMinTrackColor?: string;
    darkMinTrackColor?: string;
    lightMaxTrackColor?: string;
    darkMaxTrackColor?: string;
    lightThumbColor?: string;
    darkThumbColor?: string;
  }
) {
  const {
    lightMinTrackColor,
    darkMinTrackColor,
    lightMaxTrackColor,
    darkMaxTrackColor,
    lightThumbColor,
    darkThumbColor,

    ref,
    ...otherProps
  } = props;

  // no special colors - use same as for the button
  const thumbColor = useThemeColor(
    { light: lightThumbColor, dark: darkThumbColor },
    "button"
  );
  const minTrackColor = useThemeColor(
    { light: lightMinTrackColor, dark: darkMinTrackColor },
    "buttonBackground"
  );
  const maxTrackColor = useThemeColor(
    { light: lightMaxTrackColor, dark: darkMaxTrackColor },
    "buttonBackground"
  );

  return (
    <DefaultSlider
      minimumTrackTintColor={minTrackColor}
      maximumTrackTintColor={maxTrackColor}
      thumbTintColor={thumbColor}

	  // @ts-ignore - ref here is both from Slider and from react types so there's some "problem" 
      ref={ref}

      {...otherProps}
    />
  );
}
