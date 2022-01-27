import { useEffect, useLayoutEffect } from "react";
import { Button, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "react-native-check-box";

import { useListContext } from "../state/list/context";
import { View, Text } from "../components/Themed";
import { HandwrittenText } from "../components/StyledText";
import { Separator } from "../components/Separator";
import { ListItem, RootStackScreenProps } from "../types";
import { formatDate, noop } from "../utils";

export default function MainScreen({
  navigation,
}: RootStackScreenProps<"Main">) {
  // NOTE: one of the APIs to configure screen options dynamically
  // from inside the screen component
  // the other is from the <Stack.Screen options={}.../> component
  // const selectionCount = 0;
  // useLayoutEffect(() => {
  // 	navigation.setOptions({
  // 	  title:
  // 		selectionCount === 0
  // 		  ? 'Select items'
  // 		  : `${selectionCount} items selected`,
  // 	});
  //   }, [navigation, selectionCount]);

  const listContext = useListContext();

  useEffect(() => {
    listContext.refresh();
  }, [listContext]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Expirations list</Text>
      <Button title="Add" onPress={() => navigation.navigate("ModalAddItem")} />
      <Separator />
      {!!listContext.state.list.length ? <ViewListHeader /> : <ViewListEmpty />}

      <FlatList
        style={styles.listContainer}
        data={listContext.state.list}
        renderItem={({ item }) => <ViewListItem item={item} />}
      />
    </SafeAreaView>
  );
}

function ViewListEmpty() {
  return (
    <View style={styles.empty}>
      <Text>No expirations set</Text>
    </View>
  );
}
function ViewListHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerItem}>
        <HandwrittenText>Enabled</HandwrittenText>
      </View>
      <View style={styles.headerItem}>
        <HandwrittenText>Name</HandwrittenText>
      </View>
      <View style={styles.headerItem}>
        <HandwrittenText>Expires</HandwrittenText>
      </View>
      <View style={styles.headerItem}>
        <HandwrittenText>Action</HandwrittenText>
      </View>
    </View>
  );
}
function ViewListItem({ item }: { item: ListItem }) {
  const { name, expiresAt, enabled } = item;
  return (
    <View style={styles.listItem}>
      <CheckBox
        style={styles.listItemCheckbox}
        isChecked={enabled}
        onClick={noop}
      />
      <Text>{name}</Text>
      <Text>{formatDate(expiresAt)}</Text>
    </View>
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
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerItem: {
    backgroundColor: "red",
    // fontSize: 20,
    // fontWeight: "bold",
  },
  empty: {
    // backgroundColor: "yellow",
  },
  listContainer: {},
  listItem: {},
  listItemCheckbox: {
    flex: 1,
    padding: 10,
  },
});
