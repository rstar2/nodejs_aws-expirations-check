## TODO

1. ~~Logging (console.log)- only in dev mode?~
	> Use Babel plugin 'transform-remove-console' that removes console.xxx statements. If needed logging can be wrapped in a custom utility function that logs to Sentry or similar service, but needed for now.
1. ~~Login screen - press outside a text-field - keyboard to be closed~~
	> Wrap in ```<TouchableWithoutFeedback onPress={Keyboard.dismiss}>```
1. ~~global http error handling~~
	> Use just plain RN ToastAndroid from Android
1. ~~loading activity for each action - /get-list/add/delete/update~~
1. ~~logout~~
	> not needed to use @react-navigation/drawer as this is if navigation-screens are required,	so use react-native-circle-drawer as it don't interfere with other swipe gestures in the table
	> clear the stored token
1. ~~better handwritten font with cyrillic support~~
1. ~~use "native" navigation-header and put there the header and add button~~
1. ~~pull-to-refresh support for the main screen~~
	> Use onRefresh' and 'refreshing' on the 'ScrollView/FlatList/SwipeListView' holding the list
1. ~~swipe-row to update/delete~~
	> Use 'react-native-swipe-list-view'
1. ~~swipe-row to - add animation for the delete icon showing~~
	> use 'swipeAnimatedValue' prop pass by 'react-native-swipe-list-view' to each rendered component
1. ~~swipe-row to - add animation for the deleted row, e.g. shrink it~~
1. push notifications
	> client app is ready, just the server remains
1. token validation/expiration and auto-logout on expired stored token
1. Build & Deploy to AppStore
	> For building use the classic build process - https://docs.expo.dev/classic/building-standalone-apps/
		
		- build APK ```expo build:android -t apk```
		- let expo generate keystore and save it locally with ```expo fetch:android:keystore```
		- test on Android emulator - drag and drop the .apk into the emulator.
		- test on real device - ```adb install app-filename.apk``` with "USB debugging enabled on your device" and the device plugged in
		- publish it on Expo (this is different then "submit to an app store")

## Tasks

- Fix list gaps when removed an item - margins are not good
- ~~apply the app theme styles to the DatePicker if possible (colors, font)~~
	> I don't find a way, don't think it's possible - it's native component with no such props
- ~~apply the app theme styles to the Switch and Slider~~
	> Note - they are native elements - so only colors are possible (and images which I don't need)
- apply the app theme styles to the Drawer - if not possible then use its source directly here and then styling will be possible as I need
- Better theme colors - dark and light (tint color of the navigation header also)
- add error-validation styles to each "invalid" row/field in Add/Edit screen? Idea is somehow user to understand why the "Add" button is not enabled
- ~~listen to Internet connectivity and notify user if there's none currently~~
	> Use '@react-native-community/netinfo', and my custom hook useNetworkState and a component ```<NoNetworkModal />``` 
