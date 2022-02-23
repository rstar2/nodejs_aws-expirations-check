import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

/**
 * Union type for TS/JS integrated primitive types like string, number or boolean
 */
export type Primitive = string | number | boolean;

/**
 * Type safe value for a {@link JSONObject} object
 * It uses TypeScript's recursive type aliases
 */
export type JSONValue = Primitive | undefined | null | JSONValue[] | JSONObject;

/**
 * Type safe JSON-like object
 * It uses TypeScript's recursive type aliases
 */
export type JSONObject = { [k: string]: JSONValue };

// configure the notifications when receive while the app is running (e.g. on the foreground)
// to show notification, otherwise only if it's in the back-ground then it will show
export function setNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// NOTE: Android don't require permissions to receive notifications
export async function schedulePushNotification({
  title,
  body,
  data,
  triggerDate
}: {
  title: string;
  body: string;
  data?: JSONObject;
  triggerDate: Date | number;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { date: triggerDate },
  });
}

export async function requestNotificationPermissions() {
  // NOTE: Android don't require permissions to receive/schedule notifications

  // for iOS rely on 'ios.status' field (permissions for sending notifications are a little more granular here)
  // for Android on the 'granted' field is enough
  let permStatus = await Notifications.getPermissionsAsync();
  let allowed =
    permStatus.granted ||
    permStatus.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  if (!allowed) {
    permStatus = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    allowed =
      permStatus.granted ||
      permStatus.ios?.status ===
        Notifications.IosAuthorizationStatus.PROVISIONAL;
  }

  return allowed;
}

export async function registerForPushNotifications() {
  let token;
  if (Device.isDevice) {
    // this implies that proper notification permissions are granted,()' has been called
    // e.g. the 'requestNotificationPermissions()' has been called
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    // console.error("Must use physical device for Push Notifications");
	return;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
