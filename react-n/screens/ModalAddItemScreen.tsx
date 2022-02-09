import { StyleSheet } from "react-native";

import { ListItem, RootStackScreenProps } from "../types";
import { useListContext } from "../state/list/context";
import AddListItem from "../components/AddEditListItem";

export default function ModalAddItemScreen({
  navigation,
}: RootStackScreenProps<"ModalAddItem">) {
  const listContext = useListContext();

  const addHandler = async (item: ListItem) => {
    await listContext.add(item);
    navigation.goBack();
  };

  return <AddListItem onAction={addHandler} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
