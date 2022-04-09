import { Children, useReducer, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ViewProps,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import isLength from "validator/es/lib/isLength";

import { HandwrittenText } from "./Text";
import { HandwrittenTextInput } from "./TextInput";
import { HandwrittenButton } from "./Button";
import { Switch } from "./Switch";
import { Slider } from "./Slider";
import { Separator } from "./Separator";

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

  // all inputs must be valid
  const isValid = Object.values(state.validations).every((value) => value);

  return (
    // close the keyboard if we tab somewhere else on the screen
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.screen}>
        <Row>
          <Label text="Name" />
          <HandwrittenTextInput
            style={[styles.inputName]}
            value={state.inputs.name}
            onChangeText={(value) =>
              dispatch({ type: "UPDATE_NAME", name: value })
            }
            placeholder="Name"
          />
        </Row>

        <Row>
          <Label text={`Expires on ${formatDate(state.inputs.expiresAt)}`} />
          <HandwrittenButton
            onPress={() => setDatePickerVisibility(true)}
            title="Change"
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            date={state.inputs.expiresAt}
            onConfirm={(date) => {
              console.log("Date change,", date);
              dispatch({ type: "UPDATE_EXPIRES_AT", expiresAt: date });
              setDatePickerVisibility(false);
            }}
            onCancel={() => {
              console.log("Date cancel");
              setDatePickerVisibility(false);
            }}
          />
        </Row>

        <Row>
          <Label text={`Notify me ${state.inputs.daysBefore} days before`} />
          <Slider
            style={[styles.slider]}
            minimumValue={1}
            maximumValue={14}
            value={state.inputs.daysBefore}
            onValueChange={(value) =>
              dispatch({ type: "UPDATE_DAYS_BEFORE", daysBefore: value })
            }
          />
        </Row>

        <Row>
          <Label text="Enabled" />
          <Switch
            style={styles.switch}
            value={state.inputs.enabled}
            onValueChange={(value) =>
              dispatch({ type: "UPDATE_ENABLED", enabled: value })
            }
          />
        </Row>

        <Separator />

        <HandwrittenButton
          style={styles.button}
          title={item ? "Edit" : "Add"}
          onPress={actionHandler}
          disabled={!isValid}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const Row = (props: ViewProps) => (
  <View style={styles.row}>{props.children}</View>
);
const Label = ({ text }: { text: string }) => (
  <HandwrittenText style={styles.label}>{text}</HandwrittenText>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
	marginHorizontal: 5,
    // backgroundColor: "transparent",
  },
  label: {
    marginRight: 5,
  },
  inputName: {
    flexGrow: 1,
  },
  slider: {
    maxWidth: 200,
    flexGrow: 1,
    marginRight: 5,
  },
  switch: {
    flex: 0,
    justifyContent: "flex-start",
  },
  button: {
    marginHorizontal: 10,
  },
});
