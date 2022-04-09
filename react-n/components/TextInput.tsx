import { StyleSheet } from "react-native";

import Fonts from "../constants/Fonts";
import { TextInput as ThemedTextInput, TextInputProps } from "./Themed";

export function TextInput(props: TextInputProps) {
  return (
    <ThemedTextInput
      {...props}
      style={[
        styles.input,
        props.style,
        { opacity: props.editable === false ? 0.5 : 1 },
      ]}
    />
  );
}
export function HandwrittenTextInput(props: TextInputProps) {
  // make the text always with the specific 'fontFamily' and
  // add a default 40px 'fontSize' that can be overwritten by the custom 'style' prop
  return (
    <ThemedTextInput
      {...props}
      style={[
        { fontSize: 30 },
        styles.input,
        props.style,
        { opacity: props.editable === false ? 0.5 : 1 },
        { fontFamily: Fonts.Handwritten },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    // height: 40,
    // margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
