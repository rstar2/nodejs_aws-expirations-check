import React from "react";
import { View, Text, TextStyle, Dimensions, Image } from "react-native";

export interface AwesomeLoadingProps {
  indicatorId: 1 | 2;
  size?: number;
  text?: string;
  textStyle?: TextStyle;
  direction?: "row" | "column";
  isActive: boolean;
}

// dynamic names is not allowed in ReactNative (don't know if it's possible)
const images = {
    1: require(`../assets/images/indicator${1}.gif`),
    2: require(`../assets/images/indicator${2}.gif`),
};

export default function AwesomeLoading(props: AwesomeLoadingProps) {
  const {
    indicatorId,
    size = 50,
    text,
    direction,
    textStyle,
    isActive,
  } = props;

  return isActive ? (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        // opacity: .5,
        flexDirection: direction,
        position: "absolute",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
        zIndex: 999999,
        // elevation: 1,
      }}
    >
      <Image
        style={{ width: size, height: size, alignSelf: "center" }}
        source={images[indicatorId]}
      />
      {text ? <Text style={textStyle}>{text}</Text> : null}
    </View>
  ) : (
    <></>
  );
}
