import { ColorValue, StyleProp, StyleSheet, TouchableNativeFeedback, ViewStyle } from "react-native";

import { View, ButtonProps, useThemeColor } from "./Themed";
import { HandwrittenText } from "./Text";

export function HandwrittenButton(
  props: Pick<ButtonProps, "title" | "onPress" | "disabled"> & {
    rippleColor?: ColorValue;
  } & {
    lightColor?: string;
    darkColor?: string;
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
	style?: StyleProp<ViewStyle>
  }
) {
  const { title, disabled, onPress, style, lightColor, darkColor,
	lightBackgroundColor, darkBackgroundColor, 
	rippleColor, ...otherProps } = props;
  // actually otherProps will be empty object {} as all allowed props are already descrtuctured
  // but keep it like that for easy extensibility and implementing any other props

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "button");
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    "buttonBackground"
  );

  return (
    <View style={style} {...otherProps}>
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={disabled}
        background={
          rippleColor
            ? TouchableNativeFeedback.Ripple(rippleColor, false)
            : //use default ripple color (auto-detected depending on the background)
              undefined
        }
      >
        {/* NOTE: Has to be wrapped in a View in order for correctly working of the props:
		      1. ripple 
			  2. disabled
		   */}
        <View style={[styles.touchable, {backgroundColor}, {opacity: disabled ? 0.5 : 1}]}>
          <HandwrittenText style={[styles.text, {color}]}>{title}</HandwrittenText>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    // borderColor: "red",
    borderWidth: 1,
	borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  text: { alignSelf: "center" },
});
