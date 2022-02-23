import { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
// import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation/Navigation";
import {
  AuthContextProvider,
  useAuthContext,
  AuthTokenName,
} from "./state/auth/context";
import {
  LoadingContextProvider,
  useLoadingContext,
} from "./state/loading/context";
import AwesomeLoading from "./components/AwesomeLoading";
import { ToastContextProvider } from "./state/error/context";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <ToastContextProvider>
          <LoadingContextProvider>
            <AuthContextProvider>
              <AppMain />
            </AuthContextProvider>
          </LoadingContextProvider>
        </ToastContextProvider>
      </SafeAreaProvider>
    );
  }
}

function AppMain() {
  const theme = useColorScheme();
  const authContext = useAuthContext();
  const loadingContext = useLoadingContext();

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
    <View style={{ flex: 1 }}>
      <AwesomeLoading
        indicatorId={1}
        size={50}
        isActive={loadingContext.isLoading}
        text={loadingContext.text}
      />
      <Navigation theme={theme} />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
});
