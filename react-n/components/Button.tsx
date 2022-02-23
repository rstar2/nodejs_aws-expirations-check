import { ColorValue, StyleSheet, TouchableNativeFeedback } from "react-native";

import { View, ButtonProps } from "./Themed";
import { Icon } from "./Icon";
import { HandwrittenText } from "./Text";

export function HandwrittenButton(
  props: Pick<ButtonProps, "title" | "onPress"> & { rippleColor?: ColorValue }
) {
  const { title, onPress, rippleColor, ...otherProps } = props;
  return (
    <View {...otherProps}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={
          rippleColor
            ? TouchableNativeFeedback.Ripple(rippleColor, false)
            : undefined
        }
      >
        <HandwrittenText>{title}</HandwrittenText>
      </TouchableNativeFeedback>
    </View>
  );
}
