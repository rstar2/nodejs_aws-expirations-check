import { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";

import { ListItem, RootStackScreenProps } from "../types";
import { useListContext } from "../state/list/context";

import { HandwrittenText } from "../components/Text";
import AddListItem from "../components/AddEditListItem";
import NoNetworkModal from "../components/NoNetworkModal";

export default function ModalAddItemScreen({
  route,
  navigation,
}: RootStackScreenProps<"ModalAddItem">) {
  // NOTE: one of the APIs to configure screen options dynamically
  // from inside the screen component
  // the other is from the <Stack.Screen options={}.../> component
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HandwrittenText>Add</HandwrittenText>,
    });
  }, [navigation]);

  const listContext = useListContext();

  const addHandler = async (item: ListItem) => {
    await listContext.add(item);
    navigation.goBack();
  };

  return (
    <>
      <NoNetworkModal />
      <AddListItem onAction={addHandler} />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
