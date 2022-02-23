import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 * Expo comes with several pre-configured sets of icons (FontAwesome, Ionicons, MaterialIcons, AntDesign, ...)
 */
import {
	FontAwesome /* , Ionicons, MaterialIcons, AntDesign */,
} from "@expo/vector-icons";

export function Icon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string | OpaqueColorValue;
	size?: number;
	style?: StyleProp<TextStyle>;
}) {
	return (
		<FontAwesome
			size={30}
			{...props}
			style={[{ marginBottom: -3 }, props.style]}
		/>
	);
}
