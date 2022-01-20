import Fonts from "../constants/Fonts";
import { Text, TextProps } from "./Themed";

export function MonoText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: Fonts.Mono }]} />;
}

export function HandwrittenText(props: TextProps) {
	// make the text always with the specific 'fontFamily' and
	// add a default 40px 'fontSize' that can be overwritten by the custom 'style' prop 
	return (
		<Text
			{...props}
			style={[{ fontSize: 40 }, props.style, { fontFamily: Fonts.Handwritten }]}
		/>
	);
}
