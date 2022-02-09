import { useReducer, useState } from "react";
import {
  Button,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Slider from "@react-native-community/slider";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import isLength from "validator/es/lib/isLength";

import { Text, View } from "./Themed";
import { Separator } from "./Separator";
import { HandwrittenTextInput, TextInput } from "./TextInput";

import { ListItem } from "../types";
import { formatDate } from "../utils";

type ItemState = {
  inputs: {
    name: string;
    expiresAt: Date;
    daysBefore: number;
    enabled: boolean;
  };
  validations: {
    name: boolean;
    expiresAt: boolean;
    daysBefore: boolean;
  };
};
type ItemActionUpdateName = {
  type: "UPDATE_NAME";
  name: string;
};
type ItemActionUpdateExpiresAt = {
  type: "UPDATE_EXPIRES_AT";
  expiresAt: Date;
};
type ItemActionUpdateDaysBefore = {
  type: "UPDATE_DAYS_BEFORE";
  daysBefore: number;
};
type ItemActionUpdateEnable = {
  type: "UPDATE_ENABLED";
  enabled: boolean;
};

type ItemAction =
  | ItemActionUpdateName
  | ItemActionUpdateExpiresAt
  | ItemActionUpdateDaysBefore
  | ItemActionUpdateEnable;

const reducer = (state: ItemState, action: ItemAction): ItemState => {
  let inputs, validations;
  switch (action.type) {
    case "UPDATE_NAME":
      inputs = { ...state.inputs, name: action.name };
      validations = {
        ...state.validations,
        name: isLength(action.name, { min: 5, max: 50 }),
      };
      break;
    case "UPDATE_EXPIRES_AT":
      inputs = { ...state.inputs, expiresAt: action.expiresAt };
      validations = {
        ...state.validations,
        expiresAt: action.expiresAt.getTime() >= Date.now(),
      };

      break;
    case "UPDATE_DAYS_BEFORE":
      const daysBefore = getPositiveInt(action.daysBefore);
      inputs = { ...state.inputs, daysBefore };
      validations = {
        ...state.validations,
        daysBefore: action.daysBefore >= 1 && daysBefore <= 14,
      };
      break;
    case "UPDATE_ENABLED":
      inputs = { ...state.inputs, enabled: action.enabled };
      break;
  }

  if (inputs) {
    // if no validations updated then reuse the current
    return { inputs, validations: validations ?? state.validations };
  }
  return state;
};

const getPositiveInt = (num: number) => Math.round(num);

const initialState: ItemState = {
  inputs: {
    name: "",
    expiresAt: new Date(),
    daysBefore: 3,
    enabled: true,
  },
  validations: {
    name: false,
    expiresAt: true,
    daysBefore: true,
  },
};

const createInitialState = (item?: ListItem): ItemState => {
  if (!item) return initialState;

  return {
    inputs: {
      ...item,
    },
    validations: {
      ...initialState.validations,
      name: true,
    },
  };
};

export default function AddEditListItem({
  item,
  onAction,
}: {
  item?: ListItem;
  onAction: (item: ListItem) => void;
}) {
  const [state, dispatch] = useReducer(reducer, createInitialState(item));

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const actionHandler = () => {
    onAction({
      ...state.inputs,
      id: item?.id ?? "CREATE_DUMMY_ID",
    });
  };

  return (
    // close the keyboard if we tab somewhere else on the screen
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container}>
        <Text>Name</Text>
        <TextInput
          value={state.inputs.name}
          onChangeText={(value) =>
            dispatch({ type: "UPDATE_NAME", name: value })
          }
          placeholder="Name"
        />

        <Text>Expires At</Text>
        <Text>{formatDate(state.inputs.expiresAt)}</Text>
        <Button onPress={() => setDatePickerVisibility(true)} title="Set" />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={state.inputs.expiresAt}
          onConfirm={(date) =>
            dispatch({ type: "UPDATE_EXPIRES_AT", expiresAt: date })
          }
          onCancel={() => setDatePickerVisibility(false)}
        />

        <Text>Notify me {state.inputs.daysBefore} days before</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={14}
          value={state.inputs.daysBefore}
          onValueChange={(value) =>
            dispatch({ type: "UPDATE_DAYS_BEFORE", daysBefore: value })
          }
        />

        <Text>Enabled</Text>

        <Switch
          style={{ flex: 0, justifyContent: "flex-start" }}
          value={state.inputs.enabled}
          onValueChange={(value) =>
            dispatch({ type: "UPDATE_ENABLED", enabled: value })
          }
        />

        <Separator />

        <Button title={item ? "Edit" : "Add"} onPress={actionHandler} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
