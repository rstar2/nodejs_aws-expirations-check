import { isValidElement, useState } from "react";
import {
  Button,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Slider from "@react-native-community/slider";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Text, View } from "../components/Themed";
import { Separator } from "../components/Separator";
import { HandwrittenTextInput, TextInput } from "../components/TextInput";

import { ListItem, RootStackScreenProps } from "../types";
import { useListContext } from "../state/list/context";
import { formatDate, noop } from "../utils";

export default function ModalAddItemScreen({
  navigation,
}: RootStackScreenProps<"ModalAddItem">) {
  const listContext = useListContext();

  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState(new Date());
  const [daysBefore, setDaysBefore] = useState(3);
  const [enabled, setEnabled] = useState(true);

  const [modal, setModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const addHandler = () => {
    listContext.add({
      name,
      expiresAt,
      daysBefore,
      enabled,
    });
    navigation.goBack();
  };

  return (
    // close the keyboard if we tab somewhere else on the screen
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.screen}>
        <Text>Name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Name" />

        <Text>Expires At</Text>
        <Text onPress={() => setDatePickerVisibility(true)}>
          {formatDate(expiresAt)}
        </Text>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={expiresAt}
          onConfirm={(date) => {
            setExpiresAt(date);
            setDatePickerVisibility(false);
          }}
          onCancel={noop}
        />

        <Text>Name</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={14}
          value={daysBefore}
          onValueChange={setDaysBefore}
        />

		<Text>Enabled</Text>
        <Switch
          style={{ flex: 0, justifyContent: "flex-start" }}
          value={enabled}
          onValueChange={setEnabled}
        />

        <Separator />

        <Button title="Add" onPress={addHandler} />
      </ScrollView>
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
