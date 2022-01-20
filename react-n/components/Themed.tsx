/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
	Text as DefaultText,
	View as DefaultView,
	TextInput as DefaultTextInput,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

/**
 * Hook the returns the color theme prop (for instance "background"/"text"/...) depending
 * on the current theme value, e.g "light"/"dark"
 * If the the the
 * @param props the light and/or dark values
 * @param colorName the color name that will be used to get from the predefined values.
 *                  Used only if such color is not set explicitly in the props,
 *                  e.g. if theme is "light" and the props contain "light" value then use it,
 *                  otherwise use the one defined in the Colors constants
 * @returns 
 */
export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme= useColorScheme();
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};


// Define common main components View/Text/TextInput, specific ones wil be in separate files

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & {
	lightBackgroundColor?: string;
	darkBackgroundColor?: string;
} & DefaultTextInput["props"];

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	// Use theme and default colors if not explicitly set
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

	return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	// Use theme and default colors if not explicitly set
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
	// Use theme and default colors if not explicitly set
	const { style, lightColor, darkColor,
		lightBackgroundColor, darkBackgroundColor,...otherProps } = props;
	const color = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"textInput"
	);const backgroundColor = useThemeColor(
		{ light: lightBackgroundColor, dark: darkBackgroundColor },
		"textInputBackground"
	);
	
	return <DefaultTextInput style={{ color, backgroundColor}} {...props} />;
}
