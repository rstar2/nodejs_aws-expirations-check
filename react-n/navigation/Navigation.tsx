import React from "react";
import { ColorSchemeName, Pressable } from "react-native";

/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { createDrawerNavigator } from '@react-navigation/drawer';

import Colors from "../../react-n/constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import LoginScreen from "../screens/LoginScreen";
import MainScreen from "../screens/MainScreen";
import ModalAddItemScreen from "../screens/ModalAddItemScreen";
import ModalUpdateItemScreen from "../screens/ModalUpdateItemScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import ModalScreen from "../screens/ModalScreen";
import { RootStackParamList, TabsParamList, TabsScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import { ListContextProvider } from "../state/list/context";
import { useAuthContext } from "../state/auth/context";
import { Icon } from "../components/Icon";


export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	const authContext = useAuthContext();
	const authToken = authContext.state.authToken;

	// NOTE: React Navigation handles safe area in the default header.
	// However, if you're using a custom header, it's important to ensure your UI is
	// within the safe area. (e.g like when 'headerShown' is false).
	// SO the screen component has to be wrapped in <SafeAreaView> component (from 'react-native-safe-area-context')
	// it works together with the <SafeAreaProvider>
	{
		/* TODO:  shown or don't show anything and keep the splash screen until state.isLoading */
	}
	return (
		<ListContextProvider>
			<Stack.Navigator>
				{/* if NOT logged-in then show the Login screen, otherwise the "auth" one */}
				{!authToken ? (
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: true, title: "Login title!" }}
					/>
				) : (
					<>
						<Stack.Screen
							name="Main"
							component={MainScreen}
							options={{ headerShown: false }}
						/>

						{/* like a demo */}
						<Stack.Screen
							name="Tabs"
							component={TabNavigator}
							options={{ headerShown: false }}
						/>

						{/* describe all modal here */}
						<Stack.Group screenOptions={{ presentation: "modal" }}>
							<Stack.Screen
								name="ModalAddItem"
								component={ModalAddItemScreen}
								options={{ headerTitle: "Add expiration check" }}
							/>
							<Stack.Screen
								name="ModalUpdateItem"
								component={ModalUpdateItemScreen}
								options={{ headerTitle: "Update expiration check" }}
							/>

							{/* like a demo */}
							<Stack.Screen name="Modal" component={ModalScreen} />
						</Stack.Group>
					</>
				)}

				<Stack.Screen
					name="NotFound"
					component={NotFoundScreen}
					options={{ title: "Oops!" }}
				/>
			</Stack.Navigator>
		</ListContextProvider>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Tab = createBottomTabNavigator<TabsParamList>();

function TabNavigator() {
	const colorScheme = useColorScheme();

	return (
		<Tab.Navigator
			initialRouteName="TabOne"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
			}}
		>
			<Tab.Screen
				name="TabOne"
				component={TabOneScreen}
				options={({ navigation }: TabsScreenProps<"TabOne">) => ({
					title: "Tab One",
					tabBarIcon: ({ color }) => <Icon name="code" color={color} />,
					headerRight: () => (
						<Pressable
							onPress={() => navigation.navigate("Modal")}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1,
							})}
						>
							<Icon
								name="info-circle"
								size={25}
								color={Colors[colorScheme].text}
								style={{ marginRight: 15 }}
							/>
						</Pressable>
					),
				})}
			/>
			<Tab.Screen
				name="TabTwo"
				component={TabTwoScreen}
				options={{
					title: "Tab Two",
					tabBarIcon: ({ color }) => <Icon name="code" color={color} />,
				}}
			/>
		</Tab.Navigator>
	);
}

// const Drawer = createDrawerNavigator();

// function MyDrawer() {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Feed" component={Feed} />
//       <Drawer.Screen name="Article" component={Article} />
//     </Drawer.Navigator>
//   );
// }
