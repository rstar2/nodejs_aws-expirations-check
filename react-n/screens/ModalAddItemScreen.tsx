import { useState } from "react";
import {
	Button,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Slider from "@react-native-community/slider";

import { Text, View } from "../components/Themed";
import { Separator } from "../components/Separator";
import { HandwrittenTextInput, TextInput } from "../components/TextInput";

import { ListItem, RootStackScreenProps } from "../types";
import { useListContext } from "../state/list/context";

export default function ModalAddItemScreen({
	navigation,
}: RootStackScreenProps<"ModalAddItem">) {
	const [name, setName] = useState("");
	const listContext = useListContext();

	const addHandler = () => {
		listContext.add({
			expiresAt: new Date(),
			name,
		});
		navigation.goBack();
	};

	return (
		// close the keyboard if we tab somewhere else on the screen
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.screen}>
				<TextInput value={name} onChangeText={setName} placeholder="Name" />
				<TextInput value={name} onChangeText={setName} />
				<Slider
					style={{ width: 200, height: 40 }}
					minimumValue={0}
					maximumValue={1}
					minimumTrackTintColor="#FFFFFF"
					maximumTrackTintColor="#000000"
				/>
				<Separator />
				<Button title="Add" onPress={addHandler} />
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
