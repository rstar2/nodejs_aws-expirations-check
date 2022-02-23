import { ColorValue, StyleSheet, TouchableNativeFeedback } from "react-native";

import { View } from "./Themed";
import { Icon } from "./Icon";

export function CircleIconButton(props: {
  onPress?: React.ComponentProps<typeof TouchableNativeFeedback>["onPress"];
  name: React.ComponentProps<typeof Icon>["name"];
  color: React.ComponentProps<typeof Icon>["color"];
  rippleColor?: ColorValue;
  size?: React.ComponentProps<typeof Icon>["size"];
  style?: React.ComponentProps<typeof Icon>["style"];
}) {
  const { onPress, rippleColor, ...otherProps } = props;
  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={
          rippleColor
            ? TouchableNativeFeedback.Ripple(rippleColor, false)
            : undefined
        }
      >
        <View style={styles.button}>
          <Icon {...otherProps} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  // wrap the button in a container to clip/ the ripple effect from the TouchableNativeFeedback
  container: {
    borderRadius: 300000,
    overflow: "hidden",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 300000,
  },
});
