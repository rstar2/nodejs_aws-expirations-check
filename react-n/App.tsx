import { useEffect } from "react";

import { StatusBar } from "expo-status-bar";
// import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation/Navigation";
import {
	AuthContextProvider,
	useAuthContext,
	AuthTokenName,
} from "./state/auth/context";

export default function App() {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<AuthContextProvider>
					<AppMain />
				</AuthContextProvider>
			</SafeAreaProvider>
		);
	}
}

function AppMain() {
	const theme = useColorScheme();
	const authContext = useAuthContext();

	useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			let authToken;

			try {
				// get from store
				authToken = await SecureStore.getItemAsync(AuthTokenName);
			} catch (e) {
				// Restoring token failed
				console.error("Restoring token failed", e);
			}

			// After restoring token, we may need to validate it in production apps

			if (authToken) {
				// This will switch to the App screen or Auth screen and this loading
				// screen will be unmounted and thrown away.
				authContext.restore(authToken);
			}
		};

		bootstrapAsync();
	}, []);

	return (
		<>
			<Navigation theme={theme} />
			<StatusBar />
		</>
	);
}
