import { useEffect, useState } from "react";

import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Fonts from "../constants/Fonts";

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = useState(false);

	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();

				// Load fonts
				await Font.loadAsync({
					...FontAwesome.font,
					[Fonts.Mono]: require("../assets/fonts/SpaceMono-Regular.ttf"),
					[Fonts.Handwritten]: require("../assets/fonts/somethingwild-Regular.ttf"),
				});
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hideAsync();
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	return isLoadingComplete;
}
