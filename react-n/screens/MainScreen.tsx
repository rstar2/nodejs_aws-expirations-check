import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  useWindowDimensions,
  Animated,
  View,
  Alert,
} from "react-native";
import CheckBox from "react-native-check-box";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";

// @ts-ignore
// import Drawer from "react-native-circle-drawer";
import Drawer from "../components/Drawer";

import * as Notifications from "expo-notifications";

import { useAuthContext } from "../state/auth/context";
import { useListContext } from "../state/list/context";
import { HandwrittenText } from "../components/Text";
import { HandwrittenButton } from "../components/Button";
import { ListItem, RootStackScreenProps } from "../types";
import { formatDate, noop } from "../utils";
import { Icon } from "../components/Icon";
import Colors from "../constants/Colors";
import { CircleIconButton } from "../components/CircleIconButton";
import {
  registerForPushNotifications,
  requestNotificationPermissions,
  schedulePushNotification,
  setNotificationHandler,
} from "../utils/notifications";
import { useToastContext } from "../state/error/context";
import NoNetworkModal from "../components/NoNetworkModal";

const HIDDEN_ACTION_VIEW_WIDTH = 75;

export default function MainScreen({
  navigation,
}: RootStackScreenProps<"Main">) {
  const drawerOpened = useRef(false);
  const drawer = useRef<Drawer>(null);

  const { state, refresh, remove } = useListContext();

  const [isRefreshing, setRefreshing] = useState(false);

  // flags which rows are being deleted
  const [deleting, setDeleting] = useState<{ [key: string]: boolean }>({});

  const { width: screenWidth } = useWindowDimensions();

  const { show } = useToastContext();

  const loadList = async () => {
    console.log("Load list");
    setRefreshing(true);
    try {
      await refresh();
    } catch (err) {
      show("Failed to refresh", true);
    }
    setRefreshing(false);
  };

  // NOTE: one of the APIs to configure screen options dynamically
  // from inside the screen component
  // the other is from the <Stack.Screen options={}.../> component
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HandwrittenText style={styles.title}>Expirations list</HandwrittenText>
      ),

      headerLeft: ({ tintColor }) => (
        <CircleIconButton
          name="bars"
          color={tintColor ?? Colors.dark.icon}
          size={17}
          onPress={() => {
            // toggle the drawer
            if (drawerOpened.current) drawer.current?.close();
            else drawer.current?.open();
            drawerOpened.current = !drawerOpened.current;
          }}
        />
      ),
      headerRight: ({ tintColor }) => (
        <CircleIconButton
          name="plus"
          color={tintColor ?? Colors.dark.icon}
          size={17}
          onPress={() => navigation.navigate("ModalAddItem")}
        />
      ),
    });
  }, [navigation]);

  // remove the dependencies so only once execute the effect (and call refresh),
  // the context will be changed, because context.state will be changed
  // as result of the refresh updating it so
  // if 'refresh' is added as dependency the infinite loop/cycle will happen
  useEffect(() => {
    loadList();
  }, []);

  // if list is changed then reset the deleting state
  useEffect(() => {
    setDeleting({});
  }, [state.list]);

  useEffect(() => {
    // setup notifications
    setNotificationHandler();
    requestNotificationPermissions().then(() => registerForPushNotifications());

    // register a listener that will react when a notification is received
    // NOTE: it will be called only when app is in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NotificationReceived", notification);
      }
    );

    // register a listener that will react when user interacted with the notification
    // NOTE! called when app is Foreground/Background/Killed
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("NotificationResponseReceived", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const onDeletePressed = (item: ListItem) => {
    console.log("Delete pressed", item.name);
    setDeleting((deleting) => ({ ...deleting, [item.id]: true }));
  };
  const onDelete = (item: ListItem) => {
    console.log("Delete", item.name);
    remove(item.id);
  };

  const onEdit = (item: ListItem) => {
    console.log("Edit", item.name);
    navigation.navigate("ModalUpdateItem", { id: item.id });
  };

  // swipe to delete
  // https://github.com/jemise111/react-native-swipe-list-view/blob/master/docs/actions.md
  // https://github.com/jemise111/react-native-swipe-list-view/blob/master/SwipeListExample/examples/actions.js
  // https://www.youtube.com/watch?v=k-Ra0tdCEOc&t=94s
  // https://www.youtube.com/watch?v=1y_B4tBezQQ&t=1767s

  return (
    <View style={styles.screen}>
      <NoNetworkModal />
      <Drawer
        ref={drawer}
        sideMenu={<SideMenu />}
        marginLeft={10}
        marginTop={10}
      >
        {!state.list.length && <ListEmpty />}

        {/* a demo how to show schedule notifications */}
        {/* <HandwrittenButton
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification({
              title: "You've got mail! 📬",
              body: "Here is the notification body",
              data: { data: "goes here" },
			  triggerDate: Date.now() + 3*1000
            });
          }}
        /> */}

        <SwipeListView
          onRefresh={loadList}
          refreshing={isRefreshing}
          style={styles.listContainer}
          data={state.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RowListItem
              item={item}
              deleting={deleting[item.id]}
              onEdit={onEdit}
            />
          )}
          renderHiddenItem={({ item }, rawMap) => (
            <RowListItemHidden
              item={item}
              onDeletePressed={onDeletePressed}
              deleting={deleting[item.id]}
              onDelete={onDelete}
              onEdit={onEdit}
              swipeRow={rawMap[item.id]}
            />
          )}
          // when swiping from left to right
          // and this left value is passed the swipe will open to it when gesture is released
          // only a single button on the left
          leftOpenValue={HIDDEN_ACTION_VIEW_WIDTH}
          // when swiping from right to left
          // and this right value is passed the swipe will open to it when gesture is released
          // we have 2 buttons on the right so multiply with 2
          rightOpenValue={-(2 * HIDDEN_ACTION_VIEW_WIDTH)}
          // when swiping from right to left
          // and this right value is passed then the transformX of the swipe will be set to the 'rightActionValue'
          // (e.g. the visible component will be shifted to the left) and in this case it will appear are removed as this is -screenWidth
          // also the onRightAction() will be called and the 'rightActionActivated' prop action (that's passed
          // to each visible/hidden rendered component) will be set to true
          rightActivationValue={-screenWidth / 2}
          rightActionValue={-screenWidth}
          // existing of 'onRightActionStatusChange' is obligatory in order to use 'rightActionActivated'
          onRightActionStatusChange={noop}
          useNativeDriver={false}
        />
      </Drawer>
    </View>
  );
}

