import { StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

import useNetworkState from "../hooks/useNetworkState";
import { HandwrittenText } from "./Text";

/**
 * Shown a modal dialog (actually no buttons inside, e.g not interactive)
 * when the network state is "not-connected".
 * Should be used like just with: <NoNetworkModal />
 */
export default function NoNetworkModal() {
  const isConnected = useNetworkState();

  return (
    <Modal
      isVisible={!isConnected}
      style={styles.modal}
      animationInTiming={600}
    >
      <View style={styles.container}>
        <HandwrittenText style={styles.title}>Connection Error</HandwrittenText>
        <HandwrittenText style={styles.text}>
          Oops! Looks like your device is not connected to the Internet.
        </HandwrittenText>
        {/* <Button onPress={onRetry} disabled={isRetrying}>
          Try Again
        </Button> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    // justifyContent: "flex-end",
    // margin: 0,
  },
  container: {
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 5,
  },
  title: {
    color: "red",

	// for this the font has to have the right weight:700 ('bold'===700)
    // fontWeight: "bold",
  },
  text: {
    textAlign: "center",
    marginHorizontal: 5,
  },
});
