import { useState } from "react";
import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Custom hook that listens to the network state and returns its "connected" status.
 * @returns boolean the network connection state
 */
export default function useNetworkState(): boolean {
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      console.log(
        "Is internet reachable? - ",
        networkState.isInternetReachable
      );

      setConnected(
        !!(networkState.isConnected && networkState.isInternetReachable)
      );
    });

    return unsubscribe;
  }, []);

  return isConnected;
}
