import { Platform, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

import { WebView } from "react-native-webview";

import { Text, View } from "../components/Themed";
import { Separator } from "../components/Separator";

export default function ModalScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Modal</Text>

      <Separator />

      <WebView
        style={styles.webView}
        //   source={{ uri: "https://expo.dev" }}
        source={{ html: buildHTML("JzS96auqau0", Dimensions.get("window")) }}
        allowsFullscreenVideo={false}
        allowsInlineMediaPlayback
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const htmlStyle = `
  <style>
    html {
      overflow-y: hidden;
      overflow-x: hidden;
      height: 100%;
    }
    body {
      background-color: black;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }
  </style>
`;

const buildHTML = (
  videoId: string,
  { width, height }: { width: number; height: number }
) => `
        <!DOCTYPE html>
        <html>
          <head>
            ${htmlStyle}
            <meta name="viewport" content="initial-scale=1">
            <title>Navigation Delegate Example</title>
          </head>
          <body>${buildPlayer(videoId, width, height)}</body>
        </html>
        `;

const buildPlayer = (videoId: string,
	width: number, height: number) => `
<!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>

    <script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          // height: '${height}',
          width: '${width}',
          videoId: '${videoId}',
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
    </script>`;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  webView: {
    flex: 1,
  },
});