function SideMenu() {
  const { signOut } = useAuthContext();
  return (
    <View style={styles.sideMenu}>
      <HandwrittenButton
        onPress={() => {
          Alert.alert("Sign out", "Do you really want to sign out?", [
            {
              text: "Cancel",
              onPress: noop,
              style: "cancel",
            },
            { text: "OK", onPress: signOut },
          ]);
        }}
        title="Logout"
      />
    </View>
  );
}

function ListEmpty() {
  return (
    <View style={styles.listEmpty}>
      <HandwrittenText>No expirations set</HandwrittenText>
    </View>
  );
}

type RowListItemProps = {
  item: ListItem;
  onEdit: (item: ListItem) => void;
  deleting?: boolean;
};
function RowListItem(props: RowListItemProps) {
  const heightAnimatedValue = useRef(
    new Animated.Value(ROW_ITEM_HEIGHT)
  ).current;

  const { item, deleting, onEdit } = props;
  const { name, expiresAt, enabled } = item;

  // @ts-ignore - this leftActionActivated is also auto-passed from react-native-swipe-list-view
  const rightActionActivated: boolean = props.rightActionActivated;

  //   console.log("render visible item", item.name, rightActionActivated);

  if (rightActionActivated || deleting) {
    Animated.timing(heightAnimatedValue, {
      toValue: 0,
      delay: 200,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      //   console.log("render visible item - animation finished");
    });
  }

  return (
    <TouchableHighlight
      style={{ width: "100%" }}
      onLongPress={() => onEdit(item)}
    >
      <Animated.View style={[styles.listItem, { height: heightAnimatedValue }]}>
        <CheckBox
          style={styles.listItemCheckbox}
          isChecked={enabled}
          onClick={noop}
        />
        <View style={styles.listItemInfo}>
          <HandwrittenText style={styles.listItemText}>{name}</HandwrittenText>
          <HandwrittenText style={styles.listItemText}>
            {formatDate(expiresAt)}
          </HandwrittenText>
        </View>
      </Animated.View>
    </TouchableHighlight>
  );
}

