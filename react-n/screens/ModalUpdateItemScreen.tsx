import { StyleSheet } from "react-native";

import { ListItem, RootStackScreenProps } from "../types";
import { useListContext } from "../state/list/context";
import EditListItem from "../components/AddEditListItem";

export default function ModalUpdateItemScreen({
  route,
  navigation,
}: RootStackScreenProps<"ModalUpdateItem">) {
  const listContext = useListContext();

  // get the ListItem form the passed ID in the params
  const { id } = route.params;

  const item = listContext.state.list.find((item) => item.id === id);

  const updateHandler = async (item: ListItem) => {
    await listContext.update(item);
    navigation.goBack();
  };

  return <EditListItem item={item} onAction={updateHandler} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
