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
