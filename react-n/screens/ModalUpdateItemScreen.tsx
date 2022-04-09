import { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";

import { ListItem, RootStackScreenProps } from "../types";
import { useListContext } from "../state/list/context";

import { HandwrittenText } from "../components/Text";
import EditListItem from "../components/AddEditListItem";
import NoNetworkModal from "../components/NoNetworkModal";

export default function ModalUpdateItemScreen({
  route,
  navigation,
}: RootStackScreenProps<"ModalUpdateItem">) {
  // NOTE: one of the APIs to configure screen options dynamically
  // from inside the screen component
  // the other is from the <Stack.Screen options={}.../> component
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HandwrittenText>Update</HandwrittenText>,
    });
  }, [navigation]);

  const listContext = useListContext();

  // get the ListItem form the passed ID in the params
  const { id } = route.params;

  const item = listContext.state.list.find((item) => item.id === id);

  const updateHandler = async (item: ListItem) => {
    await listContext.update(item);
    navigation.goBack();
  };

  return (
    <>
      <NoNetworkModal />
      <EditListItem item={item} onAction={updateHandler} />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
