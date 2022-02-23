import { useReducer, useCallback } from "react";
import {
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import isEmail from "validator/es/lib/isEmail";
import isLength from "validator/es/lib/isLength";

import { Text, TextInput, View } from "../components/Themed";
import { Separator } from "../components/Separator";
import { RootStackScreenProps } from "../types";
import { useAuthContext } from "../state/auth/context";

type Validator = (value: string) => boolean;

const isPassword: Validator = (value) => isLength(value, { min: 5 });

const ACTION_SET_INPUT = "SET_INPUT";
const reducer = (state: State, action: any): State => {
  if (action.type === ACTION_SET_INPUT) {
    const inputs = {
      ...state.inputs,
      [action.input]: action.value,
    };
    const validations = {
      ...state.validations,
      [action.input]: action.isValid,
    };
    return {
      validations,
      inputs,
    };
  }
  return state;
};
const initialState = {
  inputs: {
    email: "",
    password: "",
  },
  validations: {
    email: false,
    password: false,
  },
};
type State = typeof initialState;

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<"Login">) {
  const authContext = useAuthContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const isValid = Object.values(state.validations).every((valid) => valid);

  const inputChangeHandler = (
    input: string,
    validator: Validator | undefined,
    value: string
  ) => {
    dispatch({
      type: ACTION_SET_INPUT,
      input,
      value,
      isValid: validator ? validator(value) : true,
    });
  };
  const loginHandler = () => {
    authContext.signIn({
      email: state.inputs.email,
      password: state.inputs.password,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.screen}>
          {/* <Text style={styles.title}>Login</Text> */}
          <Separator />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize={"none"}
            autoCorrect={false}
            autoCompleteType="email"
            value={state.inputs.email}
            onChangeText={inputChangeHandler.bind(null, "email", isEmail)}
          />
          <TextInput
            placeholder="Password"
            keyboardType="default"
            autoCapitalize={"none"}
            autoCorrect={false}
            autoCompleteType="password"
            value={state.inputs.password}
            onChangeText={inputChangeHandler.bind(null, "password", isPassword)}
            secureTextEntry
          />
          <Separator />
          <Button title="Login" disabled={!isValid} onPress={loginHandler} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  },
});