type RowListItemHiddenProps = {
  item: ListItem;
  deleting?: boolean;
  onDeletePressed: (item: ListItem) => void;
  onDelete: (item: ListItem) => void;
  onEdit: (item: ListItem) => void;
  swipeRow: SwipeRow<ListItem>;
};
function RowListItemHidden(props: RowListItemHiddenProps) {
  const { width: screenWidth } = useWindowDimensions();

  const heightAnimatedValue = useRef(
    new Animated.Value(ROW_ITEM_HEIGHT)
  ).current;

  const deleteWidthAnimatedValue = useRef(
    new Animated.Value(HIDDEN_ACTION_VIEW_WIDTH)
  ).current;

  const { item, deleting, onDeletePressed, onEdit, onDelete, swipeRow } = props;

  // @ts-ignore - this swipeAnimatedValue is auto-passed from react-native-swipe-list-view to each
  // visible/hidden rendered item. (But is not in its types.d.ts)
  const swipeAnimatedValue: Animated.Value = props.swipeAnimatedValue;
  // @ts-ignore - this leftActionActivated is also auto-passed from react-native-swipe-list-view
  const rightActionActivated: boolean = props.rightActionActivated;

  //   console.log("render hidden item", item.name, rightActionActivated);

  if (rightActionActivated || deleting) {
    console.log("render hidden item - animation start");
    Animated.timing(heightAnimatedValue, {
      toValue: 0,
      delay: 200,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      //   console.log("render hidden item - animation finished");
      onDelete(item);
    });

    Animated.timing(deleteWidthAnimatedValue, {
      toValue: screenWidth,
      useNativeDriver: false,
    }).start(() => {
      console.log("delete width - animation finished");
    });
  }

  return (
    <Animated.View
      style={[
        styles.listItem,
        styles.listItemHidden,
        { height: heightAnimatedValue },
      ]}
    >
      <TouchableOpacity
        style={[styles.listItemHiddenLeft, styles.listItemHiddenItem]}
        onPress={() => {
          swipeRow.closeRow();
          onEdit(item);
        }}
      >
        <Animated.View
          style={[
            {
              transform: [
                {
                  scale: swipeAnimatedValue.interpolate({
                    inputRange: [
                      HIDDEN_ACTION_VIEW_WIDTH / 2,
                      HIDDEN_ACTION_VIEW_WIDTH,
                    ],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <Icon name="edit" color={Colors.dark.icon} size={17} />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.listItemHiddenRight}>
        <TouchableOpacity
          style={[styles.listItemHiddenItem, styles.listItemHiddenUpdate]}
          onPress={() => swipeRow.closeRow()}
        >
          <Icon name="close" color={Colors.dark.icon} size={17} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.listItemHiddenItem,
          styles.listItemHiddenDelete,
          { width: deleteWidthAnimatedValue },
        ]}
      >
        <TouchableOpacity onPress={() => onDeletePressed(item)}>
          <Animated.View
            style={[
              {
                transform: [
                  {
                    // scale the view according to the swipeX value
                    // so when swipeX is between [-37.5,-75] then interpolate this value to [0, 1]
                    // and clamp (meaning if value is bigger than -37.5 (like -30) it will be 0,
                    // if is lesser than -75 then it will be 1) - NOTE! than we are swiping form right to left
                    scale: swipeAnimatedValue.interpolate({
                      inputRange: [
                        -HIDDEN_ACTION_VIEW_WIDTH,
                        -HIDDEN_ACTION_VIEW_WIDTH / 2,
                      ], // inputRange has to be "increasing", e.g from smaller t bigger value
                      outputRange: [1, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="trash" color={Colors.dark.icon} size={17} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const ROW_ITEM_HEIGHT = 40;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 40,
  },
  sideMenu: {
    flex: 1,
    backgroundColor: "gray",
    padding: 20,
  },
  listEmpty: {
    // backgroundColor: "yellow",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    // backgroundColor: "white"
  },

  listItem: {
    width: "100%",
	overflow: "hidden",
    height: ROW_ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "cyan",
    // marginBottom: 5,
  },
  listItemCheckbox: {
    // padding: 10,
  },
  listItemInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemText: {
    fontSize: 28,
  },
  listItemHidden: {
    height: ROW_ITEM_HEIGHT,
    backgroundColor: "grey",
    justifyContent: "space-between",
  },
  listItemHiddenLeft: {
    backgroundColor: "blue",
    alignItems: "center",
    height: "100%",
  },
  listItemHiddenRight: {
    flexDirection: "row",
    height: "100%",
  },
  listItemHiddenItem: {
    width: HIDDEN_ACTION_VIEW_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemHiddenUpdate: {
    backgroundColor: "darkgrey",
    // add a "placeholder" where the absolute 'listItemHiddenDelete' will be visible
    marginRight: HIDDEN_ACTION_VIEW_WIDTH,
  },
  listItemHiddenDelete: {
    backgroundColor: "red",
    width: HIDDEN_ACTION_VIEW_WIDTH,
    position: "absolute",
    right: 0,
  },
});
