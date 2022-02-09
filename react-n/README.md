## TODO

1. Logging - only dev mode (console.log ?)
1. Login screen - press outside a text-field - keyboard to be closed
1. http error handling
1. loading activity for each action - login/get-list/add/delete/update
1. logout
1. token validation/expiration and auto-logout on expired stored token
1. better handwritten font with cyrillic support
1. use "native" navigation-header and put there the header and add button
1. ~~pull-to-refresh support for the main screen~~
	> Use onRefresh' and 'refreshing' on the 'ScrollView/FlatList/SwipeListView' holding the list
1. ~~swipe-row to update/delete~~
	> Use 'react-native-swipe-list-view'
1. ~~swipe-row to - add animation for the delete icon showing~~
	> use 'swipeAnimatedValue' prop pass by 'react-native-swipe-list-view' to each rendered component
1. ~~swipe-row to - add animation for the deleted row, e.g. shrink it~~
1. push notifications when running in background
