import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from "../components/Themed";
import { Separator } from "../components/Separator";
import { RootStackScreenProps } from "../types";
import { useAuthContext } from "../state/auth/context";

export default function LoginScreen({
	navigation,
}: RootStackScreenProps<"Login">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const authContext = useAuthContext();

	return (
		<SafeAreaView style={styles.screen}>
			<Text style={styles.title}>Login / Register</Text>
			<Separator />
			<TextInput placeholder="Email" value={email} onChangeText={setEmail} />
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<Separator />
			<Button
				title="Login"
				disabled={!email || !password}
				onPress={() => authContext.signIn({ email, password })}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	}
});
