/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

 import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
 import {
	 CompositeScreenProps,
	 NavigatorScreenParams,
 } from "@react-navigation/native";
 import { NativeStackScreenProps } from "@react-navigation/native-stack";
 
 export type AsyncFunction<A, O> = (arg: A) => Promise<O>;
 declare global {
	 namespace ReactNavigation {
		 interface RootParamList extends RootStackParamList {}
	 }
 }
 
 export type RootStackParamList = {
	 Tabs: NavigatorScreenParams<TabsParamList> | undefined;
	 Main: undefined;
	 Login: undefined;
	 Modal: undefined;
	 ModalAddItem: undefined;
	 ModalUpdateItem: {
		 // id of the ListItem to update
		 id: string
	 };
	 NotFound: undefined;
 };
 
 export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	 NativeStackScreenProps<RootStackParamList, Screen>;
 
 export type TabsParamList = {
	 TabOne: undefined;
	 TabTwo: undefined;
 };
 
 export type TabsScreenProps<Screen extends keyof TabsParamList> =
	 CompositeScreenProps<
		 BottomTabScreenProps<TabsParamList, Screen>,
		 NativeStackScreenProps<RootStackParamList>
	 >;
 
 export type SignInData = {
	 email: string;
	 password: string;
 };
 
 export type SignUpData = SignInData | { name: string };
 
 export type AuthState = {
	 isLoading: boolean,
	 isSignout: boolean,
	 authToken?: string,
 };
 
 export type AuthContextValue = {
	 state: AuthState;
	 signIn: AsyncFunction<SignInData, void>;
	 signUp: AsyncFunction<SignUpData, void>;
	 signOut: () => void;
	 restore: (token: string) => void;
 };
 
 
 export type ListItem = {
	 id: string;
	 name: string;
	 expiresAt: Date;
	 daysBefore: number;
	 enabled: boolean;
 };
 
 export type ListState = {
	 list: ListItem[],
 };
 
 export type ListContextValue = {
	 state: ListState,
	 add: AsyncFunction<Omit<ListItem, "id">, void>;
	 update: AsyncFunction<Partial<ListItem>, void>;
	 remove: AsyncFunction<string, void>;
	 refresh: AsyncFunction<void, void>;
 };
 